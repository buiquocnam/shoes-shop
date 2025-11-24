import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartResponse } from "@/features/cart/types";

interface CartState {
  cart: CartResponse | null;
  isLoading: boolean;
  error: string | null;
  setCart: (cart: CartResponse | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      isLoading: false,
      error: null,

      setCart: (cart) => set({ cart }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      clearCart: () => set({ cart: null, isLoading: false, error: null }),
    }),
    {
      name: "cart-storage",
    }
  )
);
