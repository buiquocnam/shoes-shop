import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "../services/products.api";
import { AdminProductFilters } from "../types";
import {
  ProductPaginationResponse,
  ProductDetailType,
} from "@/features/product/types";
import { queryKeys, useMutationWithToast } from "@/features/shared";

export const useProducts = (filters?: AdminProductFilters) => {
  return useQuery<ProductPaginationResponse>({
    queryKey: queryKeys.product.list(filters),
    queryFn: () => adminProductsApi.getAll(filters),
	
  });
};

export const useProduct = (id: string) => {
  return useQuery<ProductDetailType>({
    queryKey: queryKeys.product.detail(id),
    queryFn: () => adminProductsApi.getById(id),
    enabled: !!id && id.length > 0,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<void, string>({
    mutationFn: (id: string) => adminProductsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
    },
    successMessage: "Product deleted successfully",
    errorMessage: "Failed to delete product",
  });
};
