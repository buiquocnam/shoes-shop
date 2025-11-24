/**
 * Query keys for user-facing features
 * Used in: cart, checkout, profile, review features
 * Note: product keys moved to shared-queryKeys.ts
 */

export const userQueryKeys = {
  // Cart
  cart: {
    all: ["cart"] as const,
    current: () => [...userQueryKeys.cart.all, "current"] as const,
  },

  // Checkout
  checkout: {
    all: ["checkout"] as const,
    shippingMethods: () =>
      [...userQueryKeys.checkout.all, "shipping-methods"] as const,
    discount: (code?: string) =>
      [...userQueryKeys.checkout.all, "discount", code] as const,
  },

  // Profile
  profile: {
    all: ["profile"] as const,
    purchasedProducts: (userId: string) =>
      [...userQueryKeys.profile.all, "purchased-products", userId] as const,
  },

  // Reviews
  review: {
    all: ["review"] as const,
    lists: (productId: string) =>
      [...userQueryKeys.review.all, productId] as const,
  },
} as const;
