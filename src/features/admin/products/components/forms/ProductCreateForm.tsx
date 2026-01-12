"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldGroup } from "@/components/ui/field";
import { createProductSchema, CreateProductFormValues } from "../../schemas";
import { ProductBasicInfoSection } from "../sections/ProductBasicInfoSection";
import { ProductMediaSection } from "../sections/ProductMediaSection";
import { useProductFormData } from "../../hooks";
import { useCreateProduct } from "../../hooks/mutations";
import { generateSlug } from "../../utils/productFormHelpers";

interface ProductCreateFormProps {
  onSuccess: (productId: string) => void;
}

export const ProductCreateForm: React.FC<ProductCreateFormProps> = ({
  onSuccess,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const { categories, brands, isLoading: loadingFormData } = useProductFormData();
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
    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);
    form.setValue("images", updatedImages);

    if (images.length === 0 && newFiles.length > 0) {
      form.setValue("primaryName", newFiles[0].name);
    }
  };

  const handleRemoveImage = (index: number) => {
    const removedImage = images[index];
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    form.setValue("images", newImages);

    const currentPrimary = form.getValues("primaryName");
    if (removedImage.name === currentPrimary && newImages.length > 0) {
      form.setValue("primaryName", newImages[0].name);
    } else if (newImages.length === 0) {
      form.setValue("primaryName", "");
    }
  };

  const onSubmit = async (data: CreateProductFormValues) => {
    const formData = new FormData();

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

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("files", file);
      });
    }

    const result = await createProduct.mutateAsync(formData);
    onSuccess(result.id);
  };

  if (loadingFormData) {
    return (
      <div className="flex items-center justify-center p-20">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-10">
        <ProductBasicInfoSection
          register={form.register}
          control={form.control}
          errors={form.formState.errors}
          categories={categories}
          brands={brands}
        />
        <ProductMediaSection
          control={form.control}
          images={images}
          onAddImages={handleAddImages}
          onRemoveNewImage={handleRemoveImage}
        />

        <div className="flex items-center justify-end gap-x-6">
          <Button
            type="submit"
            disabled={createProduct.isPending}
            className="px-10 py-3.5 font-bold shadow-lg"
          >
            {createProduct.isPending ? <Spinner /> : "Tạo sản phẩm"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};
