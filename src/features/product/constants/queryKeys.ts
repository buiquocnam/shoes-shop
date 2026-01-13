import { FetchBrandsParams } from "@/types/brand";

export const productQueryKeys = {
  all: ["product"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (filters?: unknown) =>
    [...productQueryKeys.lists(), filters] as const,
  detail: (id: string) => [...productQueryKeys.all, id] as const,
  topRated: () => [...productQueryKeys.all, "top-rated"] as const,

  category: {
    key: ["category"],
    lists: () => [...productQueryKeys.category.key, "list"] as const,
    list: (filters?: unknown) =>
      [...productQueryKeys.category.lists(), filters] as const,
  },
  brand: {
    key: ["brand"] as const,
    list: (filters?: FetchBrandsParams) => [...productQueryKeys.brand.key, "list", filters] as const,
  },
} as const;
