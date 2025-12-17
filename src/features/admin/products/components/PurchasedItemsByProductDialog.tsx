"use client";

import { usePurchasedItemsByProduct } from "../hooks/queries/usePurchasedItemsByProduct";
import { PurchasedItemsDialog } from "@/features/admin/components";

interface PurchasedItemsByProductDialogProps {
    productId: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function PurchasedItemsByProductDialog({
    productId,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
}: PurchasedItemsByProductDialogProps) {
    const { data: purchasedItems, isLoading } = usePurchasedItemsByProduct(
        controlledOpen ? productId : null
    );

    return (
        <PurchasedItemsDialog
            purchasedItems={purchasedItems}
            isLoading={isLoading}
            showUserId={true}
            open={controlledOpen}
            onOpenChange={controlledOnOpenChange}
        />
    );
}
