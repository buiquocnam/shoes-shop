"use client";

import { AddressType } from "@/features/shared/types/address";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react";
import { formatFullAddress } from "@/features/shared/utils/addressHelpers";
import { useDeleteAddress, useUpdateDefaultAddress } from "@/features/shared/hooks/useAdress";

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
    const updateDefaultAddressMutation = useUpdateDefaultAddress(address.userId);


    const handleDelete = () => {
        if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
            deleteAddressMutation.mutate(address.id);
        }
    };


    const handleUpdateDefault = () => {
        if (!address.isDefault) {
            updateDefaultAddressMutation.mutate(address.id);
        }
    };

    return (
        <label
            htmlFor={address.id}
            className={`group relative flex items-start gap-4 rounded-xl p-5 border-2 transition-all cursor-pointer bg-white hover:border-primary/50 hover:shadow-md ${address.isDefault
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200"
                } ${className}`}
        >
            <RadioGroupItem
                value={address.id}
                id={address.id}
                className="sr-only"
                onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateDefault();
                }}
            />

            <div className="flex-1 flex flex-col gap-4 min-w-0">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-base font-semibold text-gray-900 truncate">
                                {address.addressLine}
                            </p>
                            {address.isDefault && (
                                <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shrink-0">
                                    Mặc định
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {fullAddress}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        disabled={deleteAddressMutation.isPending}
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Xóa địa chỉ
                    </Button>
                </div>
            </div>
        </label>
    );
}

