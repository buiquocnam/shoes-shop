import { useQueryClient } from "@tanstack/react-query";
import { BrandType } from "@/features/product/types";
import { adminBrandsApi } from "@/features/admin/brands/services/brands.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { useMutationWithToast } from "@/features/shared";

// Re-export shared useBrands for convenience
export { useBrands } from "@/features/shared/hooks/useBrands";

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<BrandType, FormData>({
    mutationFn: (data: FormData) => adminBrandsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.brand.lists(),
      });
    },
    successMessage: "Brand created successfully",
    errorMessage: "Failed to create brand",
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<BrandType, { id: string; data: FormData }>({
    mutationFn: ({ id, data }) => adminBrandsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.brand.lists(),
      });
    },
    successMessage: "Brand updated successfully",
    errorMessage: "Failed to update brand",
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<boolean, string>({
    mutationFn: async (id: string) => {
      const result = await adminBrandsApi.delete(id);
      if (!result) {
        throw new Error("Failed to delete brand");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.brand.lists(),
      });
    },
    successMessage: "Brand deleted successfully",
    errorMessage: "Failed to delete brand",
  });
};
