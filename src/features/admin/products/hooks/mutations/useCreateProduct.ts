import { useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { useMutationWithToast } from "@/features/shared";

/**
 * Create Product Mutation
 * Payload: FormData với JSON body (info) + multipart files (images)
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<{ id: string }, FormData>({
    mutationFn: (data: FormData) => adminProductsApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(data.id),
      });
    },
    successMessage: "Product created successfully",
    errorMessage: "Failed to create product",
  });
};


