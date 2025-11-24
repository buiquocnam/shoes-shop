'use client';

import { ShippingMethod as ShippingMethodType } from '@/features/checkout/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { formatCurrency } from '@/utils/format';

interface ShippingMethodProps {
    methods: ShippingMethodType[];
    selectedMethodId?: string;
    onSelectMethod: (methodId: string) => void;
}

export function ShippingMethod({
    methods,
    selectedMethodId,
    onSelectMethod,
}: ShippingMethodProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border bg-card">
            <CollapsibleTrigger className="flex w-full cursor-pointer list-none items-center justify-between gap-6 px-4 py-3">
                <p className="text-base font-semibold">Phương thức vận chuyển</p>
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-4">
                <RadioGroup
                    value={selectedMethodId}
                    onValueChange={onSelectMethod}
                    className="flex flex-col gap-3"
                >
                    {methods.map((method) => {
                        const isSelected = selectedMethodId === method.id;
                        return (
                            <div key={method.id} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={method.id}
                                    id={method.id}
                                    className="text-primary border-gray-300"
                                />
                                <Label
                                    htmlFor={method.id}
                                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 flex-1 transition-all ${isSelected
                                        ? 'border-primary ring-2 ring-primary'
                                        : 'border-border'
                                        }`}
                                >
                                    <div className="flex-grow">
                                        <p className="font-medium">{method.name}</p>
                                        <p className="text-sm text-muted-foreground">{method.description}</p>
                                    </div>
                                    <p className="font-semibold">{formatCurrency(method.price)}</p>
                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>
            </CollapsibleContent>
        </Collapsible>
    );
}

