import { CheckoutItem, CheckoutItemApiRequest } from "../types/checkout";

/**
 * Convert CheckoutItem (có đầy đủ thông tin) sang format API (chỉ variantId, quantity, totalPrice)
 * Lưu ý: variantId ở đây là id của size, không phải id của variant
 */
export const convertCheckoutItemsToApiFormat = (
  items: CheckoutItem[]
): CheckoutItemApiRequest[] => {
  return items.map((item) => ({
    variantId: item.size.id, // variantId là id của size
    quantity: item.quantity,
    totalPrice: item.totalPrice,
  }));
};
