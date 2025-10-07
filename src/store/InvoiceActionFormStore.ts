import { create } from 'zustand';

type InvoiceActionFormStore = {
  comment: string;
  selectedUserId: string;
  selectedActionId: number | undefined;
  reset: () => void;
  setComment: (value: string) => void;
  setSelectedUserId: (value: string) => void;
  setSelectedActionId: (value: number | undefined) => void;
  setHasUserSelected: (value: boolean) => void;
  hasUserSelected: boolean;
};

const useInvoiceActionFormStore = create<InvoiceActionFormStore>((set) => ({
  comment: '',
  selectedActionId: undefined,
  selectedUserId: '',
  hasUserSelected: false,
  reset: () => {
    set({
      comment: '',
      selectedActionId: undefined,
      selectedUserId: '',
      hasUserSelected: false,
    });
  },
  setComment: (value) => set({ comment: value }),
  setSelectedActionId: (value) => set({ selectedActionId: value }),
  setSelectedUserId: (value) => set({ selectedUserId: value }),
  setHasUserSelected: (value) => set({ hasUserSelected: value }),
}));

export { useInvoiceActionFormStore };
