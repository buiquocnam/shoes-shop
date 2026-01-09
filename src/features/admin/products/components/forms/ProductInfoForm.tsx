"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
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

    }, [data?.product]);

    const form = useForm<InfoFormValues>({
        resolver: zodResolver(productInfoSchema),
        defaultValues,
    });

    useEffect(() => {
        if (data?.product && !loadingProduct) {
            form.reset(defaultValues);
        }
    }, [data?.product, loadingProduct, defaultValues, form]);

    const onSubmit = async (data: InfoFormValues) => {
        const input: ProductContentInput = {
            ...data,
            productId,
            slug: generateSlug(data.name),
        };

        await updateProductInfo.mutateAsync(input);
        onSuccess();
    };

    if (loadingProduct || !data?.product) {
        return (
            <div className="p-6 flex justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <form key={productId} onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-10">
                <ProductBasicInfoSection
                    register={form.register}
                    control={form.control}
                    errors={form.formState.errors}
                    categories={categories}
                    brands={brands}
                />

                <div className="flex items-center justify-end gap-x-6">
                    <Button
                        variant="ghost"
                        type="button"
                        disabled={updateProductInfo.isPending}
                        onClick={onCancel}
                        className="font-semibold text-muted-foreground hover:text-foreground"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="submit"
                        disabled={updateProductInfo.isPending}
                        className="px-10 py-3.5 font-bold shadow-lg"
                    >
                        {updateProductInfo.isPending ? <Spinner className="h-4 w-4" /> : "Lưu thay đổi"}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
};
