import { CheckoutItem } from "../types";

const CHECKOUT_ITEMS_KEY = "checkout-items";

export const setCheckoutItems = (items: CheckoutItem[]): void => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(CHECKOUT_ITEMS_KEY, JSON.stringify(items));
  }
};

export const getCheckoutItems = (): CheckoutItem[] => {
  if (typeof window !== "undefined") {
    const items = sessionStorage.getItem(CHECKOUT_ITEMS_KEY);
    if (items) {
      try {
        return JSON.parse(items);
      } catch {
        return [];
      }
    }
  }
  return [];
};

export const clearCheckoutItems = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(CHECKOUT_ITEMS_KEY);
  }
};
