"use client";

import { AddressType } from "@/features/shared/types/address";
import { Button } from "@/components/ui/button";
import { Trash2, Bookmark } from "lucide-react";
import { formatFullAddress } from "@/features/shared/utils/addressHelpers";
import { useDeleteAddress, useSetDefaultAddress } from "@/features/shared/hooks/useAdress";

interface AddressCardProps {
    address: AddressType;
    className?: string;
}

/**
 * Component hiển thị một address card
 * Tự xử lý tất cả logic: delete, set default
 * Dùng chung cho cả profile và checkout
 */
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
     * Xử lý set default address - dùng shared hook
     */
    const handleSetDefault = () => {
        setDefaultAddressMutation.mutate(address.id);
    };

    return (
        <div
            className={`flex flex-col gap-4 rounded-lg p-4 border transition-colors ${address.isDefault
                ? "border-primary"
                : "border-border"
                } ${className}`}
        >
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
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteAddressMutation.isPending}
                    className="flex items-center gap-1 text-sm font-medium hover:text-destructive transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </Button>
                {!address.isDefault && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSetDefault}
                        disabled={setDefaultAddressMutation.isPending}
                        className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                    >
                        <Bookmark className="w-4 h-4" />
                        Set as Default
                    </Button>
                )}
            </div>
        </div>
    );
}

