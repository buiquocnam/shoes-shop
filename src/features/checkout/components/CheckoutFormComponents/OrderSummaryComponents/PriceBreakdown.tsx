import { formatCurrency } from '@/utils/format';

interface PriceSummary {
    subtotal: number;
    shipping: number;
    discount: number;
    discountCode?: string;
}

interface PriceBreakdownProps {
    priceSummary: PriceSummary;
}

export function PriceBreakdown({ priceSummary }: PriceBreakdownProps) {
    const { subtotal, shipping, discount, discountCode } = priceSummary;
    return (
        <div className="flex flex-col gap-3 border-t pt-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Tạm tính</p>
                <p className="font-medium">{formatCurrency(subtotal)}</p>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Phí vận chuyển</p>
                <p className="font-medium">{formatCurrency(shipping)}</p>
            </div>
            {discount > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Giảm giá {discountCode && `(${discountCode})`}
                    </p>
                    <p className="font-medium text-green-600 dark:text-green-400">
                        -{formatCurrency(discount)}
                    </p>
                </div>
            )}
        </div>
    );
}

