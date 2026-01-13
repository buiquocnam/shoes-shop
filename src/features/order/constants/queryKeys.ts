export const orderQueryKeys = {
  all: ["order"] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...orderQueryKeys.details(), id] as const,
  adminDetail: (id: string) => [...orderQueryKeys.details(), "admin", id] as const,
  adminUserDetail: (id: string) => [...orderQueryKeys.details(), "admin-user", id] as const,
};
