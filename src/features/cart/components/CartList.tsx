'use client';

import { CartType } from '@/features/cart/types';
import { CartItem } from './CartItem';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CartListProps {
    items: CartType[];
}

export function CartList({ items }: CartListProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Sản phẩm</TableHead>
                            <TableHead className="text-center">Giá</TableHead>
                            <TableHead className="text-center">Số lượng</TableHead>
                            <TableHead className="text-right">Tổng tiền</TableHead>
                            <TableHead className="text-right w-[80px]">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}



