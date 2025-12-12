import { apiClient } from '@/lib/api';
import { AddToCartRequest ,CartResponse } from '@/features/cart/types';

/**
 * Get user's cart
 */
export const getCart = async (): Promise<CartResponse> => {
    const response = await apiClient.get<CartResponse>('/shoes/cart');
    return response.result;
};

/**
 * Add item to cart
 */
export const addToCart = async (request: AddToCartRequest): Promise<CartResponse> => {
    const response = await apiClient.post<CartResponse>(`/shoes/cart`, { 
        quantity: request.quantity,
        variantId: request.variantId
    });
    return response.result;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (itemId: string, quantity: number): Promise<CartResponse> => {
    const response = await apiClient.put<CartResponse>(`/shoes/cart/items/${itemId}`, { quantity });
    return response.result;
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (itemId: string): Promise<CartResponse> => {
    const response = await apiClient.delete<CartResponse>(`/shoes/cart/items/${itemId}`);
    return response.result;
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<void> => {
    await apiClient.delete('/shoes/cart/clear');
};
