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
    purchasedItems: (userId: string, page?: number, limit?: number) =>
      [
        ...adminQueryKeys.users.key,
        "purchased-items",
        userId,
        page,
        limit,
      ] as const,
  },
  payments: {
    key: ["payments"],
    list: () => [...adminQueryKeys.payments.key, "list"] as const,
    detail: (id: string) =>
      [...adminQueryKeys.payments.key, "detail", id] as const,
  },
} as const;
