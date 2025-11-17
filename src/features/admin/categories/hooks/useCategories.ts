import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryType } from '@/features/product/types';
import { adminCategoriesApi } from '@/features/admin/categories/services/categories.api';
import { toast } from 'sonner';

// Re-export shared useCategories for convenience
export { useCategories } from '@/features/shared/hooks/useCategories';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<CategoryType, Error, { name: string; description: string }>({
    mutationFn: (data) => adminCategoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<CategoryType, Error, { id: string; data: { name: string; description: string } }>({
    mutationFn: ({ id, data }) => adminCategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => adminCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete category');
    },
  });
};

