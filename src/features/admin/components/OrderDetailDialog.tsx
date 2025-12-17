"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PurchasedItem } from "@/features/profile/types";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface OrderDetailDialogProps {
    item: PurchasedItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    showUserId?: boolean;
}

export function OrderDetailDialog({
    item,
    open,
    onOpenChange,
    showUserId,
}: OrderDetailDialogProps) {
    const product = item.product;
    const variant = item.variant;
    const imageUrl = product.imageUrl?.url || "";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Detailed information about this purchase
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Product Info */}
                    <div className="flex gap-4 p-4 border rounded-lg">
                        <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
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
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg text-foreground mb-2">
                                {product.name}
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Brand:</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {product.brand?.name || "N/A"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Category:</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {product.category?.name || "N/A"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Color:</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {variant.color}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Size:</span>
                                    <Badge variant="outline" className="text-xs">
                                        {variant.size}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-3 p-4 border rounded-lg">
                        <h5 className="font-semibold text-foreground mb-3">
                            Order Information
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                            {showUserId && (
                                <div className="col-span-2">
                                    <span className="text-sm text-muted-foreground">User ID:</span>
                                    <p className="font-semibold text-foreground font-mono text-xs">
                                        {item.userId}
                                    </p>
                                </div>
                            )}
                            <div>
                                <span className="text-sm text-muted-foreground">Quantity:</span>
                                <p className="font-semibold text-foreground">{item.countBuy}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Unit Price:</span>
                                <p className="font-semibold text-foreground">
                                    {formatCurrency(product.price)}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Discount:</span>
                                <p className="font-semibold text-foreground">
                                    {product.discount}%
                                </p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-sm text-muted-foreground">Total Amount:</span>
                                <p className="font-semibold text-lg text-primary">
                                    {formatCurrency(item.totalMoney)}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

