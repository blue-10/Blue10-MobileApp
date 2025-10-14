import { useCallback, useState } from 'react';
import DocumentScanner from 'react-native-document-scanner-plugin';
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
        croppedImageQuality: 100,
      });

      setHasPendingImages(true);
      const rotatedImagePaths: string[] = [];

      if (Array.isArray(result.scannedImages) && result.scannedImages.length > 0) {
        for (let idx = 0; idx < result.scannedImages.length; idx++) {
          const imagePath = result.scannedImages[idx];

          if (imagePath) {
            try {
              const rotated = await maniplateImageIfNeeded(imagePath);
              rotatedImagePaths.push(rotated);
            } catch (imgError) {
              console.warn(`Error processing image ${imagePath}:`, imgError);
            }
          } else {
            console.warn(`filePath is invalid at index ${idx}`);
          }
        }
      } else {
        console.warn('User canceled the camera or no image was received.');
      }

      if (images.length === 0 && rotatedImagePaths.length === 0) {
        onEmptyResults();
      } else {
        addImages(rotatedImagePaths);
        setHasPendingImages(false);

        if (selectedImageIndex === undefined) {
          selectImage(0);
        }
      }
    } catch (reason) {
      console.error('Error scanning document:', reason);
      captureError(reason, 'An error occurred while scanning documents');
      setHasPendingImages(false);
    }
  }, [images.length, onEmptyResults, addImages, selectedImageIndex, selectImage]);

  return {
    hasPendingImages,
    openCamera,
    setHasPendingImages,
  };
};
