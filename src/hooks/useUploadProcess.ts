import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useImageStore } from '../store/ImageStore';
import { UploadStepState, useUploadStore } from '../store/UploadStore';
import { deleteFile } from '../utils/fileSystem';
import {
  finishUploadSession,
  prepareDocument,
  startUploadSession,
  uploadPdfDocuments,
  UploadProcessError, UserAbortError,
} from '../utils/scanUtils';
import { captureError } from '../utils/sentry';
import { useGetCurrentCustomer } from './queries/useGetCurrentCustomer';
import { useGetCurrentUser } from './queries/useGetCurrentUser';
import { useApi } from './useApi';

export const useUploadProcess = () => {
  const api = useApi();
  const currentCustomer = useGetCurrentCustomer();
  const { currentUser } = useGetCurrentUser();
  const { company, documentType, images } = useImageStore();
  const [isAbortRequested, setIsAbortRequested] = useState<boolean>(false);
  const { t } = useTranslation();
  const uploadStore = useUploadStore();

  const abortUploadProcess = useCallback(() => setIsAbortRequested(true), [setIsAbortRequested]);

  const shouldAbort = useCallback(() => isAbortRequested, [isAbortRequested]);

  const startUploadProcess = useCallback(() => {
    uploadStore.reset();
    uploadStore.setIsStarted(true);
    uploadStore.setPreparingDocumentState(UploadStepState.BUSY);

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

        uploadStore.setPreparingDocumentState(UploadStepState.SUCCESS);
        uploadStore.setStartingSessionState(UploadStepState.BUSY);

        startUploadSession(api, company, documentType, shouldAbort)
          .then((sessionId) => {
            errorContext.sessionId = sessionId;

            uploadStore.setStartingSessionState(UploadStepState.SUCCESS);
            uploadStore.setDocumentUploadState(UploadStepState.BUSY);

            uploadPdfDocuments(api, sessionId, pdfDocuments, shouldAbort)
              .then(() => {
                uploadStore.setDocumentUploadState(UploadStepState.SUCCESS);
                uploadStore.setFinishSessionState(UploadStepState.BUSY);

                finishUploadSession(api, sessionId)
                  .then(() => {
                    uploadStore.setFinishSessionState(UploadStepState.SUCCESS);
                    uploadStore.setIsStarted(false);
                    uploadStore.setIsFinished(true);
                    uploadStore.setErrorMessage(undefined);
                    uploadStore.setIsAborted(false);
                    setIsAbortRequested(false);

                    pdfDocuments.forEach((pdfDocument) => {
                      deleteFile(pdfDocument)
                        .then()
                        .catch((error) => captureError(
                          error,
                          'An error occurred while deleting a temporary PDF file',
                          'warning',
                          { pdfDocument },
                        ));
                    });
                  })
                  .catch((reason) => {
                    captureError(
                      reason,
                      'An error occurred during the upload process.',
                      'warning',
                      errorContext,
                    );

                    uploadStore.setIsStarted(false);
                    uploadStore.setIsFinished(true);
                    uploadStore.setFinishSessionState(UploadStepState.ERROR);
                    uploadStore.setErrorMessage(t('scan.upload_finalize_warning') as string);
                    setIsAbortRequested(false);

                    pdfDocuments.forEach((pdfDocument) => {
                      deleteFile(pdfDocument)
                        .then()
                        .catch((error) => captureError(
                          error,
                          'An error occurred while deleting a temporary PDF file',
                          'warning',
                          { pdfDocument },
                        ));
                    });
                  });
              })
              .catch((reason) => {
                uploadStore.setIsStarted(false);
                uploadStore.setIsFinished(true);
                uploadStore.setDocumentUploadState(UploadStepState.ERROR);
                setIsAbortRequested(false);

                if (reason instanceof UserAbortError) {
                  uploadStore.setIsAborted(true);
                  uploadStore.setErrorMessage(t('scan.upload_user_aborted') as string);
                } else {
                  captureError(reason, 'Failed to upload a document', 'error', errorContext);
                  uploadStore.setErrorMessage(t('scan.upload_upload_error') as string);
                }

                pdfDocuments.forEach(deleteFile);
              });
          })
          .catch((reason) => {
            uploadStore.setIsStarted(false);
            uploadStore.setIsFinished(true);
            uploadStore.setStartingSessionState(UploadStepState.ERROR);
            setIsAbortRequested(false);

            if (reason instanceof UserAbortError) {
              uploadStore.setIsAborted(true);
              uploadStore.setErrorMessage(t('scan.upload_user_aborted') as string);
            } else {
              captureError(reason, 'Failed to start upload session', 'error', errorContext);
              uploadStore.setErrorMessage(t('scan.upload_start_session_error') as string);
            }

            pdfDocuments.forEach(deleteFile);
          });
      })
      .catch((reason) => {
        uploadStore.setIsStarted(false);
        uploadStore.setIsFinished(true);
        uploadStore.setPreparingDocumentState(UploadStepState.ERROR);
        setIsAbortRequested(false);

        if (reason instanceof UserAbortError) {
          uploadStore.setIsAborted(true);
          uploadStore.setErrorMessage(t('scan.upload_user_aborted') as string);
        } else {
          captureError(reason, 'Failed to prepare PDF document', 'error', errorContext);
          uploadStore.setErrorMessage(t('scan.upload_generate_document_error') as string);
        }
      });
  }, [api, company, currentCustomer.customerId, currentUser?.Email, documentType, images, shouldAbort, t, uploadStore]);

  return {
    abortUploadProcess,
    shouldAbort,
    startUploadProcess,
  };
};
