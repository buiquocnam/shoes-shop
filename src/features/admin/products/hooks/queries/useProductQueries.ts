import { useQuery } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { productQueryKeys } from "@/features/product/constants/queryKeys";

/**
 * Get Product by ID
 */
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => adminProductsApi.getProductById(productId),
    enabled: !!productId,
  });
};



