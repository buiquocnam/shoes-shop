'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Edit2, Mail, User, Phone, LogOut } from 'lucide-react';
import { ProfileFormDialog } from './ProfileFormDialog';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function ProfileInfo() {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const [openDialog, setOpenDialog] = useState(false);

  if (!user) return <div className="flex items-center justify-center h-full">
    <Spinner />
  </div>;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Profile Info - Vertical Layout */}
      <div className="flex flex-col items-center gap-6 flex-1">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-4 ring-primary/10">
            <User className="w-12 h-12 md:w-14 md:h-14 text-primary" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 w-full text-center space-y-3">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              {user?.name || 'Chưa có'}
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm md:text-base">{user?.email || 'Chưa có'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm md:text-base">{user?.phone || 'Chưa cập nhật'}</span>
            </div>
          </div>
        </div>

        {/* Buttons: Edit and Logout */}
        <div className="pt-4 w-full flex flex-col gap-3 shrink-0">
          <Button
            onClick={() => setOpenDialog(true)}
            variant="outline"
            className="gap-2 font-medium w-full"
          >
            <Edit2 className="w-4 h-4" />
            Chỉnh sửa thông tin
          </Button>
          <Button
            onClick={() => logout()}
            variant="outline"
            className="gap-2 font-medium border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>
      </div>

      <ProfileFormDialog open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
}
