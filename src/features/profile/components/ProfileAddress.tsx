"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { AddressManagement } from "@/features/shared/components/address";
import { useUsersAddress } from "@/features/shared/hooks/useAdress";
import { Spinner } from "@/components/ui/spinner";

export function ProfileAddress() {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";
  const { data: usersAddress, isLoading } = useUsersAddress(userId);

  return (
    <AddressManagement
      userId={userId}
      usersAddress={usersAddress || []}
      isLoading={isLoading}
      selectedAddress={null}
    />
  );
}
