'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileInfo } from '@/features/profile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { ProfileAddress } from '@/features/profile/components/ProfileAddress';
import { ProductListBought } from '@/features/profile';

export default function ProfileLayout() {
    const { logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState('address');

    const handleLogout = () => logout();

    const tabs = [
        { label: 'Địa chỉ', value: 'address' },
        { label: 'Đơn hàng', value: 'orders' },
    ];

    // Sync hash với tab
    useEffect(() => {
        const hash = window.location.hash.slice(1); // Remove #
        if (hash === 'address' || hash === 'orders') {
            setActiveTab(hash);
        } else {
            // Default to address if no hash
            setActiveTab('address');
            window.location.hash = 'address';
        }
    }, [activeTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        window.location.hash = value;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-[1200px] mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Tài khoản của tôi</h1>
                    <Button
                        variant="destructive"
                        className="gap-2 font-medium"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                    </Button>
                </div>

                {/* Main layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile info (avatar, name, email, etc.) */}
                    <div className="col-span-1">
                        <ProfileInfo />
                    </div>

                    {/* Tabs và content */}
                    <div className="col-span-2 bg-white rounded-xl shadow border border-gray-100 p-0">
                        <Tabs
                            value={activeTab}
                            onValueChange={handleTabChange}
                            className="w-full"
                        >
                            <div className="w-full border-b border-gray-100">
                                <TabsList className="w-full flex h-auto p-0 bg-transparent border-none">
                                    {tabs.map((tab) => (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className={`w-full py-3 rounded-none border-b-2 transition-all duration-150 text-base font-semibold
                         ${activeTab === tab.value
                                                    ? 'border-primary text-primary bg-gray-50'
                                                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-primary'}
                       `}
                                        >
                                            {tab.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                            <div className="w-full px-6 py-4">
                                <TabsContent value="address" className="mt-0">
                                    {activeTab === 'address' && <ProfileAddress />}
                                </TabsContent>
                                <TabsContent value="orders" className="mt-0">
                                    {activeTab === 'orders' && <ProductListBought />}
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
