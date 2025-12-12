"use client";

import { AddressType } from "@/features/shared/types/address";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react";
import { formatFullAddress } from "@/features/shared/utils/addressHelpers";
import { useDeleteAddress, useSetDefaultAddress } from "@/features/shared/hooks/useAdress";

interface AddressCardProps {
    address: AddressType;
    className?: string;
}

export function AddressCard({
    address,
    className = "",
}: AddressCardProps) {
    const fullAddress = formatFullAddress(address);
    const deleteAddressMutation = useDeleteAddress(address.userId);
    const setDefaultAddressMutation = useSetDefaultAddress(address.userId);

    /**
     * Xử lý delete address - dùng shared hook
     */
    const handleDelete = () => {
        if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
            deleteAddressMutation.mutate(address.id);
        }
    };

    /**
     * Xử lý set default address - hook sẽ tự động invalidate và update lại data
     */
    const handleSetDefault = () => {
        if (!address.isDefault) {
            setDefaultAddressMutation.mutate(address.id);
        }
    };

    return (
        <label
            htmlFor={address.id}
            className={`flex items-start gap-3 rounded-lg p-4 border transition-colors cursor-pointer hover:border-primary/50 ${address.isDefault ? "border-primary" : "border-border"
                } ${className}`}
        >
            <RadioGroupItem
                value={address.id}
                id={address.id}
                className="sr-only"
                onClick={(e) => {
                    e.stopPropagation();
                    handleSetDefault();
                }}
            />

            <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col gap-1 flex-1">
                        <p className="text-base font-bold">{address.addressLine}</p>
                        <p className="text-sm font-normal leading-normal text-muted-foreground">
                            {fullAddress}
                        </p>
                    </div>
                    {address.isDefault && (
                        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold whitespace-nowrap">
                            Default
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        disabled={deleteAddressMutation.isPending}
                        className="flex items-center gap-1 text-sm font-medium hover:text-destructive transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                </div>
            </div>
        </label>
    );
}

