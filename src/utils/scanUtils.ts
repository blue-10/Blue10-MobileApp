import * as FileSystem from 'expo-file-system';
import { createPdf } from 'react-native-images-to-pdf';
// @ts-ignore
import unique_slug from 'unique-slug';

import { GetCompanyResponseItem } from '../api/ApiResponses';
import { ApiService } from '../api/ApiService';
import { DocumentType } from '../store/ImageStore';
import { deleteFile } from './fileSystem';

export class UserAbortError extends Error {}

export const prepareDocument = async (images: string[], shouldAbort: () => boolean): Promise<string[]> => {
  if (images.length === 0) {
    throw new Error('No images to convert');
  }

  if (FileSystem.cacheDirectory === null) {
    throw new Error('Could not determine application cache directory using expo-file-system');
  }

  if (shouldAbort()) {
    throw new UserAbortError();
  }

  let pdfFile = await createPdf({
    imagePaths: images,
    outputDirectory: FileSystem.cacheDirectory!,
    outputFilename: `scan-${unique_slug()}.pdf`,
  });

  if (!pdfFile.startsWith('file:')) {
    pdfFile = `file://${pdfFile}`;
  }

  // TODO: figure out an efficient way to split images to create separate files if the generated file size exceeds
  //       the max upload file size (currently: 30 MB)

  if (shouldAbort()) {
    await deleteFile(pdfFile);
    throw new UserAbortError();
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
    throw new Error('Could not determine company Id from given GetCompanyResponseItem');
  }

  if (documentType?.documentType === undefined) {
    throw new Error('Could not determine numeric document type code from given DocumentType');
  }

  if (shouldAbort()) {
    throw new UserAbortError();
  }

  return api.file.startUploadSession(company.Id, documentType.documentType);
};

const uploadPdfDocument = async (api: ApiService, sessionId: string, pdfDocument: string): Promise<void> => {
  return api.file.uploadDocumentForSource(sessionId, pdfDocument)
    .then((_) => { /* ignore empty string response */ });
};

export const uploadPdfDocuments = async (
  api: ApiService,
  sessionId: string,
  pdfDocuments: string[],
  shouldAbort: () => boolean,
): Promise<void> => {
  for (let idx = 0; idx < pdfDocuments.length; idx++) {
    if (shouldAbort()) {
      throw new UserAbortError();
    }

    await uploadPdfDocument(api, sessionId, pdfDocuments[idx]);
  }
};

export const finishUploadSession = async (api: ApiService, sessionId: string): Promise<void> => {
  return api.file.finalizeUploadSession(sessionId)
    .then((_) => { /* ignore empty string response */ });
};
