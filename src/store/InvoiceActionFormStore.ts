import { create } from 'zustand';

type InvoiceActionFormStore = {
  comment: string;
  selectedUserId: string;
  selectedActionId: number | undefined;
  reset: () => void;
  setComment: (value: string) => void;
  setSelectedUserId: (value: string) => void;
  setSelectedActionId: (value: number| undefined) => void;
}

const useInvoiceActionFormStore = create<InvoiceActionFormStore>((set) => ({
  comment: '',
  reset: () => {
    set({
      comment: '',
      selectedActionId: undefined,
      selectedUserId: '',
    });
  },
  selectedActionId: undefined,
  selectedUserId: '',
  setComment: (value) => set({ comment: value }),
  setSelectedActionId: (value) => set({ selectedActionId: value }),
  setSelectedUserId: (value) => set({ selectedUserId: value }),
}));

export { useInvoiceActionFormStore };
