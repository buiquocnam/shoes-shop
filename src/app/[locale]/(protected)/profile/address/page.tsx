'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { AddressManagement } from "@/features/address";

export default function ProfileAddressPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";

  return (
    <div>
      <AddressManagement userId={userId} />
    </div>
  );
}
