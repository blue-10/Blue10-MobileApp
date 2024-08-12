import { useCallback, useState } from 'react';
import DocumentScanner, { ResponseType, ScanDocumentResponseStatus } from 'react-native-document-scanner-plugin';

import { useImageStore } from '../store/ImageStore';
import { maniplateImageIfNeeded } from '../utils/imageUtils';
import { captureError } from '../utils/sentry';

type useCameraScanParams = {
  onEmptyResults: () => void;
};

export const useCameraScan = ({ onEmptyResults }: useCameraScanParams) => {
  const { addImages, images, selectedImageIndex, selectImage } = useImageStore();
  const [hasPendingImages, setHasPendingImages] = useState<boolean>(false);

  const openCamera = useCallback(async () => {
    try {
      const result = await DocumentScanner.scanDocument({
        croppedImageQuality: 90,
        responseType: ResponseType.ImageFilePath,
      });

      setHasPendingImages(true);
      const rotatedImagePaths: string[] = [];

      // if the status is not Success, the user cancelled
      if (result.status === ScanDocumentResponseStatus.Success) {
        const imagePaths = result.scannedImages || [];

        for (let idx = 0; idx < imagePaths.length; idx++) {
          rotatedImagePaths.push(await maniplateImageIfNeeded(imagePaths[idx]));
        }
      }

      if (images.length === 0 && rotatedImagePaths.length === 0) {
        // note: do not reset hasPendingImages here or the useEffect() hook will re-open the camera while navigating
        onEmptyResults();
      } else {
        addImages(rotatedImagePaths);
        setHasPendingImages(false);

        if (selectedImageIndex === undefined) {
          selectImage(0);
        }
      }
    } catch (reason) {
      captureError(reason, 'An error occurred while scanning documents');
      setHasPendingImages(false);
      throw reason;
    }
  }, [images.length, onEmptyResults, addImages, selectedImageIndex, selectImage]);

  return {
    hasPendingImages,
    openCamera,
    setHasPendingImages,
  };
};
