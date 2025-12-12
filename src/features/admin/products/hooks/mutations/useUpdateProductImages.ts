import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../../services/products.api";
import { ImageType } from "@/features/product/types";
import { queryKeys } from "@/features/shared";

/**
 * Hook để cập nhật product images
 */
export const useUpdateProductImages = () => {
  const queryClient = useQueryClient();

  return useMutation<ImageType[], Error, { productId: string; images: File[] }>(
    {
      mutationFn: async ({ productId, images }) => {
        const formData = new FormData();
        const requestBlob = new Blob([JSON.stringify({ productId })], {
          type: "application/json",
        });
        formData.append("request", requestBlob, "request.json");
        images.forEach((image) => {
          formData.append("files", image);
        });
        return await adminProductsApi.updateImages(formData);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
        queryClient.invalidateQueries({
          queryKey: queryKeys.product.detail(variables.productId),
        });
        toast.success("Update product images successfully");
      },
      onError: (error) => {
        console.error("Error updating product images:", error);
        toast.error("Failed to update product images. Please try again.");
      },
    }
  );
};
