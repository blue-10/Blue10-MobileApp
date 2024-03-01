import { Buffer } from 'buffer';
import { deleteAsync, readAsStringAsync } from 'expo-file-system';

import { captureError } from './sentry';

export const deleteFile = async (fileUri: string): Promise<void> => {
  return deleteAsync(fileUri, { idempotent: true });
};

export const deleteFilesInBackground = (fileUris: string[]): void => {
  fileUris.forEach((fileUri) => {
    deleteFile(fileUri)
      .then()
      .catch((error) =>
        captureError(error, 'An error occurred while deleting a temporary PDF file', 'warning', { fileUri }),
      );
  });
};

export const readFileAsArrayBuffer = async (fileUri: string): Promise<ArrayBuffer> => {
  const base64Data = await readAsStringAsync(fileUri, { encoding: 'base64' });
  return Buffer.from(base64Data, 'base64').buffer;
};
