'use client';

import { Menu, LogOut, User, ShoppingCart } from "lucide-react";
import Image from "next/image";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLinks } from "./NavLinks";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/features/auth/hooks";
import { useCallback, useMemo } from "react";
import { Link, useRouter } from "@/i18n/routing";
import LanguageSwitcher from "../../common/LanguageSwitcher";
import { ThemeToggle } from "../../common/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCart } from "@/features/cart/hooks/useCart";

export function MobileNav() {
    const t = useTranslations('Header');
    const { user } = useAuthStore();
    const { mutateAsync: logout } = useLogout();
    const router = useRouter();
    const { cart } = useCart();

    const cartCount = useMemo(() => cart?.count ?? 0, [cart?.count]);

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    const accountLinks = useMemo(() => [
        { name: t('account.profile'), href: '/profile', icon: User },
        { name: t('account.logout'), href: '#', icon: LogOut, onClick: handleLogout },
    ], [handleLogout, t]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden size-10 rounded-full text-foreground hover:bg-accent"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-80 border-l border-border bg-background p-0">
                <SheetHeader className="p-6 text-left border-b border-border">
                    <SheetTitle>
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={110}
                            height={36}
                            className="h-8 w-auto object-contain"
                            priority
                            unoptimized
                        />
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-[calc(100vh-80px)]">
                    <div className="flex-1 overflow-y-auto py-6 px-6">
                        <div className="space-y-8">
                            {/* User Section */}
                            {!user ? (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                        Tài khoản
                                    </h3>
                                    <Button
                                        onClick={() => router.push('/login')}
                                        className="w-full justify-start gap-3 h-12 rounded-xl text-base font-bold"
                                    >
                                        <User className="h-5 w-5" />
                                        Đăng nhập
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-2 bg-accent/50 rounded-2xl">
                                        <div className="size-12 rounded-full border-2 border-background overflow-hidden relative">
                                            <Avatar className="size-full">
                                                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-foreground leading-tight">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <Link
                                            href="/cart"
                                            className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 text-primary transition-all active:scale-95"
                                        >
                                            <div className="flex items-center gap-3">
                                                <ShoppingCart className="h-5 w-5" />
                                                <span className="font-bold">Giỏ hàng của tôi</span>
                                            </div>
                                            {cartCount > 0 && (
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                                                    {cartCount > 9 ? '9+' : cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                    {t('mobile.navigation')}
                                </h3>
                                <NavLinks
                                    className="flex-col items-start gap-1"
                                    itemClassName="w-full px-4 py-3 rounded-xl text-base font-bold transition-all hover:bg-accent"
                                    activeClassName="bg-primary/10 text-primary border-none shadow-none"
                                />
                            </div>

                            {/* Settings */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                    {t('mobile.settings')}
                                </h3>
                                <div className="flex items-center gap-4 px-2">
                                    <LanguageSwitcher />
                                    <ThemeToggle />
                                </div>
                            </div>

                            {/* Account Links */}
                            {user && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                        {t('mobile.account')}
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {accountLinks.map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={link.onClick}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all hover:bg-accent text-foreground"
                                                >
                                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
