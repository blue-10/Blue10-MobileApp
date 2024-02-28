import { create } from 'zustand';

import type { GetCompanyResponseItem } from '../api/ApiResponses';
import { deleteFile } from '../utils/fileSystem';
import { captureError } from '../utils/sentry';

export class DocumentType {
  static readonly PURCHASE_INVOICE = new DocumentType('purchase_invoice', 1);
  static readonly SALES_INVOICE = new DocumentType('sales_invoice', 2);
  static readonly PACKING_SLIP = new DocumentType('packing_slip', 3);

  // eslint-disable-next-line no-useless-constructor
  private constructor(
    public readonly key: string,
    public readonly documentType: number,
  ) {}

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
  filePaths.forEach(async (filePath) => {
    try {
      await deleteFile(filePath);
    } catch (reason) {
      captureError(reason, 'Failed to delete a file', 'warning', { filePath });
    }
  });
};

export const useImageStore = create<ImageStore>((set) => ({
  addImages: (filePaths: string[]) => {
    set((currentState) => ({
      images: [...currentState.images, ...filePaths],
    }));
  },
  company: undefined,
  deleteImage: () => {
    set((currentState) => {
      if (
        currentState.selectedImageIndex === undefined ||
        currentState.selectedImageIndex >= currentState.images.length
      ) {
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
        company: undefined,
        documentType: undefined,
        images: [],
        selectedImageIndex: undefined,
      };
    });
  },
  selectImage: (index: number) => {
    set((currentState) => ({
      selectedImageIndex: index >= currentState.images.length ? undefined : index,
    }));
  },
  selectedImageIndex: undefined,
  setCompany: (company) => {
    set((currentState) => {
      if (company.Id !== currentState.company?.Id) {
        // not all companies support all document types, reset the current document type on company change so the user
        // is forced to re-select a document type
        return { company, documentType: undefined };
      }

      return { company };
    });
  },
  setDocumentType: (documentType) => {
    set({ documentType });
  },
}));
