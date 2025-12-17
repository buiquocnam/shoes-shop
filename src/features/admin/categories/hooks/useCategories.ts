import { useQueryClient, useMutation } from "@tanstack/react-query";
import { CategoryType } from "@/features/product/types";
import { adminCategoriesApi } from "@/features/admin/categories/services/categories.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";
// Re-export shared useCategories for convenience
export { useCategories } from "@/features/shared/hooks/useCategories";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CategoryType,
    Error,
    { name: string; description: string }
  >({
    mutationFn: (data) => adminCategoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.category.list(),
      });
      toast.success("Category created successfully");
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CategoryType,
    Error,
    { id: string; data: { name: string; description: string } }
  >({
    mutationFn: ({ id, data }) => adminCategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.category.list(),
      });
      toast.success("Category updated successfully");
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      const result = await adminCategoriesApi.delete(id);
      if (!result) {
        throw new Error("Failed to delete category");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.category.list(),
      });
      toast.success("Category deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });
};
