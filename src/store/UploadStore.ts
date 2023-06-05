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
  failFinalizingSession: (userMessage: string) => void;
  failPreparingDocuments: (userMessage: string, isUserAbort: boolean) => void;
  failStartingUploadSession: (userMessage: string, isUserAbort: boolean) => void;
  failUploadingDocuments: (userMessage: string, isUserAbort: boolean) => void;
  finishSessionState: UploadStepState;
  isAborted: boolean;
  isAbortRequested: boolean;
  isFinished: boolean;
  isStarted: boolean;
  preparingDocumentState: UploadStepState;
  reset: () => void;
  setIsAbortRequested: (isAbortRequested: boolean) => void;
  setUploadSucceededState: () => void;
  startFinalizingSession: () => void;
  startPreparingDocuments: () => void;
  startUploadSession: () => void;
  startUploadingDocuments: () => void;
  startingSessionState: UploadStepState;
};

export const useUploadStore = create<UploadStore>((set) => ({
  documentUploadState: UploadStepState.READY,
  errorMessage: undefined,
  failFinalizingSession: (userMessage: string) => {
    set({
      errorMessage: userMessage,
      finishSessionState: UploadStepState.ERROR,
      isAbortRequested: false,
      isAborted: false,
      isFinished: true,
      isStarted: false,
    });
  },
  failPreparingDocuments: (userMessage: string, isUserAbort: boolean) => {
    set({
      errorMessage: userMessage,
      isAbortRequested: false,
      isAborted: isUserAbort,
      isFinished: true,
      isStarted: false,
      preparingDocumentState: UploadStepState.ERROR,
    });
  },
  failStartingUploadSession: (userMessage: string, isUserAbort: boolean) => {
    set({
      errorMessage: userMessage,
      isAbortRequested: false,
      isAborted: isUserAbort,
      isFinished: true,
      isStarted: false,
      startingSessionState: UploadStepState.ERROR,
    });
  },
  failUploadingDocuments: (userMessage: string, isUserAbort: boolean) => {
    set({
      documentUploadState: UploadStepState.ERROR,
      errorMessage: userMessage,
      isAbortRequested: false,
      isAborted: isUserAbort,
      isFinished: true,
      isStarted: false,
    });
  },
  finishSessionState: UploadStepState.READY,
  isAbortRequested: false,
  isAborted: false,
  isFinished: false,
  isStarted: false,
  preparingDocumentState: UploadStepState.READY,
  reset: () => {
    set({
      documentUploadState: UploadStepState.READY,
      errorMessage: undefined,
      finishSessionState: UploadStepState.READY,
      isAbortRequested: false,
      isAborted: false,
      isFinished: false,
      isStarted: false,
      preparingDocumentState: UploadStepState.READY,
      startingSessionState: UploadStepState.READY,
    });
  },
  setIsAbortRequested: (isAbortRequested) => {
    set({ isAbortRequested });
  },
  setUploadSucceededState: () => {
    set({
      errorMessage: undefined,
      finishSessionState: UploadStepState.SUCCESS,
      isAbortRequested: false,
      isAborted: false,
      isFinished: true,
      isStarted: false,
    });
  },
  startFinalizingSession: () => {
    set({
      documentUploadState: UploadStepState.SUCCESS,
      finishSessionState: UploadStepState.BUSY,
    });
  },
  startPreparingDocuments: () => {
    // resets state entirely
    set({
      isAbortRequested: false,
      isStarted: true,
      preparingDocumentState: UploadStepState.BUSY,
    });
  },
  startUploadSession: () => {
    set({
      preparingDocumentState: UploadStepState.SUCCESS,
      startingSessionState: UploadStepState.BUSY,
    });
  },
  startUploadingDocuments: () => {
    set({
      documentUploadState: UploadStepState.BUSY,
      startingSessionState: UploadStepState.SUCCESS,
    });
  },
  startingSessionState: UploadStepState.READY,
}));
