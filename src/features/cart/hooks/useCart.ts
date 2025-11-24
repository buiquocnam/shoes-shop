"use client";

import { useCartStore } from "@/store/useCartStore";
import {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItem,
} from "@/features/cart/services";
import { CartResponse } from "@/features/cart/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys, useMutationWithToast } from "@/features/shared";

/**
 * Hook to fetch and manage cart data
 */
export const useCart = () => {
  const { cart: storeCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const {
    data: cart,
    isLoading,
    error,
    refetch,
  } = useQuery<CartResponse>({
    queryKey: queryKeys.cart.current(),
    queryFn: async () => await getCart(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  return {
    cart: storeCart || cart,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

/**
 * Hook to create/add an item to the cart
 */
export const useCreateCart = () => {
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutationWithToast<
    CartResponse,
    { variantId: string; quantity: number }
  >({
    mutationFn: async ({ variantId, quantity }) => {
      return await addToCart(variantId, quantity);
    },
    onSuccess: (data) => {
      setCart(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
    successMessage: "Added to cart successfully",
    errorMessage: "Error adding to cart",
  });
};

export const useRemoveCartItem = () => {
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutationWithToast<CartResponse, string>({
    mutationFn: async (itemId: string) => {
      return await removeCartItem(itemId);
    },
    onSuccess: (data) => {
      setCart(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
    successMessage: "Removed from cart successfully",
    errorMessage: "Error removing from cart",
  });
};

export const useUpdateCartItem = () => {
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutationWithToast<
    CartResponse,
    { itemId: string; quantity: number }
  >({
    mutationFn: async ({ itemId, quantity }) => {
      return await updateCartItem(itemId, quantity);
    },
    onSuccess: (data) => {
      setCart(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
    errorMessage: "Error updating cart item",
  });
};
