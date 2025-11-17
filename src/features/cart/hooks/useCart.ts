'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { getCart, addToCart, removeCartItem, clearCart, updateCartItem } from '@/features/cart/services';
import { CartResponse } from '@/features/cart/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fa } from 'zod/v4/locales';

/**
 * Hook to fetch and manage cart data
 */
export const useCart = () => {
  const { setCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { data: cart, isLoading, error, refetch } = useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: async () => await getCart(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (cart) setCart(cart);
  }, [cart, setCart]);

  return {
    cart,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

/**
 * Hook to create/add an item to the cart
 */
export const useCreateCart = ( ) => {
  const { setCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationKey: ['create-cart'],
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }
      return await addToCart(variantId, quantity);
    },
    onSuccess: (data) => {
      setCart(data);
    },
    onError: (error: any) => {
      console.error('Error adding to cart:', error);
    },
  });
};

export const useRemoveCartItem = () => {
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: async (itemId: string) => {
      return await removeCartItem(itemId);
    },
    onSuccess: (data) => {
      setCart(data);
    },
    onError: (err) => console.error('Error removing cart item:', err),
  });
};


export const useUpdateCartItem = () => {
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return await updateCartItem(itemId, quantity);
    },
    onSuccess: (data) => {
      setCart(data); 
    },
    onError: (err) => console.error('Error updating cart item:', err),
  });
};