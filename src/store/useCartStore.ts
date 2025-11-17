import { CartResponse } from "@/features/cart/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
    cart: CartResponse | null;
    isLoading: boolean;
    error: string | null;
    setCart: (cart: CartResponse) => void;
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
            setCart: (cart: CartResponse) => set({ cart }),
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            setError: (error: string | null) => set({ error }),
            clearCart: () => set({ cart: null, error: null }),
        }), {
            name: 'cart-storage',
        }
    )
);