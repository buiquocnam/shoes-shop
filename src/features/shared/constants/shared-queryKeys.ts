/**
 * Query keys for shared resources used across multiple features
 * Used in: shared services (categories, brands), auth, products (user & admin)
 */

export const sharedQueryKeys = {
  product: {
    all: ["product"] as const,
    lists: () => [...sharedQueryKeys.product.all, "list"] as const,
    list: (filters?: unknown) =>
      [...sharedQueryKeys.product.lists(), filters] as const,
    detail: (id: string) => [...sharedQueryKeys.product.all, id] as const,
    topRated: () => [...sharedQueryKeys.product.all, "top-rated"] as const,
  },

  category: {
    all: ["shared", "category"] as const,
    lists: () => [...sharedQueryKeys.category.all, "list"] as const,
  },
  brand: {
    all: ["shared", "brand"] as const,
    lists: (filters?: unknown) =>
      [...sharedQueryKeys.brand.all, filters] as const,
  },
} as const;
