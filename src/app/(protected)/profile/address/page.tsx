'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { AddressManagement } from "@/features/shared/components/address";
import { useUsersAddress } from "@/features/shared/hooks/useAdress";
import { Spinner } from "@/components/ui/spinner";

export default function ProfileAddressPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";
  const { data: usersAddress, isLoading } = useUsersAddress(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <AddressManagement
        userId={userId}
        usersAddress={usersAddress || []}
        isLoading={isLoading}
        selectedAddress={null}
      />
    </div>
  );
}
