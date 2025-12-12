import { useState, useCallback } from "react";
import {
  useCreateProduct,
  useUpdateProductInfo,
  useUpdateProductImages,
  useCreateVariants,
} from "../mutations";
import { ProductFormValues } from "../../schema";
import { generateSlug, flattenVariants } from "../../utils/productFormHelpers";
import { CreateProductInput, ProductContentInput } from "../../types";
import { FormMode } from "../../utils/productFormHelpers";

interface UseProductFormOptions {
  productId?: string;
  images: File[];
  mode: FormMode;
}

/**
 * Hook chính quản lý form state và submit logic
 * Tách biệt logic mutation khỏi form state
 */
export const useProductForm = ({
  productId,
  images,
  mode,
}: UseProductFormOptions) => {
  const createProduct = useCreateProduct();
  const updateProductInfo = useUpdateProductInfo();
  const updateProductImages = useUpdateProductImages();
  const createVariants = useCreateVariants();

  const handleSubmit = useCallback(
    async (data: ProductFormValues) => {
      if (mode === "create") {
        const input: CreateProductInput = {
          name: data.name,
          slug: generateSlug(data.name),
          description: data.description,
          categoryId: data.category,
          brandId: data.brand || undefined,
          price: data.price ?? 0,
          discount: data.discount ?? 0,
          images: images,
          variants: data.variants!,
        };

        await createProduct.mutateAsync(input);
      } else if (mode === "info" && productId) {
        const input: ProductContentInput = {
          productId,
          name: data.name,
          slug: generateSlug(data.name),
          description: data.description,
          price: data.price,
          discount: data.discount,
          categoryId: data.category,
          brandId: data.brand,
        };

        await updateProductInfo.mutateAsync(input);
      } else if (mode === "images" && productId) {
        if (images.length === 0) {
          return;
        }
        await updateProductImages.mutateAsync({ productId, images });
      } else if (mode === "variants" && productId) {
        if (!data.variants || data.variants.length === 0) {
          return;
        }

        // Create variants
        await createVariants.mutateAsync({
          productId,
          variants: flattenVariants(data.variants),
        });
      }
    },
    [
      mode,
      productId,
      images,
      createProduct,
      updateProductInfo,
      updateProductImages,
      createVariants,
    ]
  );

  const isLoading =
    createProduct.isPending ||
    updateProductInfo.isPending ||
    updateProductImages.isPending ||
    createVariants.isPending;

  return {
    handleSubmit,
    isLoading,
  };
};

/**
 * Hook quản lý images state (tách riêng để tái sử dụng)
 */
export const useProductImages = () => {
  const [images, setImages] = useState<File[]>([]);

  const handleAddImages = useCallback((files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    handleAddImages,
    handleRemoveImage,
    resetImages,
  };
};
