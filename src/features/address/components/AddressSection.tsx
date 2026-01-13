import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUsersAddress } from '../hooks/useAddress';
import { AddressDialog } from './AddressDialog';
import { AddressLine } from './AddressLine';
import { Plus, MapPin } from 'lucide-react';
import { AddressType } from '@/types/address';
import { useTranslations } from 'next-intl';

interface AddressSectionProps {
  userId: string;
}

export function AddressSection({
  userId,
}: AddressSectionProps) {
  const tSidebar = useTranslations('Profile.sidebar');
  const tAddress = useTranslations('Address');
  const tCommon = useTranslations('Common');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
  const { data: addresses = [], isLoading } = useUsersAddress(userId);

  const handleCreate = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address: AddressType) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) setEditingAddress(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
          {tSidebar('address')}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreate}
          className="text-primary text-xs sm:text-sm font-bold flex items-center w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-125 transition-transform" />
          {tAddress('title.add')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-muted-foreground font-medium">{tCommon('loading')}</p>
          </div>
        ) : addresses.length > 0 ? (
          addresses.map((addr) => (
            <AddressLine
              key={addr.id}
              address={addr}
              addresses={addresses}
              userId={userId}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div className="text-center py-8 sm:py-12 border-2 border-dashed border-border rounded-2xl sm:rounded-3xl px-4">
            <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              {tAddress('noAddressSaved') || "No address saved"}
            </p>
            <Button
              variant="link"
              onClick={handleCreate}
              className="mt-3 sm:mt-4 text-primary font-bold text-xs sm:text-sm hover:underline"
            >
              {tAddress('title.addFirst') || "Add your first address"}
            </Button>
          </div>
        )}
      </div>

      {/* Address Dialog */}
      <AddressDialog
        userId={userId}
        open={isModalOpen}
        onOpenChange={handleOpenChange}
        defaultIsDefault={addresses.length === 0}
        initialData={editingAddress}
      />
    </div>
  );
}

