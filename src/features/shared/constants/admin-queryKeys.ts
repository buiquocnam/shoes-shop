/**
 * Query keys for admin features
 * Used in: admin/variants, admin/dashboard
 * Note: product keys moved to shared-queryKeys.ts
 * Note: category and brand keys removed (use shared keys instead)
 */

export const adminQueryKeys = {
  variants: {
    key: ["variants"],
    lists: () => [...adminQueryKeys.variants.key, "list"] as const,
    list: (filters?: unknown) =>
      [...adminQueryKeys.variants.lists(), filters] as const,
  },
  dashboard: {
    key: ["dashboard"],
    revenue: () => [...adminQueryKeys.dashboard.key, "revenue"] as const,
    stats: () => [...adminQueryKeys.dashboard.key, "stats"] as const,
  },

  users: {
    key: ["users"],
    list: () => [...adminQueryKeys.users.key, "list"] as const,
    purchasedItems: (userId: string) =>
      [...adminQueryKeys.users.key, "purchased-items", userId] as const,
  },
} as const;
