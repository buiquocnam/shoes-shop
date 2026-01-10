"use client";

import { useState, useEffect } from "react";
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


export const ProductImageForm: React.FC<ProductImageFormProps> = ({
  productId,
  onSuccess,
  onCancel,
}) => {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImageNames, setDeletedImageNames] = useState<string[]>([]);
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

  // Reset form when product data loads
  useEffect(() => {
    if (data && !loadingProduct) {
      const images = data.listImg || [];
      form.reset({
        imageNames: images.map((img: ImageType) => img.fileName),
        primaryName: images.find((img: ImageType) => img.isPrimary)?.fileName || "",
      });
    }
  }, [data, loadingProduct, productId, form]);

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setNewImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (fileName: string) => {
    setDeletedImageNames((prev) => {
      if (prev.includes(fileName)) {
        return prev.filter((name) => name !== fileName);
      }
      return [...prev, fileName];
    });
  };

  const onSubmit = async (data: ImagesFormValues) => {
    const formData = new FormData();

    // Add new files to upload
    if (newImages.length > 0) {
      newImages.forEach((file) => {
        formData.append("files", file);
      });
    }

    // Prepare request payload
    // names: array of image names to DELETE
    // primaryName: the new primary image name (can be from existing or new)
    // Chỉ gửi phần sau dấu _ của primaryName
    const getPrimaryNameAfterUnderscore = (name: string): string => {
      const underscoreIndex = name.indexOf('_');
      return underscoreIndex !== -1 ? name.substring(underscoreIndex + 1) : name;
    };

    const updateData = {
      productId,
      names: deletedImageNames, // Array of image names to delete
      primaryName: getPrimaryNameAfterUnderscore(data.primaryName),
    };

    const jsonBlob = new Blob([JSON.stringify(updateData)], {
      type: "application/json",
    });
    formData.append("request", jsonBlob);
    await updateImages.mutateAsync({ productId, data: formData });
    onSuccess();
    setNewImages([]);
    setDeletedImageNames([]);
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
        deletedImageNames={deletedImageNames}
        onAddImages={handleAddImages}
        onRemoveNewImage={handleRemoveNewImage}
        onRemoveExistingImage={handleRemoveExistingImage}
      />

      <div className="flex items-center justify-end gap-x-6 pt-6 mt-8">
        <Button
          variant="ghost"
          type="button"
          disabled={updateImages.isPending}
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          disabled={updateImages.isPending}
          className="px-10 py-3.5 text-sm font-semibold shadow-lg shadow-destructive/20 hover:shadow-destructive/40 transition-all duration-300"
        >
          {updateImages.isPending ? (
            <Spinner />
          ) : (
            "Lưu"
          )}
        </Button>
      </div>
    </form>
  );
};


