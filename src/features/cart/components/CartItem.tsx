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

    const discountedPrice = item.product.price - (item.product.price * (item.product.discount || 0)) / 100;
    const itemTotal = discountedPrice * item.quantity;


    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > item.variant.stock) return;
        if (newQuantity === item.quantity) return;

        updateItem({ itemId: item.id, quantity: newQuantity });
    };

    const handleRemove = async () => {
        removeItem( item.id );
    };

    const handleProductClick = () => {
        router.push(`/products/${item.product.id}`);
    };

    return (
        <TableRow className='py-4'>
            <TableCell className="py-6">
                <div className="flex items-center gap-4">
                    <div
                        className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0"
                        onClick={handleProductClick}
                    >
                        <Image
                            src={item.product.imageUrl?.url || '/images/no-image.png'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                            onClick={handleProductClick}
                        >
                            {item.product.name}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-0.5">
                            <p>Color: <span className="font-medium">{item.variant.color}</span></p>
                            <p>Size: <span className="font-medium">{ item.variant.sizeLabel}</span></p>
                            {item.product.discount > 0 && (
                                <p className="text-xs text-red-600 font-semibold">
                                    -{item.product.discount}% OFF
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell className="text-center py-6">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-900">
                        {formatCurrency(discountedPrice)}
                    </span>
                    {item.product.discount > 0 && (
                        <span className="text-xs line-through text-gray-400 mt-1">
                            {formatCurrency(item.product.price)}
                        </span>
                    )}
                </div>
            </TableCell>

            <TableCell className="text-center py-6">
                <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="h-8 w-8 rounded-r-none"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-medium text-sm">
                            {item.quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={isUpdating || item.quantity >= item.variant.stock}
                            className="h-8 w-8 rounded-l-none"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {item.quantity >= item.variant.stock && (
                        <p className="text-xs text-red-600 mt-1">Max stock</p>
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
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Remove item"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}



