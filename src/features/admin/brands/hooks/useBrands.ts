import { useQueryClient, useMutation } from "@tanstack/react-query";
import { BrandType } from "@/features/product/types";
import { adminBrandsApi } from "@/features/admin/brands/services/brands.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";

// Re-export shared useBrands for convenience
export { useBrands } from "@/features/shared/hooks/useBrands";

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<BrandType, Error, FormData>({
    mutationFn: (data: FormData) => adminBrandsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.brand.list(),
      });
      toast.success("Brand created successfully");
    },
    onError: () => {
      toast.error("Failed to create brand");
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<BrandType, Error, { id: string; data: FormData }>({
    mutationFn: ({ id, data }) => adminBrandsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.brand.list(),
      });
      toast.success("Brand updated successfully");
    },
    onError: () => {
      toast.error("Failed to update brand");
    },
  });
};

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
      toast.success("Brand deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete brand");
    },
  });
};
