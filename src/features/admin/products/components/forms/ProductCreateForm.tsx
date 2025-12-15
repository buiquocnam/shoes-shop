"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createProductSchema, CreateProductFormValues } from "../../schemas";
import { ProductBasicInfoSection } from "../sections/ProductBasicInfoSection";
import { ProductMediaSection } from "../sections/ProductMediaSection";
import { useProductFormData } from "../../hooks";
import { useCreateProduct } from "../../hooks/mutations";
import { generateSlug } from "../../utils/productFormHelpers";

interface ProductCreateFormProps {
  onSuccess: (productId: string) => void;
}

/**
 * Form để Create Product
 * Step 1: Product Info + Images
 * Payload: FormData với JSON body (info) + multipart files (images)
 */
export const ProductCreateForm: React.FC<ProductCreateFormProps> = ({
  onSuccess,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const { categories, brands } = useProductFormData(true);
  const createProduct = useCreateProduct();

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      brandId: "",
      categoryId: "",
      price: 0,
      discount: 0,
      images: [],
      primaryName: "",
    },
  });

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    form.setValue("images", [...images, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    form.setValue("images", newImages);
  };

  const onSubmit = async (data: CreateProductFormValues) => {
    // Tạo FormData với JSON body (info) + multipart files (images)
    const formData = new FormData();

    // Add JSON data
    const productData = {
      name: data.name,
      description: data.description,
      brandId: data.brandId,
      categoryId: data.categoryId,
      price: data.price,
      discount: data.discount,
      slug: generateSlug(data.name),
      primaryName: data.primaryName,
    };
    const jsonBlob = new Blob([JSON.stringify(productData)], {
      type: "application/json",
    });
    formData.append("request", jsonBlob);
    // Add images
    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("files", file);
      });
    }

    const result = await createProduct.mutateAsync(formData);
    onSuccess(result.id);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductBasicInfoSection
          control={form.control}
          categories={categories}
          brands={brands}
        />
        <ProductMediaSection
          control={form.control}
          images={images}
          mode="create"
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
        <Button type="submit" disabled={createProduct.isPending}>
          {createProduct.isPending ? <Spinner /> : "Create Product"}
        </Button>
      </div>
    </form>
  );
};


