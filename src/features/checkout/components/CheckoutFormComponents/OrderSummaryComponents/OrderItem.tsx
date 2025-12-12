import Image from 'next/image';
import { formatCurrency } from '@/utils/format';
import { CheckoutItem } from '@/features/checkout/types';

interface OrderItemProps {
    item: CheckoutItem;
}

export function OrderItem({ item }: OrderItemProps) {
    const discountedPrice = item.product.price - (item.product.price * item.product.discount) / 100;
    const unitPrice = discountedPrice;

    return (
        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="relative aspect-square w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted border border-border">
                <Image
                    src={item.product.imageUrl || '/images/no-image.png'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="80px"
                />
            </div>

            <div className="flex-grow min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 line-clamp-2">
                    {item.product.name}
                </h3>
                <div className="text-xs sm:text-sm text-muted-foreground space-y-0.5">
                    <p>
                        <span className="font-medium">Size:</span> {item.size.size} |{' '}
                        <span className="font-medium">Color:</span>{' '}
                        <span
                            className="inline-block w-3 h-3 rounded-full border border-gray-300 align-middle mr-1"
                            style={{ backgroundColor: item.variant.color }}
                        />
                        {item.variant.color}
                    </p>
                    <p>
                        <span className="font-medium">Số lượng:</span> {item.quantity}
                    </p>
                    {item.product.discount > 0 && (
                        <p className="text-xs text-red-600 font-semibold">
                            -{item.product.discount}% OFF
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="font-bold text-base sm:text-lg text-foreground">
                    {formatCurrency(item.totalPrice)}
                </p>
                {item.product.discount > 0 && (
                    <p className="text-xs line-through text-muted-foreground">
                        {formatCurrency(item.product.price * item.quantity)}
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

