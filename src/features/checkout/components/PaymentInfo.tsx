'use client';

import { PaymentInfo as PaymentInfoType } from '../types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Image from 'next/image';
import { CREDIT_CARD_BRANDS, PAYMENT_METHOD_IMAGES } from '../constants/paymentMethods';

interface PaymentInfoProps {
    paymentInfo: PaymentInfoType;
    onPaymentInfoChange: (info: PaymentInfoType) => void;
}

export function PaymentInfo({
    paymentInfo,
    onPaymentInfoChange,
}: PaymentInfoProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleMethodChange = (method: 'credit_card' | 'paypal') => {
        onPaymentInfoChange({
            ...paymentInfo,
            method,
        });
    };

    const handleCardInfoChange = (field: keyof PaymentInfoType, value: string) => {
        onPaymentInfoChange({
            ...paymentInfo,
            [field]: value,
        });
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border bg-card">
            <CollapsibleTrigger className="flex w-full cursor-pointer list-none items-center justify-between gap-6 px-4 py-3">
                <p className="text-base font-semibold">Thông tin thanh toán</p>
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-4">
                <div className="flex flex-col gap-4">
                    <RadioGroup
                        value={paymentInfo.method}
                        onValueChange={(value) => handleMethodChange(value as 'credit_card' | 'paypal')}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit_card" id="credit_card" className="text-primary border-gray-300" />
                            <Label
                                htmlFor="credit_card"
                                className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 flex-1 transition-all ${paymentInfo.method === 'credit_card'
                                    ? 'border-primary ring-2 ring-primary'
                                    : 'border-border'
                                    }`}
                            >
                                <p className="flex-grow font-medium">Thẻ tín dụng</p>
                                <div className="flex gap-1">
                                    {CREDIT_CARD_BRANDS.map((brand) => (
                                        <Image
                                            key={brand.name}
                                            src={brand.image}
                                            alt={brand.name}
                                            width={24}
                                            height={24}
                                            className="h-6"
                                        />
                                    ))}
                                </div>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal" className="text-primary border-gray-300" />
                            <Label
                                htmlFor="paypal"
                                className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 flex-1 transition-all ${paymentInfo.method === 'paypal'
                                    ? 'border-primary ring-2 ring-primary'
                                    : 'border-border'
                                    }`}
                            >
                                <p className="flex-grow font-medium">PayPal</p>
                                <Image
                                    src={PAYMENT_METHOD_IMAGES.paypal}
                                    alt="PayPal"
                                    width={24}
                                    height={24}
                                    className="h-6"
                                />
                            </Label>
                        </div>
                    </RadioGroup>

                    {paymentInfo.method === 'credit_card' && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div className="sm:col-span-4">
                                <Label className="pb-2 text-sm font-medium">Số thẻ</Label>
                                <Input
                                    placeholder="•••• •••• •••• ••••"
                                    value={paymentInfo.cardNumber || ''}
                                    onChange={(e) => handleCardInfoChange('cardNumber', e.target.value)}
                                    className="h-12"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Label className="pb-2 text-sm font-medium">Ngày hết hạn</Label>
                                <Input
                                    placeholder="MM / YY"
                                    value={paymentInfo.expirationDate || ''}
                                    onChange={(e) => handleCardInfoChange('expirationDate', e.target.value)}
                                    className="h-12"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="flex items-center gap-2 pb-2">
                                    <Label className="text-sm font-medium">CVV</Label>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                </div>
                                <Input
                                    placeholder="•••"
                                    value={paymentInfo.cvv || ''}
                                    onChange={(e) => handleCardInfoChange('cvv', e.target.value)}
                                    className="h-12"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

