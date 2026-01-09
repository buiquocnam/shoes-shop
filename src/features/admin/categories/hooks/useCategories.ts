import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { CategoryType } from "@/features/product/types";
import { adminCategoriesApi } from "@/features/admin/categories/services/categories.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { categoriesApi } from "@/features/shared/services/categories.api";
import { toast } from "sonner";
import { Filters } from "@/features/shared/types";

// Re-export shared useCategories for convenience
export { useCategories } from "@/features/shared/hooks/useCategories";

// Admin-specific hook with pagination support
export const useGetCategories = (filters?: Filters) => {
  return useQuery({
    queryKey: sharedQueryKeys.category.list(filters),
    queryFn: () => categoriesApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string }) => adminCategoriesApi.create(data),
    onSuccess: () => {
      // Invalidate all category list queries (with or without filters)
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.category.lists(),
      });
      toast.success("Tạo danh mục thành công");
    },
    onError: () => {
      toast.error("Tạo danh mục thất bại");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description: string } }) => adminCategoriesApi.update(id, data),
    onSuccess: () => {
      // Invalidate all category list queries (with or without filters)
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.category.lists(),
      });
      toast.success("Cập nhật danh mục thành công");
    },
    onError: () => {
      toast.error("Cập nhật danh mục thất bại");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await adminCategoriesApi.delete(id);
      if (!result) {
        throw new Error("Failed to delete category");
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate all category list queries (with or without filters)
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.category.lists(),
      });
      toast.success("Xóa danh mục thành công");
    },
    onError: () => {
      toast.error("Xóa danh mục thất bại");
    },
  });
};
