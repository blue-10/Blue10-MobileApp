import * as FileSystem from 'expo-file-system';
import * as Sentry from 'sentry-expo';
import { create } from 'zustand';

type ImageStore = {
  addImages: (filePaths: string[]) => void;
  deleteImage: () => void;
  images: string[];
  reset: () => void;
  selectImage: (index: number) => void;
  selectedImageIndex: number | undefined;
};

const useImageStore = create<ImageStore>((set) => ({
  addImages: (filePaths: string[]) => {
    set((currentState) => ({
      images: [...currentState.images, ...filePaths],
    }));
  },
  deleteImage: () => {
    set((currentState) => {
      if (currentState.selectedImageIndex === undefined ||
        currentState.selectedImageIndex >= currentState.images.length) {
        return {};
      }

      const imageToDelete = currentState.images[currentState.selectedImageIndex];
      FileSystem.deleteAsync(imageToDelete, { idempotent: true })
        .then(() => { /* all is well with the world */ })
        .catch(() => {
          Sentry.Native.captureMessage('Unable to delete a file from the local file system', 'warning');
        });

      const newImages = currentState.images.filter((_, index) => index !== currentState.selectedImageIndex);

      // select the *next* image, unless there are no more images or the deleted image was the last image
      let newSelectedIndex: number | undefined = currentState.selectedImageIndex;
      if (newImages.length === 0) {
        newSelectedIndex = undefined;
      } else if (newSelectedIndex >= newImages.length) {
        newSelectedIndex = newImages.length - 1;
      }

      return {
        images: newImages,
        selectedImageIndex: newSelectedIndex,
      };
    });
  },
  images: [],
  reset: () => {
    set((currentState) => {
      currentState.images.forEach((imagePath) => {
        FileSystem.deleteAsync(imagePath, { idempotent: true })
          .then(() => { /* all is well with the world */ })
          .catch(() => {
            Sentry.Native.captureMessage('Unable to delete a file from the local file system', 'warning');
          });
      });

      return {
        images: [],
        selectedImageIndex: undefined,
      };
    });
  },
  selectImage: (index: number) => {
    set((currentState) => ({
      selectedImageIndex: index >= currentState.images.length
        ? undefined
        : index,
    }));
  },
  selectedImageIndex: undefined,
}));

export { useImageStore };
