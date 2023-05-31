import { Buffer } from 'buffer';
import { deleteAsync, readAsStringAsync } from 'expo-file-system';

export const deleteFile = async (fileUri: string): Promise<void> => {
  return deleteAsync(fileUri, { idempotent: true });
};

export const readFileAsArrayBuffer = async (fileUri: string): Promise<ArrayBuffer> => {
  const base64Data = await readAsStringAsync(fileUri, { encoding: 'base64' });
  return Buffer.from(base64Data, 'base64').buffer;
};
