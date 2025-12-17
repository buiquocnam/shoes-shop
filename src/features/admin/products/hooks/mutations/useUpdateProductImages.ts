import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  adminProductsApi,
  UpdateImagesInput,
} from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";

/**
 * Update Images Mutation
 * Update danh sách name + primaryName qua JSON
 */
export const useUpdateProductImages = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, FormData>({
    mutationFn: (data: FormData) => adminProductsApi.updateImages(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail((data as any).productId),
      });
      toast.success("Images updated successfully");
    },
    onError: () => {
      toast.error("Failed to update images");
    },
  });
};









