'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCoupons } from '@/features/checkout/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, X, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Coupon } from '@/features/checkout/types/coupon';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';

interface DiscountSectionProps {
  price: number;
  setDiscountCode: (coupon: Coupon | null) => void;
}

interface CouponStatus {
  isValid: boolean;
  reasons: string[];
}

export function DiscountSection({ price, setDiscountCode }: DiscountSectionProps) {
  const { data: coupons } = useCoupons();
  const couponList: Coupon[] = coupons?.data || [];
  const [couponSelected, setCouponSelected] = useState<Coupon | null>(null);

  const getCouponStatus = (coupon: Coupon): CouponStatus => {
    const reasons: string[] = [];
    const now = new Date();
    const exp = new Date(coupon.expirationDate);

    if (price < coupon.minOrder) {
      reasons.push(`Đơn tối thiểu ${formatCurrency(coupon.minOrder)}`);
    }
    if (now > exp) {
      reasons.push('Đã hết hạn');
    }

    return {
      isValid: reasons.length === 0,
      reasons,
    };
  };

  const discountAmount = useMemo(() => {
    if (!couponSelected) return 0;
    const status = getCouponStatus(couponSelected);
    if (!status.isValid) return 0;
    return (price * couponSelected.discountPercent) / 100;
  }, [price, couponSelected]);

  const handleApply = (coupon: Coupon) => {
    const status = getCouponStatus(coupon);
    if (status.isValid) {
      setCouponSelected(coupon);
      setDiscountCode(coupon);
    }
  };

  const handleRemove = () => {
    setCouponSelected(null);
    setDiscountCode(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between h-10">
              <span className="truncate">
                {couponSelected?.code || 'Chọn mã giảm giá'}
              </span>
              <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 max-h-[400px] overflow-y-auto">
            {couponList.length > 0 ? (
              couponList.map((coupon) => {
                const status = getCouponStatus(coupon);

                return (
                  <DropdownMenuItem
                    key={coupon.id}
                    onClick={() => handleApply(coupon)}
                    disabled={!status.isValid}
                    className={cn(
                      'flex flex-col items-start gap-2 p-4 cursor-pointer',
                      'hover:bg-muted/50 transition-colors',
                    )}
                  >
                    <div className="flex items-start justify-between w-full gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-base">{coupon.code}</span>
                          <Badge
                            variant={status.isValid ? 'default' : 'secondary'}
                            className="text-xs font-semibold"
                          >
                            -{coupon.discountPercent}%
                          </Badge>
                          {status.isValid && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                          {!status.isValid && (
                            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Hết hạn: {format(new Date(coupon.expirationDate), 'dd/MM/yyyy')}
                          </span>
                          <span>•</span>
                          <span>Đơn tối thiểu: {formatCurrency(coupon.minOrder)}</span>
                          <span>•</span>
                          <span>Còn lại: {coupon.quantity}</span>
                        </div>
                      </div>
                      {status.isValid && (
                        <div className="text-right shrink-0">
                          <div className="text-xs text-muted-foreground">Tiết kiệm</div>
                          <div className="text-sm font-bold text-green-600 dark:text-green-400">
                            {formatCurrency((price * coupon.discountPercent) / 100)}
                          </div>
                        </div>
                      )}
                    </div>
                    {!status.isValid && status.reasons.length > 0 && (
                      <div className="w-full pt-2 border-t">
                        <div className="text-xs text-destructive font-medium">
                          Không thể sử dụng:
                        </div>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          {status.reasons.map((reason, idx) => (
                            <li key={idx}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </DropdownMenuItem>
                );
              })
            ) : (
              <DropdownMenuItem disabled className="p-4">
                Không có mã giảm giá
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {couponSelected && (
          <Button variant="ghost" size="icon" onClick={handleRemove} className="h-10 w-10">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {discountAmount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Giảm giá</span>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            -{formatCurrency(discountAmount)}
          </span>
        </div>
      )}
    </div>
  );
}
