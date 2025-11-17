"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogClose } from "@/components/ui/dialog";
import {
    productCreateSchema,
    productInfoSchema,
    productImagesSchema,
    productVariantsSchema,
    ProductFormValues,
} from "../schema";
import { ProductBasicInfoSection } from "./ProductBasicInfoSection";
import { ProductVariantsSection } from "./ProductVariantsSection";
import { ProductMediaSection } from "./ProductMediaSection";
import { ProductDetailType, CategoryType, BrandType } from "@/features/product/types";
import {
    transformVariantsToForm,
    getDefaultFormValues,
} from "../utils/productFormHelpers";

type FormMode = "info" | "images" | "variants" | "create";

const SCHEMA_MAP = {
    create: productCreateSchema,
    info: productInfoSchema,
    images: productImagesSchema,
    variants: productVariantsSchema,
} as const;

interface ProductFormContentProps {
    mode: FormMode;
    productProp?: ProductDetailType;
    isEditMode: boolean;
    categories: CategoryType[];
    brands: BrandType[];
    images: File[];
    isLoading: boolean;
    onAddImages: (files: FileList | null) => void;
    onRemoveImage: (index: number) => void;
    onSubmit: (data: ProductFormValues) => void;
    onCancel: () => void;
}

export const ProductFormContent: React.FC<ProductFormContentProps> = ({
    mode,
    productProp,
    isEditMode,
    categories,
    brands,
    images,
    isLoading,
    onAddImages,
    onRemoveImage,
    onSubmit,
    onCancel,
}) => {
    // Tính toán defaultValues trước khi khởi tạo form
    const defaultValues = useMemo((): ProductFormValues => {
        if (productProp) {
            return {
                name: productProp.product.name || "",
                description: productProp.product.description || "",
                category: productProp.product.category?.id || "",
                brand: productProp.product.brand?.id || "",
                price: productProp.product.price || 0,
                discount: productProp.product.discount ?? 0,
                image: undefined,
                variants: transformVariantsToForm(productProp),
            };
        }

        if (mode === "create" && categories.length > 0 && brands.length > 0) {
            return getDefaultFormValues(categories, brands);
        }

        // Fallback
        return {
            name: "",
            description: "",
            category: "",
            brand: "",
            price: 0,
            discount: 0,
            image: undefined,
            variants: [],
        };
    }, [productProp, mode, categories.length, brands.length]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(SCHEMA_MAP[mode]),
        defaultValues,
    });

    const renderFormContent = () => {
        if (mode === "images") {
            return (
                <div className="w-full">
                    <ProductMediaSection
                        control={form.control}
                        images={images}
                        existingImages={productProp?.listImg || []}
                        onAddImages={onAddImages}
                        onRemoveImage={onRemoveImage}
                        onRemoveExistingImage={
                            isEditMode
                                ? (index) => {
                                    // TODO: Implement remove existing image API call
                                    console.log("Remove existing image at index:", index);
                                }
                                : undefined
                        }
                        isEditMode={isEditMode}
                    />
                </div>
            );
        }

        if (mode === "variants") {
            return (
                <div className="w-full max-w-4xl mx-auto">
                    <ProductVariantsSection control={form.control} />
                </div>
            );
        }

        if (mode === "info") {
            return (
                <div className="w-full max-w-3xl mx-auto">
                    <ProductBasicInfoSection
                        control={form.control}
                        categories={categories}
                        brands={brands}
                    />
                </div>
            );
        }

        // Create mode - full form
        const showBasicInfo = true;
        const showVariants = true;
        const showMedia = true;
        const showInfoSection = true;

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {showInfoSection && (
                    <div className="space-y-6 col-span-2">
                        {showBasicInfo && (
                            <ProductBasicInfoSection
                                control={form.control}
                                categories={categories}
                                brands={brands}
                            />
                        )}
                        {showVariants && (
                            <ProductVariantsSection control={form.control} />
                        )}
                    </div>
                )}

                {showMedia && (
                    <div className="space-y-6">
                        <ProductMediaSection
                            control={form.control}
                            images={images}
                            existingImages={productProp?.listImg || []}
                            onAddImages={onAddImages}
                            onRemoveImage={onRemoveImage}
                            onRemoveExistingImage={
                                isEditMode
                                    ? (index) => {
                                        // TODO: Implement remove existing image API call
                                        console.log("Remove existing image at index:", index);
                                    }
                                    : undefined
                            }
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {renderFormContent()}

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading
                            ? isEditMode
                                ? "Updating..."
                                : "Creating..."
                            : isEditMode
                                ? "Update"
                                : "Save Product"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

