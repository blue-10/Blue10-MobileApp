import { Buffer } from 'buffer';
import { readAsStringAsync } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { FileSystem } from 'react-native-file-access';

import { captureError } from './sentry';

export const deleteFile = async (fileUri: string): Promise<void> => {
  const canExists = await FileSystem.exists(fileUri);
  if (canExists) {
    return FileSystem.unlink(fileUri);
  }
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

export const saveFilesToGallery = async (fileUris: string[]): Promise<boolean> => {
  if (!(await MediaLibrary.isAvailableAsync())) {
    return false;
  }

  for (const fileUri of fileUris) {
    try {
      await MediaLibrary.saveToLibraryAsync(fileUri);
    } catch (error) {
      captureError(error, 'An error occurred while save image to Gallery/filmroll', 'warning', { fileUri });
    }
  }

  return true;
};
