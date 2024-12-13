import { create } from 'zustand';

interface SidebarStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  open: true,
  setOpen: (open) => set({ open }),
}));
