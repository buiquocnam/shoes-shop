'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { ProfileInfo, ProductListBought } from '@/features/profile';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Tài khoản của tôi</h1>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
          <div className="col-span-1">  
            <ProfileInfo />
          </div>
          <div className="col-span-2">
            <ProductListBought />
          </div>
        </div>

       
      </div>
    </div>
  );
}

