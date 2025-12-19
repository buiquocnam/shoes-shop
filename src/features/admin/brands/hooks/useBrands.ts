import { useQueryClient, useMutation } from "@tanstack/react-query";
import { BrandType } from "@/features/product/types";
import { adminBrandsApi } from "@/features/admin/brands/services/brands.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";
// Re-export shared useBrands for convenience
export { useBrands } from "@/features/shared/hooks/useBrands";

export const useUpsertBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<BrandType, Error, FormData>({
    mutationFn: (data: FormData) => adminBrandsApi.upsert(data),
    onSuccess: (_, formData) => {
      // Invalidate all brand queries (including those with filters)
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.brand.list(),
      });
      toast.success("Thành công");
    },
    onError: () => {
      toast.error("Thao tác thất bại");
    },
  });
};

// Backward compatibility: Keep old names but use new hook internally
export const useCreateBrand = useUpsertBrand;
export const useUpdateBrand = useUpsertBrand;

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      const result = await adminBrandsApi.delete(id);
      if (!result) {
        throw new Error("Failed to delete brand");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.brand.list(),
      });
      toast.success("Xóa thương hiệu thành công");
    },
    onError: () => {
      toast.error("Xóa thương hiệu thất bại");
    },
  });
};
