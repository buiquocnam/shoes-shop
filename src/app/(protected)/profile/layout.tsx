'use client';

import { ProfileInfo } from '@/features/profile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { ProfileAddress } from '@/features/profile/components/ProfileAddress';
import { ProductListBought } from '@/features/profile';

export default function ProfileLayout() {
    const [activeTab, setActiveTab] = useState('address');

    const tabs = [
        { label: 'Địa chỉ', value: 'address' },
        { label: 'Đơn hàng', value: 'orders' },
    ];

    // Sync hash with tab
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        Tài khoản của tôi
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                        Quản lý thông tin cá nhân và đơn hàng của bạn
                    </p>
                </div>

                {/* Main layout: 2 columns with 1:2 ratio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left column: Profile info (1 part) */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8 hover:shadow-md transition-shadow duration-200 h-full">
                            <ProfileInfo />
                        </div>
                    </div>

                    {/* Right column: Tabs (2 parts) */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden h-full">
                            <Tabs
                                value={activeTab}
                                onValueChange={handleTabChange}
                                className="w-full h-full flex flex-col"
                            >
                                <div className="w-full border-b border-gray-200 bg-gray-50/50 shrink-0">
                                    <TabsList className="w-full flex h-auto p-0 bg-transparent border-none">
                                        {tabs.map((tab) => (
                                            <TabsTrigger
                                                key={tab.value}
                                                value={tab.value}
                                                className={`flex-1 py-4 px-6 rounded-none border-b-2 transition-all duration-200 text-base font-semibold relative
                         ${activeTab === tab.value
                                                        ? 'border-primary text-primary bg-white'
                                                        : 'border-transparent text-gray-600 hover:bg-white/50 hover:text-primary'}
                       `}
                                            >
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                                <div className="w-full px-6 md:px-8 py-6 md:py-8 flex-1 overflow-auto">
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
        </div>
    );
}
