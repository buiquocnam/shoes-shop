'use client';

import { useAddresses, useDeleteAddress } from '../hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AddressForm } from './AddressForm';
import { Trash2 } from 'lucide-react';

export function AddressList() {
  const { data: addresses, isLoading, error } = useAddresses();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500">Lỗi khi tải địa chỉ</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Địa chỉ giao hàng</h2>
        <AddressForm />
      </div>

      {addresses && addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">
                  {address.street}, {address.ward}, {address.district}, {address.city}
                </p>
                <p className="text-sm text-gray-600">Mã bưu chính: {address.postalCode}</p>
                {address.isDefault && (
                  <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                    Địa chỉ mặc định
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteAddress(address.id)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</p>
      )}
    </div>
  );
}
