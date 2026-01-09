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
  orderId: string | null;
  setCheckout: (items: CheckoutItem[], source: CheckoutSource) => void;
  setCheckoutDetails: (details: { addressId?: string; couponCode?: string | null; totalAmount?: number; orderId?: string | null }) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      items: [],
      source: null,
      addressId: null,
      couponCode: null,
      totalAmount: 0,
      orderId: null,
      setCheckout: (items, source) => set({ items, source }),
      setCheckoutDetails: (details) => set((state) => ({ ...state, ...details })),
      clearCheckout: () => set({ items: [], source: null, addressId: null, couponCode: null, totalAmount: 0, orderId: null }),
    }),
    {
      name: 'checkout-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
