"use client";

import { useState } from "react";
import { usePurchasedItemsByProduct } from "../hooks/queries/usePurchasedItemsByProduct";
import { PurchasedItemsDialog } from "@/features/admin/components";

interface PurchasedItemsByProductDialogProps {
    productId: string;
}

export function PurchasedItemsByProductDialog({
    productId,
}: PurchasedItemsByProductDialogProps) {
    const [open, setOpen] = useState(false);
    const { data: purchasedItems, isLoading } = usePurchasedItemsByProduct(
        open ? productId : null
    );

    return (
        <PurchasedItemsDialog
            purchasedItems={purchasedItems}
            isLoading={isLoading}
            showUserId={true}
            open={open}
            onOpenChange={setOpen}
        />
    );
}
