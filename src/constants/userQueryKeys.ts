export const userQueryKeys = {
  cart: {
    key: ["cart"] as const,
    current: () => [...userQueryKeys.cart.key, "current"] as const,
  },
  checkout: {
    key: ["checkout"] as const,
  },
  profile: {
    key: ["profile"] as const,
    purchasedProducts: (filters?: any) =>
      [...userQueryKeys.profile.key, "purchased-products", filters] as const,
  },
  review: {
    key: ["review"] as const,
    lists: (productId: string, page: number, size: number) =>
      [...userQueryKeys.review.key, productId, page, size] as const,
  },
  coupon: {
    key: ["coupon"] as const,
    list: () => [...userQueryKeys.coupon.key, "list"] as const,
    get: (code: string) => [...userQueryKeys.coupon.key, "detail", code] as const,
  },
} as const;
