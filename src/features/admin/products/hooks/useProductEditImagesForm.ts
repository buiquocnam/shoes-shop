import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../services/products.api";
import { ImageType } from "@/features/product/types";
import { ProductFormValues } from "../schema";
import { queryKeys } from "@/features/shared";

export const useProductEditImagesForm = (productId: string, images: File[]) => {
  const queryClient = useQueryClient();

  const updateImagesMutation = useMutation<
    ImageType[],
    Error,
    { productId: string; images: File[] }
  >({
    mutationFn: async ({ productId, images }) => {
      const formData = new FormData();
      const requestBlob = new Blob([JSON.stringify({ productId })], {
        type: "application/json",
      });
      console.log(productId);
      formData.append("request", requestBlob, "request.json");
      images.forEach((image) => {
        formData.append("files", image);
      });
      return await adminProductsApi.updateImages(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.detail(productId),
      });
    },
    onError: (error) => {
      console.error("Error updating product images:", error);
      toast.error("Failed to update product images. Please try again.");
    },
  });

  const handleSubmit = useCallback(
    async (data: ProductFormValues) => {
      // Mode images không cần data từ form, nhưng nhận để normalize signature
      try {
        await updateImagesMutation.mutateAsync({ productId, images });
        toast.success("Update product images successfully");
      } catch (error) {
        // Error handled by mutation's onError
      }
    },
    [productId, images, updateImagesMutation]
  );

  return {
    handleSubmit,
    isLoading: updateImagesMutation.isPending,
  };
};
