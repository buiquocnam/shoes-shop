import { useQuery } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";

/**
 * Get Product by ID
 */
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: sharedQueryKeys.product.detail(productId),
    queryFn: () => adminProductsApi.getProductById(productId),
    enabled: !!productId,
  });
};



