"use client";

import { useCartStore } from "@/store/useCartStore";
import {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItem,
} from "@/features/cart/services";
import { CartResponse, AddToCartRequest } from "@/features/cart/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { userQueryKeys } from "@/features/shared/constants/user-queryKeys";
import { toast } from "sonner";

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
    queryKey: userQueryKeys.cart.current(),
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

  return useMutation<CartResponse, Error, AddToCartRequest>({
    mutationFn: async (request: AddToCartRequest) => {
      return await addToCart(request);
    },
    onSuccess: (data) => {
      setCart(data);
      queryClient.invalidateQueries({ queryKey: userQueryKeys.cart.current() });
      toast.success("Đã thêm vào giỏ hàng thành công");
    },
    onError: () => {
      toast.error("Lỗi khi thêm vào giỏ hàng");
    },
  });
};

export const useRemoveCartItem = () => {
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, string>({
    mutationFn: async (itemId: string) => {
      return await removeCartItem(itemId);
    },
    onSuccess: (data) => {
      setCart(data);
      queryClient.invalidateQueries({ queryKey: userQueryKeys.cart.current() });
      toast.success("Đã xóa khỏi giỏ hàng thành công");
    },
    onError: () => {
      toast.error("Lỗi khi xóa khỏi giỏ hàng");
    },
  });
};

export const useUpdateCartItem = () => {
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, { itemId: string; quantity: number }>(
    {
      mutationFn: async ({ itemId, quantity }) => {
        return await updateCartItem(itemId, quantity);
      },
      onSuccess: (data) => {
        setCart(data);
        queryClient.invalidateQueries({
          queryKey: userQueryKeys.cart.current(),
        });
      },
      onError: () => {
        toast.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng");
      },
    }
  );
};
