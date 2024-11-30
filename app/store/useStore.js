"use client";
import {create} from 'zustand';

// Create a Zustand store
const useStore = create((set) => ({
  selectedMode: 'light',
  cartCount: 0, // Initial value
  setSelectedMode: (mode) => set({ selectedMode: mode }),
  setCartCount: (count) => set({cartCount:count})
}));

export default useStore;
