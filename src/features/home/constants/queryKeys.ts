export const homeQueryKeys = {
  banner: {
    key: ["banner"] as const,
    list: () => [...homeQueryKeys.banner.key, "list"] as const,
  },
} as const;
