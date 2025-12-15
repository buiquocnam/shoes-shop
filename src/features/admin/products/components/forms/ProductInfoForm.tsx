"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { productInfoSchema, InfoFormValues, ProductContentInput } from "../../schemas";
import { ProductBasicInfoSection } from "../sections/ProductBasicInfoSection";
import { Spinner } from "@/components/ui/spinner";
import { useProduct, useProductFormData } from "../../hooks";
import { useUpdateProductInfo } from "../../hooks/mutations/useUpdateProductInfo";
import { generateSlug } from "../../utils/productFormHelpers";

interface ProductInfoFormProps {
    productId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

/**
 * Form riêng cho product info
 * Tự quản lý useForm, defaultValues, submit logic
 */
export const ProductInfoForm: React.FC<ProductInfoFormProps> = ({
    productId,
    onSuccess,
    onCancel,
}) => {
    const { data, isLoading: loadingProduct } = useProduct(productId);
    const { categories, brands } = useProductFormData(true);
    const updateProductInfo = useUpdateProductInfo();

    const defaultValues = useMemo<InfoFormValues>(() => {
        if (!data?.product) {
            return {
                name: "",
                description: "",
                categoryId: "",
                brandId: "",
                price: 0,
                discount: 0,
            };
        }

        const product = data.product;
        return {
            name: product.name ?? "",
            description: product.description ?? "",
            categoryId: product.category?.id ?? "",
            brandId: product.brand?.id ?? "",
            price: product.price ?? 0,
            discount: product.discount ?? 0,
        };
    }, [data]);

    const form = useForm<InfoFormValues>({
        resolver: zodResolver(productInfoSchema),
        defaultValues,
    });

    const onSubmit = async (data: InfoFormValues) => {
        const input: ProductContentInput = {
            ...data,
            productId,
            slug: generateSlug(data.name),
        };

        await updateProductInfo.mutateAsync(input);
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
            <ProductBasicInfoSection
                control={form.control}
                categories={categories}
                brands={brands}
            />

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
                <Button
                    variant="outline"
                    type="button"
                    disabled={updateProductInfo.isPending}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={updateProductInfo.isPending}>
                    {updateProductInfo.isPending ? <Spinner /> : "Save"}
                </Button>
            </div>
        </form>
    );
};



