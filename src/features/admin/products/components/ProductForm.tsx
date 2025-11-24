"use client";

import { useState, useCallback, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DIALOG_TITLES } from "../utils/productFormHelpers";
import { ProductFormContent } from "./ProductFormContent";
import {
    useProductFormData,
    useProductImages,
    useProductCreateForm,
    useProductEditInfoForm,
    useProductEditImagesForm,
    useProductEditVariantsForm,
    useProduct,
} from "../hooks";
import { ProductFormValues } from "../schema";
import { cn } from "@/utils";
import { FormMode } from "../utils/productFormHelpers";
import { Spinner } from "@/components/ui/spinner";

interface ProductFormProps {
    productId?: string;
    trigger?: React.ReactNode;
    mode: FormMode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    productId,
    trigger,
    mode,
    open: openProp,
    onOpenChange,
}) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isEditMode = !!productId;

    const dialogTitle = DIALOG_TITLES[mode];
    const open = openProp !== undefined ? openProp : internalOpen;

    const { data: productDetail, isLoading: isLoadingProduct } = useProduct(
        open && isEditMode && productId ? productId : ""
    );

    const { categories, brands } = useProductFormData();
    const { images, handleAddImages, handleRemoveImage, resetImages } =
        useProductImages();

    // Reset images when dialog closes
    useEffect(() => {
        if (!open) {
            resetImages();
        }
    }, [open, resetImages]);

    // Call all hooks unconditionally (React Rules of Hooks)
    const createForm = useProductCreateForm(images);
    const editInfoForm = useProductEditInfoForm(productId || "");
    const editImagesForm = useProductEditImagesForm(productId || "", images);
    const editVariantsForm = useProductEditVariantsForm(productId || "");

    // Select the appropriate handler based on mode
    const getFormHandler = () => {
        if (mode === "create") return createForm;
        if (mode === "info") return editInfoForm;
        if (mode === "images") return editImagesForm;
        return editVariantsForm;
    };

    const { handleSubmit: hookHandleSubmit, isLoading } = getFormHandler();


    // Wrapper để đóng dialog sau khi submit thành công
    const handleFormSubmit = useCallback(
        async (data: ProductFormValues) => {
            try {
                await hookHandleSubmit(data);

                // Đóng dialog sau khi submit thành công
                if (openProp === undefined) {
                    setInternalOpen(false);
                }
                onOpenChange?.(false);
            } catch (error) {
                // Error đã được handle trong hooks, dialog vẫn mở để user thấy lỗi
            }
        },
        [hookHandleSubmit, openProp, onOpenChange]
    );


    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                if (openProp === undefined) {
                    setInternalOpen(newOpen);
                }
                onOpenChange?.(newOpen);
            }}
        >
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            {open && (
                <DialogContent
                    className={cn(
                        "max-h-[90vh] overflow-y-auto",
                        mode === "create"
                            ? "sm:max-w-7xl"
                            : mode === "images"
                                ? "sm:max-w-6xl"
                                : "sm:max-w-3xl"
                    )}
                >
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                    </DialogHeader>

                    {isEditMode && isLoadingProduct ? (
                        <div className="flex items-center justify-center py-8">
                            <Spinner />
                        </div>
                    ) : (
                        <ProductFormContent
                            mode={mode}
                            productProp={productDetail}
                            categories={categories}
                            brands={brands}
                            images={images}
                            isLoading={isLoading}
                            onAddImages={handleAddImages}
                            onRemoveImage={handleRemoveImage}
                            onSubmit={handleFormSubmit}
                            onCancel={() => {
                                if (openProp === undefined) {
                                    setInternalOpen(false);
                                }
                                onOpenChange?.(false);
                            }}
                        />
                    )}
                </DialogContent>
            )}
        </Dialog>
    );
};
