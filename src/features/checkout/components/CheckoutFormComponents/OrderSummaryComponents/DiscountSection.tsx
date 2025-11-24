import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DiscountSectionProps {
    onApplyDiscount: (code: string) => void;
    isApplying?: boolean;
}

export function DiscountSection({
    onApplyDiscount,
    isApplying = false,
}: DiscountSectionProps) {
    const [discountCode, setDiscountCode] = useState('');

    const handleApply = () => {
        if (discountCode.trim()) {
            onApplyDiscount(discountCode);
            setDiscountCode('');
        }
    };
    return (
        <div className="flex flex-col gap-2 border-t pt-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="h-12"
                    disabled={isApplying}
                />
                <Button
                    variant="outline"
                    onClick={handleApply}
                    className="h-12 px-4 whitespace-nowrap"
                    disabled={!discountCode.trim() || isApplying}
                >
                    {isApplying ? 'Đang xử lý...' : 'Áp dụng'}
                </Button>
            </div>
        </div>
    );
}

