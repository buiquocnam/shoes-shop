import Image from 'next/image';
import { formatCurrency } from '@/utils/format';
import { CheckoutItem } from '@/features/checkout/types';

interface OrderItemProps {
    item: CheckoutItem;
}

export function OrderItem({ item }: OrderItemProps) {
    console.log(item)
    return (
        <div className="flex items-start gap-4">
            <div className="relative aspect-square w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                <Image
                    src={item.product?.imageUrl || '/placeholder.png'}
                    alt={item.product?.name || 'Product'}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                />
            </div>
            <div className="flex-grow">
                <p className="font-semibold">{item.product?.name || 'Unknown Product'}</p>
                <p className="text-sm text-muted-foreground">
                    Size: {item.variant?.size || 'N/A'} - Color: {item.variant?.color || 'N/A'} - Số lượng: {item.variant?.quantity}
                </p>
            </div>
            <p className="font-semibold">{formatCurrency((item.product?.price || 0) * (item.variant?.quantity || 1))}</p>
        </div>
    );
}

