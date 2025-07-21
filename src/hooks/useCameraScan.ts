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
        croppedImageQuality: 100,
        responseType: ResponseType.ImageFilePath,
      });

      setHasPendingImages(true);
      const rotatedImagePaths: string[] = [];

      // بررسی وضعیت نتیجه و معتبر بودن تصاویر برگشتی
      if (
        result.status === ScanDocumentResponseStatus.Success &&
        Array.isArray(result.scannedImages) &&
        result.scannedImages.length > 0
      ) {
        for (let idx = 0; idx < result.scannedImages.length; idx++) {
          const imagePath = result.scannedImages[idx];

          if (imagePath) {
            try {
              const rotated = await maniplateImageIfNeeded(imagePath);
              rotatedImagePaths.push(rotated);
            } catch (imgError) {
              console.warn(`خطا در پردازش تصویر ${imagePath}:`, imgError);
              // می‌تونی تصمیم بگیری که ادامه بدی یا نه
            }
          } else {
            console.warn(`مسیر تصویر نامعتبر بود در اندیس ${idx}`);
          }
        }
      } else {
        console.warn('کاربر دوربین را کنسل کرد یا تصویری دریافت نشد.');
      }

      // بررسی نهایی اینکه تصویری برای اضافه شدن وجود داره یا نه
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
      console.error('خطا در اسکن سند:', reason);
      captureError(reason, 'An error occurred while scanning documents');
      setHasPendingImages(false);
      // throw رو حذف کردیم چون نمی‌خوایم باعث کرش React بشه
    }
  }, [images.length, onEmptyResults, addImages, selectedImageIndex, selectImage]);

  return {
    hasPendingImages,
    openCamera,
    setHasPendingImages,
  };
};
