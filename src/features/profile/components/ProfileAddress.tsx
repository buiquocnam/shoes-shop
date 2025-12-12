"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { AddressManagement } from "@/features/shared/components/address";
import { AddressType } from "@/features/shared/types/address";

export function ProfileAddress() {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";


  return (
    <AddressManagement
      userId={userId}
    />
  );
}
