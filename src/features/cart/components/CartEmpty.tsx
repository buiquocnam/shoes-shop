'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export function CartEmpty() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center py-16 px-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <ShoppingCart className="h-24 w-24 text-muted-foreground mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy bắt đầu mua sắm để làm đầy giỏ hàng!
                    </p>
                    <Button onClick={() => router.push('/')} size="lg">
                        Tiếp tục mua sắm
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

































