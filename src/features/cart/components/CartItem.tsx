'use client';

import { CartType } from '@/features/cart/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/ui/table';
import { useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface CartItemProps {
    item: CartType;
}

export function CartItem({ item }: CartItemProps) {
    const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
    const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();
    const router = useRouter();

    const discountedPrice =
        item.product.price - (item.product.price * (item.product.discount || 0)) / 100;
    const itemTotal = discountedPrice * item.quantity;

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > item.variant.stock) return;
        if (newQuantity === item.quantity) return;

        updateItem({ itemId: item.id, quantity: newQuantity });
    };

    const handleRemove = async () => {
        removeItem(item.id);
    };

    const handleProductClick = () => {
        router.push(`/products/${item.product.id}`);
    };

    return (
        <TableRow className="hover:bg-muted/50 transition-colors">
            <TableCell className="py-6">
                <div className="flex items-center gap-4">
                    <div
                        className="relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border bg-muted transition-colors hover:border-primary"
                        onClick={handleProductClick}
                    >
                        <Image
                            src={item.product.imageUrl?.url || '/images/no-image.png'}
                            alt={item.product.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="96px"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3
                            className="mb-2 line-clamp-2 cursor-pointer font-semibold transition-colors hover:text-primary"
                            onClick={handleProductClick}
                        >
                            {item.product.name}
                        </h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                                Color: <span className="font-medium text-foreground">{item.variant.color}</span>
                            </p>
                            <p>
                                Size: <span className="font-medium text-foreground">{item.variant.sizeLabel}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell className="text-center py-6">
                <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold">{formatCurrency(discountedPrice)}</span>
                    {item.product.discount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground line-through">
                                {formatCurrency(item.product.price)}
                            </span>
                            <Badge variant="default" className="text-xs">
                                -{item.product.discount}%
                            </Badge>
                        </div>
                    )}
                </div>
            </TableCell>

            <TableCell className="text-center py-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1 rounded-lg border border-border bg-background">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="h-9 w-9 rounded-r-none"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(Number(e.target.value))}
                            className="w-10 h-full text-center border-none shadow-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                            min={1}
                            max={item.variant.stock}
                            />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={isUpdating || item.quantity >= item.variant.stock}
                            className="h-9 w-9 rounded-l-none"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {item.quantity >= item.variant.stock && (
                        <p className="text-xs font-medium text-destructive">Max stock</p>
                    )}
                </div>
            </TableCell>

            <TableCell className="text-right py-6">
                <span className="text-lg font-bold">{formatCurrency(itemTotal)}</span>
            </TableCell>

            <TableCell className="text-right py-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    disabled={isRemoving}
                    className="h-9 w-9 hover:text-primary hover:bg-primary/10"
                    title="Remove item"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}

