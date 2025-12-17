import Image from 'next/image';
import { formatCurrency } from '@/utils/format';
import { CheckoutItem } from '@/features/checkout/types/checkout';
import { Badge } from '@/components/ui/badge';

interface OrderRowProps {
    item: CheckoutItem;
}

export function OrderRow({ item }: OrderRowProps) {
    const unitPrice = item.product.price - (item.product.price * item.product.discount) / 100;
    const originalTotal = item.product.price * item.quantity;

    return (
        <div className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50">
            <div className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <Image
                    src={item.product.imageUrl || '/images/no-image.png'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="80px"
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">
                        {item.product.name}
                    </h3>
                    {item.product.discount > 0 && (
                        <Badge variant="destructive" className="shrink-0 text-xs">
                            -{item.product.discount}%
                        </Badge>
                    )}
                </div>
                <div className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                    <p>
                        <span className="font-medium">Size:</span> {item.size.size} •{' '}
                        <span className="font-medium">Màu:</span>{' '}
                        <span
                            className="mr-1 inline-block h-3 w-3 rounded-full border border-border align-middle"
                            style={{ backgroundColor: item.variant.color }}
                        />
                        {item.variant.color}
                    </p>
                    <p>
                        <span className="font-medium">Số lượng:</span> {item.quantity}
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
                <p className="text-base font-bold sm:text-lg">{formatCurrency(item.totalPrice)}</p>
                {item.product.discount > 0 && (
                    <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(originalTotal)}
                    </p>
                )}
                {item.quantity > 1 && (
                    <p className="text-xs text-muted-foreground">
                        {formatCurrency(unitPrice)} × {item.quantity}
                    </p>
                )}
            </div>
        </div>
    );
}

