import { useCallback, useId, useState } from 'react';
import { create } from 'zustand';

import type { ToastItem } from './types';

type ToastStore = {
  toasts: ToastItem[];
  deleteToast: (index: number) => void;
  addToast: (item: ToastItem) => void;
};

const useToastStore = create<ToastStore>((set, get) => ({
  addToast: (toast: ToastItem) => {
    set({
      toasts: [...get().toasts, toast],
    });
  },
  deleteToast: (index: number) => {
    const newToasts = [...get().toasts];
    newToasts.splice(index, 1);
    set({ toasts: newToasts });
  },
  toasts: [],
}));

const useAddToast = () => {
  const addToast = useToastStore((state) => state.addToast);
  const id = useId();
  const [counter, setCounter] = useState(0);

  return useCallback(
    (message: string, timeout?: number) => {
      addToast({
        id: `${id}_${counter}`,
        message,
        timeout,
      });
      setCounter((value) => value + 1);
    },
    [addToast, id, counter],
  );
};

export { useAddToast, useToastStore };
