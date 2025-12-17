'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import { Edit2, Mail, User, Phone } from 'lucide-react';
import { ProfileFormDialog } from './ProfileFormDialog';

export function ProfileInfo() {
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);

  if (!user) return <div className="flex items-center justify-center h-full">
    <Spinner />
  </div>;

  return (
    <div>
      {/* Avatar Card */}
      <Card className="p-6 flex flex-col items-center border-0 shadow-xl">
        <div className="mb-4">
          <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center">{user?.name || 'N/A'}</h3>
        <p className="text-gray-500 text-sm text-center mt-1 flex items-center justify-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          {user?.email || 'N/A'}
        </p>
        <p className="text-gray-500 text-sm text-center mt-1 flex items-center justify-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          {user?.phone || 'Chưa cập nhật'}
        </p>
        <Button
          onClick={() => setOpenDialog(true)}
          className="w-full mt-6 gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>
      </Card>

      <ProfileFormDialog open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
}
