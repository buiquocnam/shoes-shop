"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { productImagesSchema, ImagesFormValues } from "../../schemas";
import { ProductMediaSection } from "../sections/ProductMediaSection";
import { useProduct } from "../../hooks";
import { useUpdateProductImages } from "../../hooks/mutations";
import { ImageType } from "@/features/product/types";

interface ProductImageFormProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Form riêng cho product images
 * Tự quản lý useForm, defaultValues, submit logic
 */
export const ProductImageForm: React.FC<ProductImageFormProps> = ({
  productId,
  onSuccess,
  onCancel,
}) => {
  const [newImages, setNewImages] = useState<File[]>([]);
  const { data, isLoading: loadingProduct } = useProduct(productId);
  const updateImages = useUpdateProductImages();

  const existingImages = data?.listImg || [];

  const form = useForm<ImagesFormValues>({
    resolver: zodResolver(productImagesSchema),
    defaultValues: {
      imageNames: existingImages.map((img: ImageType) => img.fileName),
      primaryName: existingImages.find((img: ImageType) => img.isPrimary)?.fileName || "",
    },
  });

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setNewImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ImagesFormValues) => {
    const formData = new FormData();
    // Step 1: Upload new images (nếu có)
    if (newImages.length > 0) {
      newImages.forEach((file) => {
        formData.append("files", file);
      });
    }
    const updateData = {
      productId,
      imageNames: newImages.map((img) => img.name),
      primaryName: data.primaryName,
    };
    const jsonBlob = new Blob([JSON.stringify(updateData)], {
      type: "application/json",
    });
    formData.append("request", jsonBlob);
    await updateImages.mutateAsync({ productId, data: formData });
    onSuccess();
  };

  if (loadingProduct) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ProductMediaSection
        control={form.control}
        images={newImages}
        existingImages={existingImages}
        mode="images"
        onAddImages={handleAddImages}
        onRemoveImage={handleRemoveImage}
      />

      <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
        <Button
          variant="outline"
          type="button"
          disabled={updateImages.isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateImages.isPending}
        >
          {updateImages.isPending ? (
            <Spinner />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
};


