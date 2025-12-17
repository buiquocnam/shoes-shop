import { CheckoutItem } from "../types/checkout";

const CHECKOUT_ITEMS_KEY = "checkout-items";
const CHECKOUT_SOURCE_KEY = "checkout-source";

export type CheckoutSource = "cart" | "product";

export const setCheckoutItems = (
  items: CheckoutItem[],
  source?: CheckoutSource
): void => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(CHECKOUT_ITEMS_KEY, JSON.stringify(items));
    if (source) {
      sessionStorage.setItem(CHECKOUT_SOURCE_KEY, source);
    }
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

export const getCheckoutSource = (): CheckoutSource | null => {
  if (typeof window !== "undefined") {
    return (
      (sessionStorage.getItem(CHECKOUT_SOURCE_KEY) as CheckoutSource) || null
    );
  }
  return null;
};

export const clearCheckoutItems = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(CHECKOUT_ITEMS_KEY);
    sessionStorage.removeItem(CHECKOUT_SOURCE_KEY);
  }
};
