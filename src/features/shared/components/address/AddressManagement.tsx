'use client';

import { AddressSection } from './AddressSection';
interface AddressManagementProps {
  userId: string;
}

export function AddressManagement({
  userId,
}: AddressManagementProps) {
  return (
    <div className="flex-1 max-w-[1280px] w-full mx-auto  ">
      <main className="flex-1 flex flex-col gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-6 lg:p-8 shadow-sm">
          <AddressSection userId={userId} />
        </div>
      </main>
    </div>
  );
}

