import { FetchBrandsParams } from "../types";

export const sharedQueryKeys = {
  product: {
    key: ["product"],
    lists: () => [...sharedQueryKeys.product.key, "list"] as const,
    list: (filters?: unknown) =>
      [...sharedQueryKeys.product.lists(), filters] as const,
    detail: (id: string) => [...sharedQueryKeys.product.key, id] as const,
    topRated: () => [...sharedQueryKeys.product.key, "top-rated"] as const,
  },

  category: {
    key: ["category"],
    lists: () => [...sharedQueryKeys.category.key, "list"] as const,
    list: (filters?: unknown) =>
      [...sharedQueryKeys.category.lists(), filters] as const,
  },
  brand: {
    key: ["brand"] as const,
    list: (filters?: FetchBrandsParams) => [...sharedQueryKeys.brand.key, "list", filters] as const,
  },
  banner: {
    key: ["banner"] as const,
    list: () => [...sharedQueryKeys.banner.key, "list"] as const,
  },
} as const;

export const addressQueryKeys = {
  provinces: ["provinces"] as const,
  districts: (provinceCode: number) => ["districts", provinceCode] as const,
  wards: (districtCode: number) => ["wards", districtCode] as const,
  usersAddress: (userId: string) => ["usersAddress", userId] as const,
};
