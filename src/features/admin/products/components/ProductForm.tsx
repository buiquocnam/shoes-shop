"use client";

import { useState, useMemo, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ProductFormValues } from "../schema";
import {
    useUpdateProduct,
    useCreateProduct,
    useUpdateProductImages,
    useUpdateProductVariants,
} from "../hooks";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi, brandsApi } from "@/features/shared/services";
import { ProductDetailType } from "@/features/product/types";
import { generateSlug, DIALOG_TITLES } from "../utils/productFormHelpers";
import { ProductFormContent } from "./ProductFormContent";

type FormMode = "info" | "images" | "variants" | "create";

interface ProductFormProps {
    product?: ProductDetailType;
    trigger?: React.ReactNode;
    mode?: FormMode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

// Main component - chỉ quản lý dialog và state
export const ProductForm: React.FC<ProductFormProps> = ({
    product: productProp,
    trigger,
    mode = productProp ? "info" : "create",
    open: openProp,
    onOpenChange,
}) => {
    const [images, setImages] = useState<File[]>([]);
    const [internalOpen, setInternalOpen] = useState(false);

    const isEditMode = !!productProp;
    const isCreateMode = mode === "create";
    const productId = productProp?.product?.id;

    const open = openProp !== undefined ? openProp : internalOpen;

    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (openProp === undefined) {
                setInternalOpen(newOpen);
            }
            onOpenChange?.(newOpen);
            // Reset images khi dialog đóng
            if (!newOpen) {
                setImages([]);
            }
        },
        [openProp, onOpenChange]
    );

    const updateProductMutation = useUpdateProduct();
    const updateImagesMutation = useUpdateProductImages();
    const updateVariantsMutation = useUpdateProductVariants();
    const createProductMutation = useCreateProduct();

    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: categoriesApi.getAll,
    });
    const { data: brandsData } = useQuery({
        queryKey: ["brands"],
        queryFn: () => brandsApi.search(),
    });

    const categories = categoriesData || [];
    const brands = brandsData?.data || [];

    const handleUpdateInfo = useCallback(
        async (data: ProductFormValues, id: string) => {
            if (!data.name || !data.description || !data.category || !data.brand) {
                return;
            }

            await updateProductMutation.mutateAsync({
                id,
                name: data.name,
                slug: generateSlug(data.name),
                description: data.description,
                categoryId: data.category,
                brandId: data.brand,
                price: data.price ?? 0,
                discount: data.discount ?? 0,
            });
        },
        [updateProductMutation]
    );

    const handleUpdateImages = useCallback(
        async (id: string) => {
            if (images.length === 0) {
                toast.error("Please upload at least one image");
                return;
            }
            await updateImagesMutation.mutateAsync({ productId: id, images });
            setImages([]);
        },
        [images, updateImagesMutation]
    );

    const handleUpdateVariants = useCallback(
        async (data: ProductFormValues, id: string) => {
            if (!data.variants || data.variants.length === 0) {
                return;
            }

            await updateVariantsMutation.mutateAsync({
                productId: id,
                variants: data.variants,
            });
        },
        [updateVariantsMutation]
    );

    const handleCreate = useCallback(
        async (data: ProductFormValues) => {
            if (
                !data.name ||
                !data.description ||
                !data.category ||
                !data.variants ||
                data.variants.length === 0
            ) {
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
                variants: data.variants,
            });
            setImages([]);
        },
        [images, createProductMutation]
    );

    const handleSubmit = useCallback(
        async (data: ProductFormValues) => {
            try {
                if (mode === "images" && images.length === 0) {
                    toast.error("Please upload at least one image");
                    return;
                }

                if (isEditMode && productId) {
                    switch (mode) {
                        case "info":
                            await handleUpdateInfo(data, productId);
                            break;
                        case "images":
                            await handleUpdateImages(productId);
                            break;
                        case "variants":
                            await handleUpdateVariants(data, productId);
                            break;
                    }
                } else if (isCreateMode) {
                    await handleCreate(data);
                }

                toast.success(
                    `${isEditMode ? "Update" : "Create"} product successfully`
                );
                handleOpenChange(false);
            } catch (error) {
                console.error(
                    `Error ${isEditMode ? "updating" : "creating"} product:`,
                    error
                );
                toast.error(
                    `Failed to ${isEditMode ? "update" : "create"} product. Please try again.`
                );
            }
        },
        [
            mode,
            images.length,
            isEditMode,
            productId,
            isCreateMode,
            handleUpdateInfo,
            handleUpdateImages,
            handleUpdateVariants,
            handleCreate,
            handleOpenChange,
        ]
    );

    const handleAddImages = useCallback((files: FileList | null) => {
        if (!files) return;
        setImages((prev) => [...prev, ...Array.from(files)]);
    }, []);

    const handleRemoveImage = useCallback((index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const isLoading = useMemo(() => {
        if (isCreateMode) return createProductMutation.isPending;

        const mutationMap: Record<FormMode, boolean> = {
            info: updateProductMutation.isPending,
            images: updateImagesMutation.isPending,
            variants: updateVariantsMutation.isPending,
            create: false,
        };

        return mutationMap[mode] || false;
    }, [
        isCreateMode,
        mode,
        createProductMutation.isPending,
        updateProductMutation.isPending,
        updateImagesMutation.isPending,
        updateVariantsMutation.isPending,
    ]);

    const dialogTitle = DIALOG_TITLES[mode] || DIALOG_TITLES.create;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            {open && (
                <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                    </DialogHeader>

                    {isEditMode && !productProp ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-gray-500">Loading product data...</div>
                        </div>
                    ) : (
                        <ProductFormContent
                            mode={mode}
                            productProp={productProp}
                            isEditMode={isEditMode}
                            categories={categories}
                            brands={brands}
                            images={images}
                            isLoading={isLoading}
                            onAddImages={handleAddImages}
                            onRemoveImage={handleRemoveImage}
                            onSubmit={handleSubmit}
                            onCancel={() => handleOpenChange(false)}
                        />
                    )}
                </DialogContent>
            )}
        </Dialog>
    );
};
