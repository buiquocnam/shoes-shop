export const adminQueryKeys = {
  dashboard: {
    summary: (from: string, to: string) => ["admin", "dashboard", "summary", from, to] as const,
    revenueChart: (year: number) => ["admin", "dashboard", "revenue", year] as const,
  },
  users: {
    key: ["admin", "users"] as const,
    list: (filters?: any) => ["admin", "users", "list", filters] as const,
    detail: (id: string) => ["admin", "users", "detail", id] as const,
    purchasedItems: (userId: string, page: number, size: number) => 
      ["admin", "users", "purchased", userId, page, size] as const,
  },
  payments: {
    key: ["admin", "payments"] as const,
    list: (filters: any) => ["admin", "payments", "list", filters] as const,
    detail: (id: string) => ["admin", "payments", "detail", id] as const,
  },
  coupons: {
    key: ["admin", "coupons"] as const,
    list: (filters?: any) => ["admin", "coupons", "list", filters] as const,
  },
} as const;
