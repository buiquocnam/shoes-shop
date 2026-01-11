'use client';

import { Button } from '@/components/ui/button';
import { AddressType } from '@/types/address';
import { formatFullAddress } from '@/features/shared/utils/addressHelpers';
import { useDeleteAddress, useUpdateDefaultAddress } from '@/features/shared/hooks/useAdress';
import { Trash2, Star, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressLineProps {
  address: AddressType;
  addresses: AddressType[];
  userId: string;
  onEdit: (address: AddressType) => void;
}

export function AddressLine({
  address,
  addresses,
  userId,
  onEdit,
}: AddressLineProps) {
  const fullAddress = formatFullAddress(address);
  const deleteAddressMutation = useDeleteAddress(userId);
  const updateDefaultAddressMutation = useUpdateDefaultAddress(userId);

  const handleDelete = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        await deleteAddressMutation.mutateAsync(address.id);
        // If deleted address was default, set first available address as default
        if (address.isDefault) {
          const remaining = addresses.filter((addr) => addr.id !== address.id);
          if (remaining.length > 0) {
            await updateDefaultAddressMutation.mutateAsync(remaining[0].id);
          }
        }
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(address);
  };

  const handleSetDefault = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (address.isDefault) return;

    try {
      await updateDefaultAddressMutation.mutateAsync(address.id);
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  return (
    <div
      className={cn(
        'relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all group',
        address.isDefault
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full">
        {address.isDefault && (
          <div className="mt-0.5 sm:mt-1 size-4 sm:size-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center transition-all shrink-0">
            <div className="size-1.5 sm:size-2 rounded-full bg-background"></div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-sm sm:text-base text-foreground truncate">
              {address.nameReceiver && address.phoneReceiver
                ? `${address.nameReceiver} - ${address.phoneReceiver}`
                : "Người nhận"}
            </span>
            {address.isDefault && (
              <span className="text-[9px] sm:text-[10px] font-bold uppercase bg-primary/10 text-primary px-1.5 sm:px-2 py-0.5 rounded-full">
                Mặc định
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground mb-0.5">
            {address.addressLine}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">
            {fullAddress.replace(`${address.addressLine}, `, '')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-2 hover:opacity-100 transition-all shrink-0">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleEdit}
          className="size-8 sm:size-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
          title="Chỉnh sửa"
        >
         <Edit2 />
        </Button>
        {!address.isDefault && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSetDefault}
            disabled={updateDefaultAddressMutation.isPending}
            className="size-8 sm:size-9"
          >
            <Star />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={deleteAddressMutation.isPending}
          className="size-8 sm:size-9"
          title="Xóa địa chỉ"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

