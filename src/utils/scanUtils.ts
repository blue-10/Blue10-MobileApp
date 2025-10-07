import * as FileSystem from 'expo-file-system/legacy';
import { createPdf } from 'react-native-images-to-pdf';
// @ts-ignore
import unique_slug from 'unique-slug';

import type { GetCompanyResponseItem } from '../api/ApiResponses';
import type { ApiService } from '../api/ApiService';
import type { DocumentType } from '../store/ImageStore';
import { deleteFile } from './fileSystem';
import { captureError } from './sentry';

export class UserAbortError extends Error {}
export class UploadProcessError extends Error {}

export const prepareDocument = async (images: string[], shouldAbort: () => boolean): Promise<string[]> => {
  if (images.length === 0) {
    throw new UploadProcessError('No images to convert');
  }

  if (FileSystem.cacheDirectory === null) {
    throw new UploadProcessError('Could not determine application cache directory using expo-file-system');
  }

  if (shouldAbort()) {
    throw new UserAbortError();
  }

  let pdfFile: string;
  try {
    pdfFile = await createPdf({
      outputPath: `${FileSystem.cacheDirectory!}/scan-${unique_slug()}.pdf`,
      pages: images.map((imagePath) => ({ imagePath })),
    });
  } catch (error) {
    if (shouldAbort()) {
      captureError(
        error,
        'Error occurred during createPdf. Not throwing in-app because user has requested abort.',
        'error',
        { images },
      );

      throw new UserAbortError();
    }

    throw new UploadProcessError('Error occurred during createPdf', {
      cause: error,
    });
  }

  if (!pdfFile.startsWith('file:')) {
    pdfFile = `file://${pdfFile}`;
  }

  // TODO: figure out an efficient way to split images to create separate files if the generated file size exceeds
  //       the max upload file size (currently: 30 MB)

  if (shouldAbort()) {
    deleteFile(pdfFile)
      .then()
      .catch((reason) =>
        captureError(reason, 'Error occurred while deleting temporary PDF file', 'warning', { pdfFile }),
      );

    throw new UserAbortError('Abort requested by user');
  }

  return [pdfFile];
};

export const startUploadSession = async (
  api: ApiService,
  company: GetCompanyResponseItem | undefined,
  documentType: DocumentType | undefined,
  shouldAbort: () => boolean,
): Promise<string> => {
  if (company?.Id === undefined) {
    throw new UploadProcessError('Could not determine company Id from given GetCompanyResponseItem');
  }

  if (documentType?.documentType === undefined) {
    throw new UploadProcessError('Could not determine numeric document type code from given DocumentType');
  }

  if (shouldAbort()) {
    throw new UserAbortError();
  }

  let sessionId: string;
  try {
    sessionId = await api.file.startUploadSession(company.Id, documentType.documentType);
  } catch (error) {
    if (shouldAbort()) {
      captureError(
        error,
        'Error occurred in API call to start upload session. Not throwing in-app because user has requested abort.',
        'error',
        { companyId: company.Id, documentType: documentType.documentType },
      );

      throw new UserAbortError();
    }

    throw new UploadProcessError('Error occurred in API call to start upload session', { cause: error });
  }

  return sessionId;
};

export const uploadPdfDocuments = async (
  api: ApiService,
  sessionId: string,
  pdfFiles: string[],
  shouldAbort: () => boolean,
): Promise<void> => {
  for (let idx = 0; idx < pdfFiles.length; idx++) {
    if (shouldAbort()) {
      throw new UserAbortError();
    }

    try {
      await api.file.uploadDocumentForSource(sessionId, pdfFiles[idx]);
    } catch (error) {
      if (shouldAbort()) {
        captureError(
          error,
          'Error occurred in API call to upload a file. Not throwing in-app because user has requested abort.',
          'error',
          { pdfFile: pdfFiles[idx], sessionId },
        );

        throw new UserAbortError();
      }

      throw new UploadProcessError('Error occurred in API call to upload a file', { cause: error });
    }
  }
};

export const finishUploadSession = async (api: ApiService, sessionId: string): Promise<void> => {
  try {
    await api.file.finalizeUploadSession(sessionId);
  } catch (error) {
    throw new UploadProcessError('Error occurred in API call to finalize upload session', { cause: error });
  }
};

export const uploadAttachments = async (
  api: ApiService,
  invoiceId: string,
  pdfFiles: string[],
  shouldAbort: () => boolean,
): Promise<void> => {
  for (let idx = 0; idx < pdfFiles.length; idx++) {
    if (shouldAbort()) {
      throw new UserAbortError();
    }

    try {
      await api.file.importAttachment(invoiceId, pdfFiles[idx]);
    } catch (error) {
      if (shouldAbort()) {
        captureError(
          error,
          'Error occurred in API call to upload a file. Not throwing in-app because user has requested abort.',
          'error',
          { invoiceId, pdfFile: pdfFiles[idx] },
        );

        throw new UserAbortError();
      }

      throw new UploadProcessError('Error occurred in API call to upload a file', { cause: error });
    }
  }
};
