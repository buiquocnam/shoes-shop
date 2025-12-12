import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../../services/products.api";
import { ProductDetailType } from "@/features/product/types";
import { CreateProductInput } from "../../types";
import { queryKeys } from "@/features/shared";
import {
  flattenVariants,
  mapVariantsToStockItems,
} from "../../utils/productFormHelpers";

/**
 * Hook để tạo product mới
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductDetailType, Error, CreateProductInput>({
    mutationFn: async (data: CreateProductInput) => {
      // Step 1: Create product with images
      const { variants, images, ...productObject } = data;

      const formData = new FormData();
      const requestBlob = new Blob([JSON.stringify(productObject)], {
        type: "application/json",
      });
      formData.append("request", requestBlob, "request.json");
      images.forEach((image) => {
        formData.append("files", image);
      });

      const productResult = await adminProductsApi.createProduct(formData);
      const productId = productResult.id;

      // Step 2: Create variants
      const variantResults = await adminProductsApi.createVariants({
        productId,
        variants: flattenVariants(variants),
      });

      // Step 3: Import stock
      const stockItems = mapVariantsToStockItems(variants, variantResults);
      if (stockItems.length > 0) {
        await adminProductsApi.importStock({ productId, items: stockItems });
      }

      // Return product detail by fetching it
      return await adminProductsApi.getById(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
      toast.success("Create product successfully");
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    },
  });
};
