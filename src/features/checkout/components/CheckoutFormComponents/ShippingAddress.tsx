'use client';

import { ShippingAddress as ShippingAddressType } from '@/features/checkout/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ShippingAddressProps {
    addresses: ShippingAddressType[];
    selectedAddressId?: string;
    onSelectAddress: (address: ShippingAddressType) => void;
    onAddNewAddress: () => void;
}

export function ShippingAddress({
    addresses,
    selectedAddressId,
    onSelectAddress,
    onAddNewAddress,
}: ShippingAddressProps) {
    const [isOpen, setIsOpen] = useState(true);


    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border bg-card">
            <CollapsibleTrigger className="flex w-full cursor-pointer list-none items-center justify-between gap-6 px-4 py-3">
                <p className="text-base font-semibold">Địa chỉ giao hàng</p>
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-4">
                <div className="flex flex-col gap-4">
                    {addresses.length > 0 ? (
                        <RadioGroup
                            value={selectedAddressId}
                            onValueChange={(value) => {
                                const address = addresses.find((a) => a.id === value);
                                if (address) onSelectAddress(address);
                            }}
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                            {addresses.map((address) => {
                                const addressId = address.id || `address-${address.type}`;
                                const isSelected = selectedAddressId === address.id;
                                return (
                                    <div key={addressId} className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={addressId}
                                            id={addressId}
                                            className="text-primary border-gray-300"
                                        />
                                        <Label
                                            htmlFor={addressId}
                                            className={`flex cursor-pointer flex-col gap-2 rounded-lg border-2 p-4 flex-1 transition-all ${isSelected
                                                ? 'border-primary ring-2 ring-primary'
                                                : 'border-border'
                                                }`}
                                        >
                                            <div className="text-sm text-muted-foreground">
                                                <p>{address.fullName}</p>
                                                <p>{address.address}</p>
                                                <p>
                                                    {address.city}, {address.state} {address.zipCode}
                                                </p>
                                                <p>{address.country}</p>
                                            </div>
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    ) : (
                        <p className="text-sm text-muted-foreground">Chưa có địa chỉ nào</p>
                    )}

                    <Button
                        variant="outline"
                        className="mt-4 flex h-12 w-full items-center justify-center gap-2"
                        onClick={onAddNewAddress}
                    >
                        <Plus className="h-4 w-4" />
                        <span>Thêm địa chỉ mới</span>
                    </Button>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

