"use client";

import { useState } from "react";
import { ProductFormDialog } from "./ProductFormDialog";
import { FormMode } from "../../utils/productFormHelpers";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface ProductFormProps {
    productId?: string;
    trigger?: React.ReactNode;
    mode: FormMode;
}


export const ProductForm: React.FC<ProductFormProps> = ({
    productId,
    trigger,
    mode,
}) => {

    return (
        <ProductFormDialog
            productId={productId}
            trigger={trigger}
            mode={mode}
        />
    );
};

