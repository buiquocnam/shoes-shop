'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import { Edit2, Mail, Phone, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { ProfileFormDialog } from './ProfileFormDialog';

export function ProfileInfo() {
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);

  if (!user) return <Spinner />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Avatar Card */}
      <Card className="lg:col-span-1 p-6 flex flex-col items-center">
        <div className="mb-4">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-center">{user?.name || 'N/A'}</h3>
        <p className="text-gray-500 text-sm text-center mt-1">{user?.email}</p>
        <Button
          onClick={() => setOpenDialog(true)}
          className="w-full mt-6 gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Chỉnh sửa thông tin
        </Button>
      </Card>

      {/* Profile Details Card */}
      <Card className="lg:col-span-2 p-6">
        <h2 className="text-2xl font-semibold mb-6">Thông tin cá nhân</h2>

        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-start gap-4 pb-4 border-b">
              <Mail className="w-8 h-8 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
          </div>

          {/* Name */}
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="bg-green-100 p-3 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Tên</p>
              <p className="text-lg font-semibold">{user?.name || 'Chưa cập nhật'}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="text-lg font-semibold">{user?.phone || 'Chưa cập nhật'}</p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
              <p className="text-lg font-semibold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Dialog Form */}
      <ProfileFormDialog open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
}
