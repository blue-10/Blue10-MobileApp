import { create } from 'zustand';

export enum UploadStepState {
  READY = 0,
  BUSY = 1,
  SUCCESS = 2,
  ERROR = 3,
}

type UploadStore = {
  documentUploadState: UploadStepState;
  errorMessage: string | undefined;
  finishSessionState: UploadStepState;
  isAborted: boolean;
  isFinished: boolean;
  isStarted: boolean;
  preparingDocumentState: UploadStepState;
  reset: () => void;
  setDocumentUploadState: (documentUploadState: UploadStepState) => void;
  setErrorMessage: (errorMessage: string | undefined) => void;
  setFinishSessionState: (finishSessionState: UploadStepState) => void;
  setIsAborted: (isAborted: boolean) => void;
  setIsFinished: (isFinished: boolean) => void;
  setIsStarted: (isStarted: boolean) => void;
  setPreparingDocumentState: (preparingDocumentState: UploadStepState) => void;
  setStartingSessionState: (startingSessionState: UploadStepState) => void;
  startingSessionState: UploadStepState;
};

export const useUploadStore = create<UploadStore>((set) => ({
  documentUploadState: UploadStepState.READY,
  errorMessage: undefined,
  finishSessionState: UploadStepState.READY,
  isAborted: false,
  isFinished: false,
  isStarted: false,
  preparingDocumentState: UploadStepState.READY,
  reset: () => {
    set({
      documentUploadState: UploadStepState.READY,
      errorMessage: undefined,
      finishSessionState: UploadStepState.READY,
      isAborted: false,
      isFinished: false,
      isStarted: false,
      preparingDocumentState: UploadStepState.READY,
      startingSessionState: UploadStepState.READY,
    });
  },
  setDocumentUploadState: (documentUploadState) => {
    set({ documentUploadState });
  },
  setErrorMessage: (errorMessage) => {
    set({ errorMessage });
  },
  setFinishSessionState: (finishSessionState) => {
    set({ finishSessionState });
  },
  setIsAborted: (isAborted) => {
    set({ isAborted });
  },
  setIsFinished: (isFinished) => {
    set({ isFinished });
  },
  setIsStarted: (isStarted) => {
    set({ isStarted });
  },
  setPreparingDocumentState: (preparingDocumentState) => {
    set({ preparingDocumentState });
  },
  setStartingSessionState: (startingSessionState) => {
    set({ startingSessionState });
  },
  startingSessionState: UploadStepState.READY,
}));
