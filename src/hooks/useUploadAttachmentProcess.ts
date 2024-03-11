import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useImageStore } from '../store/ImageStore';
import { useUploadStore } from '../store/UploadStore';
import { deleteFilesInBackground } from '../utils/fileSystem';
import { prepareDocument, uploadAttachments, UserAbortError } from '../utils/scanUtils';
import { captureError } from '../utils/sentry';
import { useGetCurrentCustomer } from './queries/useGetCurrentCustomer';
import { useGetCurrentUser } from './queries/useGetCurrentUser';
import { useApi } from './useApi';

export const useUploadAttachmentProcess = () => {
  const api = useApi();
  const uploadStore = useUploadStore();
  const currentCustomer = useGetCurrentCustomer();
  const { currentUser } = useGetCurrentUser();
  const { images } = useImageStore();
  const { t } = useTranslation();

  const shouldAbort = useCallback(() => uploadStore.isAbortRequested, [uploadStore.isAbortRequested]);

  const abortUploadProcess = useCallback(() => uploadStore.setIsAbortRequested(true), [uploadStore]);

  const startUploadProcess = useCallback(
    (invoiceId: string) => {
      uploadStore.reset();
      uploadStore.startPreparingDocuments();
      const errorContext: Record<string, unknown> = {
        customer: currentCustomer.customerId,
        images,
        invoiceId,
        user: currentUser?.Email,
      };

      prepareDocument(images, shouldAbort)
        .then((pdfDocuments) => {
          // noop
          errorContext.pdfDocuments = pdfDocuments;
          uploadStore.startUploadSession();
          uploadStore.startUploadingDocuments();
          uploadAttachments(api, invoiceId, pdfDocuments, shouldAbort)
            .then(() => {
              uploadStore.startFinalizingSession();
              uploadStore.startFinalizingSession();
              uploadStore.setUploadSucceededState();
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
            })
            .finally(() => {
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
    },
    [api, currentCustomer.customerId, currentUser?.Email, images, shouldAbort, t, uploadStore],
  );

  return { abortUploadProcess, shouldAbort, startUploadProcess };
};
