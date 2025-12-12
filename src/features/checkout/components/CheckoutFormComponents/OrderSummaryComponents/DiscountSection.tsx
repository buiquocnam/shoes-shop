import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApplyDiscount } from '@/features/checkout/hooks';

export function DiscountSection() {
    const { mutate: applyDiscount, isPending } = useApplyDiscount();
    const [discountCode, setDiscountCode] = useState('');

    const handleApply = () => {
        applyDiscount(discountCode);
    };
    return (
        <div className="flex flex-col gap-2 border-t pt-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="h-12"
                    disabled={isPending}
                />
                <Button
                    onClick={handleApply}
                    className="h-12 px-4 whitespace-nowrap"
                    disabled={!discountCode.trim() || isPending}
                >
                    {isPending ? 'Đang xử lý...' : 'Áp dụng'}
                </Button>
            </div>
        </div>
    );
}

