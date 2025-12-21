'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { User, MapPin, Package, LogOut } from 'lucide-react';
import { useLogout } from '@/features/auth/hooks/useLogout';

const navigationItems = [
    {
        label: 'Thông tin',
        href: '/profile/info',
        icon: User,
    },
    {
        label: 'Địa chỉ',
        href: '/profile/address',
        icon: MapPin,
    },
    {
        label: 'Đơn hàng',
        href: '/profile/orders',
        icon: Package,
    },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { mutate: logout } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
                    {/* Left column: Sidebar */}
                    <aside className="md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-5rem)]">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
                            <nav className="p-2">
                                <ul className="space-y-1">
                                    {navigationItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;

                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground font-semibold"
                                                            : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                                                    )}
                                                >
                                                    <Icon className="w-5 h-5 shrink-0" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <LogOut className="w-5 h-5 shrink-0" />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </aside>

                    {/* Right column: Content */}
                    <main className="min-w-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden h-full">
                            <div className="p-6 md:p-8">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
