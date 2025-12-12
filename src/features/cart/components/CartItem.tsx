'use client';

import { CartType } from '@/features/cart/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/ui/table';
import { useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';

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
        <TableRow className="hover:bg-gray-50 transition-colors">
            <TableCell className="py-6">
                <div className="flex items-center gap-4">
                    <div
                        className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0 border border-gray-200 hover:border-primary transition-colors"
                        onClick={handleProductClick}
                    >
                        <Image
                            src={item.product.imageUrl?.url || '/images/no-image.png'}
                            alt={item.product.name}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-2"
                            onClick={handleProductClick}
                        >
                            {item.product.name}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>
                                Color:{' '}
                                <span className="font-medium text-gray-900">
                                    {item.variant.color}
                                </span>
                            </p>
                            <p>
                                Size:{' '}
                                <span className="font-medium text-gray-900">
                                    {item.variant.sizeLabel}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell className="text-center py-6">
                <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold text-gray-900">{formatCurrency(discountedPrice)}</span>
                    <div className="flex items-center gap-2">
                        {item.product.discount > 0 && (
                            <>
                                <span className="text-xs line-through text-gray-400">
                                    {formatCurrency(item.product.price)}
                                </span>
                                <span className="text-xs text-red-600 font-semibold inline-block bg-red-50 px-2 py-0.5 rounded ml-1">
                                    -{item.product.discount}%
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </TableCell>

            <TableCell className="text-center py-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1 border border-gray-300 rounded-lg bg-white">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="h-9 w-9 rounded-r-none hover:bg-gray-100"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold text-sm text-gray-900">
                            {item.quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={isUpdating || item.quantity >= item.variant.stock}
                            className="h-9 w-9 rounded-l-none hover:bg-gray-100"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {item.quantity >= item.variant.stock && (
                        <p className="text-xs text-red-600 font-medium">Max stock</p>
                    )}
                </div>
            </TableCell>

            <TableCell className="text-right py-6">
                <span className="font-bold text-lg text-gray-900">
                    {formatCurrency(itemTotal)}
                </span>
            </TableCell>

            <TableCell className="text-right py-6">
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleRemove}
                    disabled={isRemoving}
                    className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    title="Remove item"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}

