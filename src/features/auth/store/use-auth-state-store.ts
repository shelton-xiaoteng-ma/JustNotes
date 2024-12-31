import { create } from "zustand";

interface useAuthState {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const useAuthStateStore = create<useAuthState>((set) => ({
  loading: false,
  setLoading(value) {
    set({ loading: value });
  },
}));
