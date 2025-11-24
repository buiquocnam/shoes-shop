'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import { Edit2, Mail, Phone, Calendar, User } from 'lucide-react';
import { ProfileFormDialog } from './ProfileFormDialog';

export function ProfileInfo() {
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);

  if (!user) return <Spinner />;

  return (
    <div>
      {/* Avatar Card */}
      <Card className="p-6 flex flex-col items-center">
        <div className="mb-4">
            <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
        </div>
        <h3 className="text-xl font-semibold text-center">{user?.name || 'N/A'}</h3>
        <p className="text-gray-500 text-sm text-center mt-1">{user?.email || 'N/A'}</p>
        <Button
          onClick={() => setOpenDialog(true)}
          className="w-full mt-6 gap-2"
        >
          <Edit2 className="w-4 h-4" />
            Edit
        </Button>
      </Card>

      

      {/* <ProfileFormDialog open={openDialog} onOpenChange={setOpenDialog} /> */}
    </div>
  );
}
