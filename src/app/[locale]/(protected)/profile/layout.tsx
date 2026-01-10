'use client';

import { cn } from '@/lib/utils';
import { User, MapPin, Package, LogOut } from 'lucide-react';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const tHeader = useTranslations('Header.account');
    const tSidebar = useTranslations('Profile.sidebar');
    const pathname = usePathname();
    const { mutate: logout } = useLogout();
    const { user } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    const navigationItems = [
        {
            label: tSidebar('info'),
            href: '/profile/info' as const,
            icon: User,
        },
        {
            label: tSidebar('address'),
            href: '/profile/address' as const,
            icon: MapPin,
        },
        {
            label: tSidebar('orders'),
            href: '/profile/orders' as const,
            icon: Package,
        },
    ];

    const activeClass = "flex items-center gap-3 px-4 py-3 rounded-full bg-primary/10 text-primary font-medium transition-colors";
    const inactiveClass = "flex items-center gap-3 px-4 py-3 rounded-full text-muted-foreground hover:bg-muted hover:text-primary transition-colors font-medium";

    return (
        <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 sm:gap-6">
                    {/* Left column: Sidebar */}
                    <aside className="w-full md:w-72 flex-shrink-0">
                        <div className="sticky top-24 bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
                            {/* User Info Section */}
                            {user && (
                                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
                                    <div className="size-10 sm:size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-sm sm:text-base font-bold text-primary">
                                            {getInitials(user.name || user.email)}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm sm:text-base text-foreground font-semibold leading-tight truncate">
                                            {user.name || user.email}
                                        </h3>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <nav className="flex flex-col gap-2">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={isActive ? activeClass : inactiveClass}
                                        >
                                            <Icon className="w-5 h-5 shrink-0" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}

                                {/* Separator */}
                                <div className="h-px bg-border my-2"></div>

                                {/* Logout Button */}
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 justify-start rounded-full text-muted-foreground hover:bg-muted hover:text-primary font-medium"
                                >
                                    <LogOut className="w-5 h-5 shrink-0" />
                                    <span>{tHeader('logout')}</span>
                                </Button>
                            </nav>
                        </div>
                    </aside>

                    {/* Right column: Content */}
                    <main className="min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
