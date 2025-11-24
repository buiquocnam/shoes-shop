/**
 * Query keys for admin features
 * Used in: admin/variants, admin/dashboard
 * Note: product keys moved to shared-queryKeys.ts
 * Note: category and brand keys removed (use shared keys instead)
 */

export const adminQueryKeys = {
  variants: {
    all: ["admin", "variants"] as const,
    lists: () => [...adminQueryKeys.variants.all, "list"] as const,
    list: (filters?: unknown) =>
      [...adminQueryKeys.variants.lists(), filters] as const,
  },
  dashboard: {
    all: ["admin", "dashboard"] as const,
    revenue: () => [...adminQueryKeys.dashboard.all, "revenue"] as const,
    stats: () => [...adminQueryKeys.dashboard.all, "stats"] as const,
  },
} as const;
