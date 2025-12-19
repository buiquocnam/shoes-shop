import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CartContent } from '@/features/cart/components/CartContent';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
    title: 'Giỏ hàng - Cửa hàng giày',
    description: 'Xem lại các sản phẩm trong giỏ hàng và tiến hành thanh toán',
};

export default function CartPage() {
    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-4">
                                <Spinner className="h-8 w-8 text-primary" />
                                <p className="text-muted-foreground">Đang tải giỏ hàng...</p>
                            </div>
                        </div>
                    }
                >
                    <CartContent />
                </Suspense>
            </div>
        </div>
    );
}    