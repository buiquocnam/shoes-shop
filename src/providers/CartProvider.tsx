"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCart } from "@/features/cart/hooks/useCart";

export function CartProvider() {
    const { setCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const { cart } = useCart();

    useEffect(() => {
        if (isAuthenticated && cart) {
            setCart(cart);
        }
    }, [cart, setCart, isAuthenticated]);

    return null;
}
