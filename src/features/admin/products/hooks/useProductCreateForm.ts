import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../services/products.api";
import { ProductFormValues } from "../schema";
import { generateSlug } from "../utils/productFormHelpers";
import { ProductDetailType } from "@/features/product/types";
import { CreateProductInput } from "../types";
import { queryKeys } from "@/features/shared";

export const useProductCreateForm = (images: File[]) => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation<
    ProductDetailType,
    unknown,
    CreateProductInput
  >({
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

      // Step 2: Create variants (flatten variants with sizes)
      const variantRequests: Array<{ color: string; size: number }> = [];

      variants.forEach((variant) => {
        variant.sizes.forEach((sizeData) => {
          variantRequests.push({
            color: variant.color,
            size: sizeData.size,
          });
        });
      });

      const variantResults = await adminProductsApi.createVariants({
        productId,
        variants: variantRequests,
      });

      // Step 3: Import stock
      let variantIndex = 0;
      const stockItems: Array<{ variantId: string; count: number }> = [];

      variants.forEach((variant) => {
        variant.sizes.forEach((sizeData) => {
          if (variantResults[variantIndex]) {
            stockItems.push({
              variantId: variantResults[variantIndex].id,
              count: sizeData.stock,
            });
            variantIndex++;
          }
        });
      });

      if (stockItems.length > 0) {
        await adminProductsApi.importStock({
          productId,
          items: stockItems,
        });
      }

      // Return product detail by fetching it
      return await adminProductsApi.getById(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
    },
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });

  const handleSubmit = useCallback(
    async (data: ProductFormValues) => {
      try {
        // Validation logic (can be moved to schema)
        if (
          !data.name ||
          !data.description ||
          !data.category ||
          !data.variants ||
          data.variants.length === 0
        ) {
          toast.error("Please fill in all required fields.");
          return;
        }

        await createProductMutation.mutateAsync({
          name: data.name,
          slug: generateSlug(data.name),
          description: data.description,
          categoryId: data.category,
          brandId: data.brand || undefined,
          price: data.price ?? 0,
          discount: data.discount ?? 0,
          images: images,
          variants: data.variants!,
        });

        toast.success("Create product successfully");
      } catch (error) {
        // Error handled by mutation's onError
      }
    },
    [images, createProductMutation]
  );

  return {
    handleSubmit,
    isLoading: createProductMutation.isPending,
  };
};
