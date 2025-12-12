"use client";

import { useMemo, useEffect } from "react";
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
} from "../../schema";
import { ProductBasicInfoSection } from "../sections/ProductBasicInfoSection";
import { ProductVariantsSection } from "../sections/ProductVariantsSection";
import { ProductMediaSection } from "../sections/ProductMediaSection";
import { ProductDetailType, CategoryType, BrandType } from "@/features/product/types";
import {
    transformVariantsToForm,
    getDefaultFormValues,
} from "../../utils/productFormHelpers";
import { FormMode } from "../../utils/productFormHelpers";
import { Spinner } from "@/components/ui/spinner";
import { useProductFormData, useProduct } from "../../hooks";

const SCHEMA_MAP = {
    create: productCreateSchema,
    info: productInfoSchema,
    images: productImagesSchema,
    variants: productVariantsSchema,
} as const;

interface ProductFormContentProps {
    mode: FormMode;
    productId?: string;
    images: File[];
    isLoading: boolean;
    onAddImages: (files: FileList | null) => void;
    onRemoveImage: (index: number) => void;
    onSubmit: (data: ProductFormValues) => void;
    onCancel: () => void;
}

/**
 * ProductFormContent - Component render form content
 * Tách biệt logic form khỏi dialog wrapper
 */
export const ProductFormContent: React.FC<ProductFormContentProps> = ({
    mode,
    productId,
    images,
    isLoading,
    onAddImages,
    onRemoveImage,
    onSubmit,
    onCancel,
}) => {
    const { data, isLoading: isLoadingProduct } = useProduct(productId || "");
    const { categories, brands } = useProductFormData(true);


    const productDetail = data?.product;
    const listImg = data?.listImg;
    const variants = data?.variants;
    // Tính toán defaultValues trước khi khởi tạo form
    const defaultValues = useMemo((): ProductFormValues => {
        if (productDetail) {
            return {
                name: productDetail.name || "",
                description: productDetail.description || "",
                category: productDetail.category?.id || "",
                brand: productDetail.brand?.id || "",
                price: productDetail.price || 0,
                discount: productDetail.discount ?? 0,
                image: undefined,
                variants: transformVariantsToForm(variants || []),
            };
        }

        if (mode === FormMode.create && categories.length > 0 && brands.length > 0) {
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
    }, [productDetail, mode, categories.length, brands.length]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(SCHEMA_MAP[mode]),
        defaultValues,
    });

    // Reset form khi productProp thay đổi từ undefined → có giá trị
    useEffect(() => {
        if (productDetail) {
            form.reset({
                name: productDetail.name || "",
                description: productDetail.description || "",
                category: productDetail.category?.id || "",
                brand: productDetail.brand?.id || "",
                price: productDetail.price || 0,
                discount: productDetail.discount ?? 0,
                image: undefined,
                variants: transformVariantsToForm(variants || []),
            });
        }
    }, [productDetail, variants, form]);

    const renderFormContent = () => {
        if (mode === FormMode.info) {
            return (
                <ProductBasicInfoSection
                    control={form.control}
                    categories={categories}
                    brands={brands}
                />
            );
        }

        if (mode === FormMode.variants) {
            return (
                <ProductVariantsSection control={form.control} />
            );
        }

        if (mode === FormMode.images) {
            return (
                <ProductMediaSection
                    control={form.control}
                    images={images}
                    existingImages={listImg || []}
                    onAddImages={onAddImages}
                    onRemoveImage={onRemoveImage}
                    onRemoveExistingImage={undefined}
                />
            );
        }

        // Mode "create" - hiển thị tất cả 3 sections
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6 col-span-2">
                    <ProductBasicInfoSection
                        control={form.control}
                        categories={categories}
                        brands={brands}
                    />
                    <ProductVariantsSection control={form.control} />
                </div>
                <div className="space-y-6">
                    <ProductMediaSection
                        control={form.control}
                        images={images}
                        existingImages={listImg || []}
                        onAddImages={onAddImages}
                        onRemoveImage={onRemoveImage}
                        onRemoveExistingImage={undefined}
                    />
                </div>
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
                        {isLoading ? <Spinner /> : "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

