"use client";

import { useCallback, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DIALOG_TITLES } from "../../utils/productFormHelpers";
import { ProductFormContent } from "./ProductFormContent";
import { useProductFormData, useProduct, useProductForm, useProductImages } from "../../hooks";
import { cn } from "@/utils";
import { FormMode } from "../../utils/productFormHelpers";
import { Spinner } from "@/components/ui/spinner";

interface ProductFormDialogProps {
    productId?: string;
    trigger?: React.ReactNode;
    mode: FormMode;
}

/**
 * ProductFormDialog - Component Dialog riêng
 * Chỉ render và gọi API khi dialog mở để tối ưu performance
 */
export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
    productId,
    trigger,
    mode,
}) => {
    const [open, setOpen] = useState(false);
    const isEditMode = !!productId;


    const { images, handleAddImages, handleRemoveImage, resetImages } = useProductImages();

    // Form handler với mutations
    const { handleSubmit, isLoading } = useProductForm({
        productId: productId || "",
        images,
        mode,
    });

    // Wrapper để đóng dialog sau khi submit thành công
    const handleFormSubmit = async (data: any) => {

        await handleSubmit(data);
        setOpen(false);
    }

    const handleCancel = () => {
        resetImages();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent
                className={cn(
                    "max-h-[90vh] overflow-y-auto ",
                    mode === "create"
                        ? "sm:max-w-7xl"
                        : mode === "images"
                            ? "sm:max-w-6xl"
                            : "sm:max-w-3xl"
                )}
            >
                <DialogHeader>
                    <DialogTitle>{DIALOG_TITLES[mode]}</DialogTitle>
                </DialogHeader>


                {open && (
                    <>
                        {isEditMode && isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Spinner />
                            </div>
                        ) : (
                            <ProductFormContent
                                productId={productId || undefined}
                                mode={mode}
                                images={images}
                                isLoading={isLoading}
                                onAddImages={handleAddImages}
                                onRemoveImage={handleRemoveImage}
                                onSubmit={handleFormSubmit}
                                onCancel={handleCancel}
                            />
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

