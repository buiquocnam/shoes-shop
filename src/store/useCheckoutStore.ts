import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CheckoutItem } from '@/features/checkout/types/checkout';

export type CheckoutSource = 'cart' | 'product';

interface CheckoutState {
  items: CheckoutItem[];
  source: CheckoutSource | null;
  addressId: string | null;
  couponCode: string | null;
  totalAmount: number;
  _hasHydrated: boolean;
  setCheckout: (items: CheckoutItem[], source: CheckoutSource) => void;
  setCheckoutDetails: (details: { addressId?: string; couponCode?: string | null; totalAmount?: number }) => void;
  clearCheckout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      items: [],
      source: null,
      addressId: null,
      couponCode: null,
      totalAmount: 0,
      _hasHydrated: false,
      setCheckout: (items, source) => set({ items, source }),
      setCheckoutDetails: (details) => set((state) => ({ ...state, ...details })),
      clearCheckout: () => set({ items: [], source: null, addressId: null, couponCode: null, totalAmount: 0 }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'checkout-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
