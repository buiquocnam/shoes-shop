'use client';

import { CartType } from '@/features/cart/types';
import { CartItem } from './CartItem';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CartListProps {
    items: CartType[];
}

export function CartList({ items }: CartListProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Product</TableHead>
                        <TableHead className="text-center">Price</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-right w-[80px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="[&_tr:not(:last-child)]:border-b [&_tr]:border-gray-200">
                    {items.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}



