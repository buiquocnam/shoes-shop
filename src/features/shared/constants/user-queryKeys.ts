/**
 * Query keys for user-facing features
 * Used in: cart, checkout, profile, review features
 * Note: product keys moved to shared-queryKeys.ts
 */

export const userQueryKeys = {
  // Cart
  cart: {
    key: ["cart"],
    current: () => [...userQueryKeys.cart.key, "current"] as const,
  },

  // Checkout
  checkout: {
    key: ["checkout"],
    shippingMethods: () =>
      [...userQueryKeys.checkout.key, "shipping-methods"] as const,
    discount: (code?: string) =>
      [...userQueryKeys.checkout.key, "discount", code] as const,
  },

  // Profile
  profile: {
    key: ["profile"],
    purchasedProducts: (filters?: unknown) =>
      [...userQueryKeys.profile.key, "purchased-products", filters] as const,
  },

  // Reviews
  review: {
    key: ["review"],
    lists: (productId: string) =>
      [...userQueryKeys.review.key, productId] as const,
  },

  // Coupon
  coupon: {
    key: ["coupon"],
    get: (code: string) => [...userQueryKeys.coupon.key, code] as const,
    list: () => [...userQueryKeys.coupon.key, "list"] as const,
  },
} as const;
