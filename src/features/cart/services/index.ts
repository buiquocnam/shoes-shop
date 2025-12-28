import axiosInstance from '@/lib/axios';
import { AddToCartRequest ,CartResponse } from '@/features/cart/types';

/**
 * Get user's cart
 */
export const getCart = async () => {
    const response = await axiosInstance.get<CartResponse>('/shoes/cart');
    return response.data;
};

/**
 * Add item to cart
 */
export const addToCart = async (request: AddToCartRequest) => {
    const response = await axiosInstance.post<CartResponse>(`/shoes/cart`, { 
        quantity: request.quantity,
        variantSizeId: request.varianSizeId
    });
    return response.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (itemId: string, quantity: number) => {
    const response = await axiosInstance.put<CartResponse>(`/shoes/cart/items/${itemId}`, { quantity });
    return response.data;
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (itemId: string) => {
    const response = await axiosInstance.delete<CartResponse>(`/shoes/cart/items/${itemId}`);
    return response.data;
};

/**
 * Clear entire cart
 */
export const clearCart = async () => {
    await axiosInstance.delete('/shoes/cart/clear');
};
