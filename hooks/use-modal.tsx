import { create } from "zustand";

interface useCurrencyModalInterface {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCurrencyModal = create<useCurrencyModalInterface>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
