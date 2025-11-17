import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BrandType } from '@/features/product/types';
import { adminBrandsApi } from '@/features/admin/brands/services/brand';
import { toast } from 'sonner';

// Re-export shared useBrands for convenience
export { useBrands } from '@/features/shared/hooks/useBrands';

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<BrandType, Error, FormData>({
    mutationFn: (data: FormData) => adminBrandsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create brand');
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<BrandType, Error, { id: string, data: FormData }>({
    mutationFn: ({ id, data }) => adminBrandsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update brand');
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => adminBrandsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete brand');
    },
  });
};