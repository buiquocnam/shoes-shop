import { CartResponse, CartType } from '@/features/cart/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useCheckoutStore } from '@/store';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CheckoutItem } from '@/features/checkout';
import { useTranslations } from 'next-intl';

interface CartSummaryProps {
    cart: CartResponse;
    selectedItems: CartType[];
}

export function CartSummary({ cart, selectedItems }: CartSummaryProps) {
    const t = useTranslations('Cart');
    const router = useRouter();
    const setCheckout = useCheckoutStore((state) => state.setCheckout);

    // Calculate totals only for selected items
    const originalTotal = selectedItems.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);

    const discountedTotal = selectedItems.reduce((sum, item) => {
        const discountPercent = item.product.discount || 0;
        const discountedPrice = item.product.price - (item.product.price * discountPercent) / 100;
        return sum + (discountedPrice * item.quantity);
    }, 0);

    const totalDiscount = originalTotal - discountedTotal;

    const handleCheckout = () => {
        if (selectedItems.length === 0) return;

        const checkoutItems: CheckoutItem[] = selectedItems.map((item) => {
            const discountPercent = item.product.discount || 0;
            const discountedPrice = item.product.price - (item.product.price * discountPercent) / 100;
            const totalPrice = discountedPrice * item.quantity;

            return {
                cartItemId: item.id,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    discount: discountPercent,
                    imageUrl: item.product.imageUrl?.url || null,
                },
                variant: {
                    id: item.variant.id,
                    color: item.variant.color,
                },
                size: {
                    id: item.variant.id,
                    size: item.variant.sizeLabel,
                },
                quantity: item.quantity,
                totalPrice: totalPrice,
            };
        });

        setCheckout(checkoutItems, 'cart');
        router.push('/checkout');
    };

    return (
        <div className="sticky top-24 rounded-3xl bg-card border border-border p-6 md:p-8 shadow-xl shadow-foreground/5 dark:shadow-none">
            <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide border-b border-border pb-4">
                {t('summary')}
            </h2>
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-muted-foreground">
                    <span className="text-sm font-medium">{t('subtotal')}</span>
                    <span className="font-bold text-foreground">
                        {formatCurrency(originalTotal)}
                    </span>
                </div>
                {totalDiscount > 0 && (
                    <div className="flex justify-between items-center text-muted-foreground transition-all animate-in fade-in slide-in-from-top-1">
                        <span className="text-sm font-medium">{t('discount')}</span>
                        <span className="font-bold text-destructive">
                            -{formatCurrency(totalDiscount)}
                        </span>
                    </div>
                )}
            </div>
            <div className="border-t border-border pt-6 mb-8">
                <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-foreground">
                        {t('total')}
                    </span>
                    <div className="text-right">
                        <span className="text-3xl font-black text-primary block leading-none">
                            {formatCurrency(discountedTotal)}
                        </span>
                        {selectedItems.length > 0 && (
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 block">
                                Đã chọn {selectedItems.length} sản phẩm
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <Button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                disabled={selectedItems.length === 0}
            >
                {t('checkout')}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link
                href="/products"
                className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary font-bold text-sm transition-colors mt-6 group"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                {t('continueShopping')}
            </Link>
        </div>
    );
}
