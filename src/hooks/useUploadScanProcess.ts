import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettingsStore } from '@/store/SettingsStore';

import { useImageStore } from '../store/ImageStore';
import { useUploadStore } from '../store/UploadStore';
import { deleteFilesInBackground, saveFilesToGallery } from '../utils/fileSystem';
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
import RNFS from 'react-native-fs';

export const useUploadScanProcess = () => {
  const api = useApi();
  const isSaveToCameraRoll = useSettingsStore((state) => state.settings.saveToCameraRoll);
  const currentCustomer = useGetCurrentCustomer();
  const { currentUser } = useGetCurrentUser();
  const { company, documentType, images } = useImageStore();
  const { t } = useTranslation();
  const uploadStore = useUploadStore();

  // saving images in mobile directory
  const BASE_FOLDER = `${RNFS.DocumentDirectoryPath}/blue10Images`;

  const ensureFolderExists = async (folderPath: any) => {
    const exists = await RNFS.exists(folderPath);
    if (!exists) {
      await RNFS.mkdir(folderPath);
    }

    const allDirs = await RNFS.readDir(`${BASE_FOLDER}`);
    const foldersOnly = allDirs.filter((entry) => entry.isDirectory());

    if (foldersOnly.length > 15) {
      const sorted = foldersOnly.sort((a, b) => {
        const timeA = a.mtime?.getTime() ?? 0;
        const timeB = b.mtime?.getTime() ?? 0;
        return timeA - timeB;
      });

      const foldersToDelete = sorted.slice(0, foldersOnly.length - 15);

      for (const folder of foldersToDelete) {
        try {
          const files = await RNFS.readDir(folder.path);

          for (const file of files) {
            if (file.isFile()) {
              await RNFS.unlink(file.path);
            }
          }

          await RNFS.unlink(folder.path);
        } catch (err) {
          console.warn(`⚠️ Error deleting folder ${folder.name}:`, err);
        }
      }
    }
  };

  const saveImagesBatch = async (imageUris: string[], companyName: string): Promise<string[]> => {
    const safeCompanyName = companyName.trim().replace(/\s+/g, '_');

    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
    const folderId = `${timestamp}_${companyName}`;
    const folderPath = `${BASE_FOLDER}/${folderId}`;

    await ensureFolderExists(folderPath);

    const savedPaths: string[] = [];

    const existingFiles = await RNFS.readDir(folderPath);
    const fileCount = existingFiles.length;

    for (let i = 0; i < imageUris.length; i++) {
      const tempUri = imageUris[i];
      const fileName = `${safeCompanyName}_${fileCount + i + 1}.jpg`;
      const destPath = `${folderPath}/${fileName}`;

      await RNFS.copyFile(tempUri, destPath);
      savedPaths.push('file://' + destPath);
    }

    const folderMetaData = {
      companyName: safeCompanyName,
      timestamp: new Date().toLocaleString(),
      documentType: documentType?.key,
    };
    const metaFilePath = `${folderPath}/metadata.json`;
    await RNFS.writeFile(metaFilePath, JSON.stringify(folderMetaData), 'utf8');

    return savedPaths;
  };
  // --------

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
                  .then(async () => {
                    if (isSaveToCameraRoll) {
                      await saveFilesToGallery(images);
                    }
                    uploadStore.setUploadSucceededState();
                    // save session in mobile directory
                    saveImagesBatch(images, company?.DisplayName ?? 'Unknown Company');
                  })
                  .catch((reason) => {
                    captureError(reason, 'An error occurred during the upload process.', 'warning', errorContext);

                    uploadStore.failFinalizingSession(t('scan.upload_finalize_warning'));
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
              })
              .finally(() => {
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
  }, [
    api,
    company,
    currentCustomer.customerId,
    currentUser?.Email,
    documentType,
    images,
    isSaveToCameraRoll,
    shouldAbort,
    t,
    uploadStore,
  ]);

  return {
    abortUploadProcess,
    shouldAbort,
    startUploadProcess,
  };
};
