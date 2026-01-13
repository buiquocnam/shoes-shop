import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartState {
  selectedItemIds: string[];
  _hasHydrated: boolean;
  toggleSelectItem: (id: string) => void;
  setSelectedItems: (ids: string[]) => void;
  clearSelection: () => void;
  isItemSelected: (id: string) => boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      selectedItemIds: [],
      _hasHydrated: false,
      
      toggleSelectItem: (id) => set((state) => ({
        selectedItemIds: state.selectedItemIds.includes(id)
          ? state.selectedItemIds.filter((itemId) => itemId !== id)
          : [...state.selectedItemIds, id],
      })),

      setSelectedItems: (ids) => set({ selectedItemIds: ids }),

      clearSelection: () => set({ selectedItemIds: [] }),

      isItemSelected: (id) => get().selectedItemIds.includes(id),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'cart-selection-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
