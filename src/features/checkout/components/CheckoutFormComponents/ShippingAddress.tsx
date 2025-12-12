'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { AddressManagement } from '@/features/shared/components/address';
import { AddressType } from '@/features/shared/types/address';

interface ShippingAddressProps {
    selectedAddressId?: string;
    onSelectAddress?: (address: AddressType) => void;
}

/**
 * Component hiển thị và chọn shipping address
 * Dùng shared AddressManagement component (giống profile)
 */
export function ShippingAddress({
    selectedAddressId,
    onSelectAddress,
}: ShippingAddressProps) {
    const { user } = useAuthStore();
    const userId = user?.id ?? "";

    return (
        <AddressManagement
            userId={userId}
            selectedAddressId={selectedAddressId}
            onSelectAddress={onSelectAddress}
            showActions={true}
        />
    );
}

