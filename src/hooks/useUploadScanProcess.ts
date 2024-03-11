import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useImageStore } from '../store/ImageStore';
import { useUploadStore } from '../store/UploadStore';
import { deleteFilesInBackground } from '../utils/fileSystem';
import {
  finishUploadSession,
  prepareDocument,
  startUploadSession,
  uploadPdfDocuments,
  UploadProcessError,
  UserAbortError,
} from '../utils/scanUtils';
import { captureError } from '../utils/sentry';
import { useGetCurrentCustomer } from './queries/useGetCurrentCustomer';
import { useGetCurrentUser } from './queries/useGetCurrentUser';
import { useApi } from './useApi';

export const useUploadScanProcess = () => {
  const api = useApi();
  const currentCustomer = useGetCurrentCustomer();
  const { currentUser } = useGetCurrentUser();
  const { company, documentType, images } = useImageStore();
  const { t } = useTranslation();
  const uploadStore = useUploadStore();

  const abortUploadProcess = useCallback(() => uploadStore.setIsAbortRequested(true), [uploadStore]);

  const shouldAbort = useCallback(() => uploadStore.isAbortRequested, [uploadStore]);

  const startUploadProcess = useCallback(() => {
    uploadStore.reset();
    uploadStore.startPreparingDocuments();

    const errorContext: Record<string, unknown> = {
      company: company?.Id,
      customer: currentCustomer.customerId,
      documentType: documentType?.key,
      images,
      user: currentUser?.Email,
    };

    prepareDocument(images, shouldAbort)
      .then((pdfDocuments) => {
        errorContext.pdfDocuments = pdfDocuments;

        if (pdfDocuments.length === 0) {
          throw new UploadProcessError('prepareDocuments finished successfully but 0 PDF documents were created');
        }

        uploadStore.startUploadSession();
        startUploadSession(api, company, documentType, shouldAbort)
          .then((sessionId) => {
            errorContext.sessionId = sessionId;

            uploadStore.startUploadingDocuments();
            uploadPdfDocuments(api, sessionId, pdfDocuments, shouldAbort)
              .then(() => {
                uploadStore.startFinalizingSession();
                finishUploadSession(api, sessionId)
                  .then(() => {
                    uploadStore.setUploadSucceededState();
                    deleteFilesInBackground(pdfDocuments);
                  })
                  .catch((reason) => {
                    captureError(reason, 'An error occurred during the upload process.', 'warning', errorContext);

                    uploadStore.failFinalizingSession(t('scan.upload_finalize_warning'));
                    deleteFilesInBackground(pdfDocuments);
                  });
              })
              .catch((reason) => {
                const isUserAbort = reason instanceof UserAbortError;
                uploadStore.failUploadingDocuments(
                  t(isUserAbort ? 'scan.upload_user_aborted' : 'scan.upload_upload_error'),
                  isUserAbort,
                );

                if (!isUserAbort) {
                  captureError(reason, 'Failed to upload a document', 'error', errorContext);
                }

                deleteFilesInBackground(pdfDocuments);
              });
          })
          .catch((reason) => {
            const isUserAbort = reason instanceof UserAbortError;
            uploadStore.failStartingUploadSession(
              t(isUserAbort ? 'scan.upload_user_aborted' : 'scan.upload_start_session_error'),
              isUserAbort,
            );

            if (!isUserAbort) {
              captureError(reason, 'Failed to start upload session', 'error', errorContext);
            }

            deleteFilesInBackground(pdfDocuments);
          });
      })
      .catch((reason) => {
        const isUserAbort = reason instanceof UserAbortError;
        uploadStore.failPreparingDocuments(
          t(isUserAbort ? 'scan.upload_user_aborted' : 'scan.upload_generate_document_error'),
          isUserAbort,
        );

        if (!isUserAbort) {
          captureError(reason, 'Failed to prepare PDF document', 'error', errorContext);
        }
      });
  }, [api, company, currentCustomer.customerId, currentUser?.Email, documentType, images, shouldAbort, t, uploadStore]);

  return {
    abortUploadProcess,
    shouldAbort,
    startUploadProcess,
  };
};
