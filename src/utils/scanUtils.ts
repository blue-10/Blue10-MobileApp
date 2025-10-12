import * as FileSystem from 'expo-file-system/legacy';
import { createPdf } from 'react-native-pdf-from-image';
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
  if (!images.length) throw new UploadProcessError('No images to convert');

  if (!FileSystem.cacheDirectory) throw new UploadProcessError('Could not determine cache directory');

  const normalizedImages = images.map((img) => img.replace('file://', ''));

  if (shouldAbort()) throw new UserAbortError();

  let pdfFile: string;

  try {
    const result = await createPdf({
      name: `scan-${unique_slug()}.pdf`,
      imagePaths: normalizedImages,
    });

    pdfFile = (result as any).filePath ?? (result as string);

    if (!pdfFile) throw new UploadProcessError('PDF path is undefined');
  } catch (error) {
    if (shouldAbort()) {
      captureError(error, 'PDF creation aborted by user', 'error', { images });
      throw new UserAbortError();
    }
    throw new UploadProcessError('Error occurred during createPdf', { cause: error });
  }

  // Always ensure file:// prefix
  if (!pdfFile.startsWith('file://')) pdfFile = `file://${pdfFile}`;

  if (shouldAbort()) {
    deleteFile(pdfFile).catch((reason) =>
      captureError(reason, 'Error deleting temp PDF after abort', 'warning', { pdfFile }),
    );
    throw new UserAbortError('Abort requested by user');
  }

  return [pdfFile];
};

// ---------- Upload Session Logic ----------

export const startUploadSession = async (
  api: ApiService,
  company: GetCompanyResponseItem | undefined,
  documentType: DocumentType | undefined,
  shouldAbort: () => boolean,
): Promise<string> => {
  if (!company?.Id) throw new UploadProcessError('Could not determine company Id');
  if (!documentType?.documentType) throw new UploadProcessError('Could not determine document type');

  if (shouldAbort()) throw new UserAbortError();

  try {
    return await api.file.startUploadSession(company.Id, documentType.documentType);
  } catch (error) {
    if (shouldAbort()) throw new UserAbortError();
    throw new UploadProcessError('Error in startUploadSession', { cause: error });
  }
};

export const uploadPdfDocuments = async (
  api: ApiService,
  sessionId: string,
  pdfFiles: string[],
  shouldAbort: () => boolean,
): Promise<void> => {
  for (const pdf of pdfFiles) {
    if (shouldAbort()) throw new UserAbortError();
    try {
      await api.file.uploadDocumentForSource(sessionId, pdf);
    } catch (error) {
      if (shouldAbort()) throw new UserAbortError();
      throw new UploadProcessError('Error uploading file', { cause: error });
    }
  }
};

export const finishUploadSession = async (api: ApiService, sessionId: string): Promise<void> => {
  try {
    await api.file.finalizeUploadSession(sessionId);
  } catch (error) {
    throw new UploadProcessError('Error in finalizeUploadSession', { cause: error });
  }
};

export const uploadAttachments = async (
  api: ApiService,
  invoiceId: string,
  pdfFiles: string[],
  shouldAbort: () => boolean,
): Promise<void> => {
  for (const pdf of pdfFiles) {
    if (shouldAbort()) throw new UserAbortError();
    try {
      await api.file.importAttachment(invoiceId, pdf);
    } catch (error) {
      if (shouldAbort()) throw new UserAbortError();
      throw new UploadProcessError('Error uploading attachment', { cause: error });
    }
  }
};
