import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartState {
  selectedItemIds: string[];
  toggleSelectItem: (id: string) => void;
  setSelectedItems: (ids: string[]) => void;
  clearSelection: () => void;
  isItemSelected: (id: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      selectedItemIds: [],
      
      toggleSelectItem: (id) => set((state) => ({
        selectedItemIds: state.selectedItemIds.includes(id)
          ? state.selectedItemIds.filter((itemId) => itemId !== id)
          : [...state.selectedItemIds, id],
      })),

      setSelectedItems: (ids) => set({ selectedItemIds: ids }),

      clearSelection: () => set({ selectedItemIds: [] }),

      isItemSelected: (id) => get().selectedItemIds.includes(id),
    }),
    {
      name: 'cart-selection-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
