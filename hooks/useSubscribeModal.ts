import { create } from "zustand";

interface SubscribeModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSubscribeModal = create<SubscribeModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSubscribeModal;
