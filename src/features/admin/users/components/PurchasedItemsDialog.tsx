"use client";

import { useState } from "react";
import { usePurchasedItems } from "../hooks";
import { PurchasedItemsDialog as AdminPurchasedItemsDialog } from "@/features/admin/components";

interface PurchasedItemsDialogProps {
    userId: string;
    trigger?: React.ReactNode;
}

export function PurchasedItemsDialog({
    userId,
    trigger,
}: PurchasedItemsDialogProps) {
    const [open, setOpen] = useState(false);
    const { data: purchasedItems, isLoading } = usePurchasedItems(
        open ? userId : null
    );

    return (
        <AdminPurchasedItemsDialog
            purchasedItems={purchasedItems}
            isLoading={isLoading}
            showUserId={false}
            trigger={trigger}
            open={open}
            onOpenChange={setOpen}
        />
    );
}

