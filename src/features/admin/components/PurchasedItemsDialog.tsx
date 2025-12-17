"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { PurchasedItem } from "@/features/profile/types";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { OrderDetailDialog } from "./OrderDetailDialog";

interface PurchasedItemsDialogProps {
    purchasedItems: PurchasedItem[] | undefined;
    isLoading: boolean;
    showUserId?: boolean;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function PurchasedItemsDialog({
    purchasedItems,
    isLoading,
    showUserId = false,
    trigger,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
}: PurchasedItemsDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = controlledOnOpenChange || setInternalOpen;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        View Purchases
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Purchased Items</DialogTitle>
                    <DialogDescription>
                        List of purchased items
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-lg">
                                <Skeleton className="h-20 w-20 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !purchasedItems || purchasedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">
                            No purchases found
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            No purchases available
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {purchasedItems.map((item, index) => (
                            <PurchasedItemCard
                                key={index}
                                item={item}
                                showUserId={showUserId}
                            />
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function PurchasedItemCard({
    item,
    showUserId,
}: {
    item: PurchasedItem;
    showUserId?: boolean;
}) {
    const product = item.product;
    const variant = item.variant;
    const imageUrl = product.imageUrl?.url || "";
    const [showOrderDetail, setShowOrderDetail] = useState(false);

    return (
        <>
            <div
                className="flex gap-4 p-4 rounded-lg hover:border-primary/50 border border-border transition-colors cursor-pointer"
                onClick={() => setShowOrderDetail(true)}
            >
                {/* Product Image */}
                <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No Image
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                                {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                    {variant.color}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    Size: {variant.size}
                                </Badge>
                                {showUserId ? (
                                    <Badge variant="secondary" className="text-xs">
                                        User ID: {item.userId.slice(0, 8)}
                                    </Badge>
                                ) : (
                                    product.brand && (
                                        <Badge variant="secondary" className="text-xs">
                                            {product.brand.name}
                                        </Badge>
                                    )
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>Quantity: {item.countBuy}</span>
                                <span>•</span>
                                <span className="font-semibold text-foreground">
                                    {formatCurrency(item.totalMoney)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OrderDetailDialog
                item={item}
                open={showOrderDetail}
                onOpenChange={setShowOrderDetail}
                showUserId={showUserId}
            />
        </>
    );
}


