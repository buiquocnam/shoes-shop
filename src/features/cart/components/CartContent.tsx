'use client';

import { CartList } from './CartList';
import { CartSummary } from './CartSummary';
import { CartEmpty } from './CartEmpty';
import { useCartStore } from '@/store/useCartStore';
import { Spinner } from '@/components/ui/spinner';
import { useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';

export function CartContent() {
    const cart = useCartStore((state) => state.cart);
    const isLoading = useCartStore((state) => state.isLoading);
    const { mutate: updateItem } = useUpdateCartItem();
    const { mutate: removeItem } = useRemoveCartItem();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-8 w-8 text-primary" />
                    <p className="text-muted-foreground">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return <CartEmpty />;
    }

    const handleUpdateQuantity = (id: string, size: number, delta: number) => {
        const item = cart.items.find(i => i.id === id);
        if (!item) return;
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1 || newQuantity > item.variant.stock) return;
        updateItem({ itemId: id, quantity: newQuantity });
    };

    const handleRemove = (id: string) => {
        removeItem(id);
    };

    return (
        <div className="flex-1 w-full px-4 md:px-10 py-8 md:py-12">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex items-center gap-2 mb-8">
                    <span className="h-8 w-1.5 bg-primary rounded-full"></span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight italic">
                        Giỏ Hàng <span className="text-primary">Của Bạn</span>
                    </h1>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold px-3 py-1 rounded-full ml-2">
                        {cart.count} Sản phẩm
                    </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-8">
                        <CartList 
                            items={cart.items} 
                            updateQuantity={handleUpdateQuantity}
                            remove={handleRemove}
                        />
                    </div>
                    <div className="lg:col-span-4">
                        <CartSummary cart={cart} />
                    </div>
                </div>
            </div>
        </div>
    );
}

