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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-[300px] font-semibold">Product</TableHead>
                        <TableHead className="text-center font-semibold">Price</TableHead>
                        <TableHead className="text-center font-semibold">Quantity</TableHead>
                        <TableHead className="text-right font-semibold">Subtotal</TableHead>
                        <TableHead className="text-right w-[80px] font-semibold">Action</TableHead>
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



