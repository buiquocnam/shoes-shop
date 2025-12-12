"use client";

import { AddressType } from "@/features/shared/types/address";
import { AddressCard } from "./AddressCard";

interface AddressListProps {
    addresses: AddressType[];
    gridCols?: "1" | "2" | "3";
    className?: string;
}

/**
 * Component hiển thị danh sách addresses
 * Dùng chung cho cả profile và checkout
 */
export function AddressList({
    addresses,
    gridCols = "2",
    className = "",
}: AddressListProps) {
    if (addresses.length === 0) {
        return null;
    }

    const gridClass = {
        "1": "grid-cols-1",
        "2": "grid-cols-1 md:grid-cols-2",
        "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    }[gridCols];

    return (
        <div className={`grid ${gridClass} gap-4 ${className}`}>
            {addresses.map((address) => (
                <AddressCard
                    key={address.id}
                    address={address}
                />
            ))}
        </div>
    );
}

