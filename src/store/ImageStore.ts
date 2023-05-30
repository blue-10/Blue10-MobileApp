import * as FileSystem from 'expo-file-system';
import * as Sentry from 'sentry-expo';
import { create } from 'zustand';

import { GetCompanyResponseItem } from '../api/ApiResponses';

export class DocumentType {
  static readonly PURCHASE_INVOICE = new DocumentType('purchase_invoice', 1);
  static readonly SALES_INVOICE = new DocumentType('sales_invoice', 2);
  static readonly PACKING_SLIP = new DocumentType('packing_slip', 3);

  // eslint-disable-next-line no-useless-constructor
  private constructor(public readonly key: string, public readonly documentType: number) {
  }

  toString() {
    return this.key;
  }
}

type ImageStore = {
  addImages: (filePaths: string[]) => void;
  company: GetCompanyResponseItem | undefined;
  deleteImage: () => void;
  documentType: DocumentType | undefined;
  images: string[];
  reset: () => void;
  selectImage: (index: number) => void;
  selectedImageIndex: number | undefined;
  setCompany: (company: GetCompanyResponseItem) => void;
  setDocumentType: (documentType: DocumentType) => void;
};

const deleteFiles = (filePaths: string[]): void => {
  filePaths.forEach((filePath) => {
    FileSystem.deleteAsync(filePath, { idempotent: true })
      .then(() => { /* all is well with the world */ })
      .catch(() => {
        Sentry.Native.captureMessage('Unable to delete a file from the local file system', 'warning');
      });
  });
};

const useImageStore = create<ImageStore>((set) => ({
  addImages: (filePaths: string[]) => {
    set((currentState) => ({
      images: [...currentState.images, ...filePaths],
    }));
  },
  company: undefined,
  deleteImage: () => {
    set((currentState) => {
      if (currentState.selectedImageIndex === undefined ||
        currentState.selectedImageIndex >= currentState.images.length) {
        return {};
      }

      const imageToDelete = currentState.images[currentState.selectedImageIndex];
      deleteFiles([imageToDelete]);

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
  documentType: undefined,
  images: [],
  reset: () => {
    set((currentState) => {
      deleteFiles(currentState.images);

      return {
        companyId: undefined,
        documentType: undefined,
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
  setCompany: (company) => {
    set((currentState) => {
      const changes: Partial<ImageStore> = { company };

      if (company.Id !== currentState.company?.Id) {
        deleteFiles(currentState.images);

        changes.documentType = undefined;
        changes.images = [];
        changes.selectedImageIndex = undefined;
      }

      return changes;
    });
  },
  setDocumentType: (documentType) => {
    set((currentState) => {
      const changes: Partial<ImageStore> = { documentType };

      if (documentType !== currentState.documentType) {
        deleteFiles(currentState.images);

        changes.images = [];
        changes.selectedImageIndex = undefined;
      }

      return changes;
    });
  },
}));

export { useImageStore };
