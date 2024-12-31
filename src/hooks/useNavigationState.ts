import { create } from 'zustand';

interface NavigationState {
  currentPath: string;
  previousPath: string | null;
  setPaths: (current: string, previous: string | null) => void;
}

export const useNavigationState = create<NavigationState>((set) => ({
  currentPath: '/',
  previousPath: null,
  setPaths: (current, previous) => set({ currentPath: current, previousPath: previous }),
}));