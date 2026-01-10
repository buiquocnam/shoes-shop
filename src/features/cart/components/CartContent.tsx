'use client';

import { CartList } from './CartList';
import { CartSummary } from './CartSummary';
import { CartEmpty } from './CartEmpty';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { useMemo } from 'react';
import { useCartStore } from '@/store/useCartStore';

export function CartContent() {
    const { cart, isLoading } = useCart();
    const { mutate: updateItem } = useUpdateCartItem();
    const { mutate: removeItem } = useRemoveCartItem();

    // Use Zustand store for persistent selection
    const {
        selectedItemIds,
        toggleSelectItem,
        setSelectedItems,
        clearSelection
    } = useCartStore();

    const allItemIds = useMemo(() => cart?.items.map(item => item.id) || [], [cart?.items]);
    const isAllSelected = selectedItemIds.length > 0 &&
        allItemIds.length > 0 &&
        allItemIds.every(id => selectedItemIds.includes(id));

    const handleUpdateQuantity = (id: string, size: number, delta: number) => {
        const item = cart?.items.find(i => i.id === id);
        if (!item) return;
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1 || newQuantity > item.variant.stock) return;
        updateItem({ itemId: id, quantity: newQuantity });
    };

    const handleRemove = (id: string) => {
        removeItem(id);
        // If the removed item was selected, we should remove it from selection
        if (selectedItemIds.includes(id)) {
            toggleSelectItem(id);
        }
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            setSelectedItems(allItemIds);
        }
    };

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

    const selectedItems = cart.items.filter(item => selectedItemIds.includes(item.id));

    return (
        <div className="flex-1 w-full px-4 md:px-10 py-8 md:py-12">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <span className="h-8 w-1.5 bg-primary rounded-full"></span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase tracking-tight italic">
                            Giỏ Hàng <span className="text-primary">Của Bạn</span>
                        </h1>
                        <span className="bg-muted text-muted-foreground text-sm font-bold px-3 py-1 rounded-full ml-2">
                            {cart.items.length} Sản phẩm
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl shadow-sm">
                        <Checkbox
                            id="select-all"
                            checked={isAllSelected}
                            onCheckedChange={toggleSelectAll}
                        />
                        <label
                            htmlFor="select-all"
                            className="text-sm font-bold text-foreground cursor-pointer select-none"
                        >
                            Chọn tất cả ({selectedItemIds.length})
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-8">
                        <CartList
                            items={cart.items}
                            updateQuantity={handleUpdateQuantity}
                            remove={handleRemove}
                            selectedIds={selectedItemIds}
                            toggleSelection={toggleSelectItem}
                        />
                    </div>
                    <div className="lg:col-span-4">
                        <CartSummary
                            cart={cart}
                            selectedItems={selectedItems}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

