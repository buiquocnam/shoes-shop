'use client';

import { User, ShoppingCart, LogOut } from "lucide-react";
import { useAuthStore, useIsAuthenticated } from "@/store/useAuthStore";
import { useCart } from "@/features/cart/hooks/useCart";
import { Link, useRouter } from "@/i18n/routing";
import { useLogout } from "@/features/auth/hooks";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import LanguageSwitcher from "../../common/LanguageSwitcher";
import { ThemeToggle } from "../../common/ThemeToggle";

export function UserMenu() {
    const t = useTranslations('Header');
    const { user } = useAuthStore();
    const isAuthenticated = useIsAuthenticated();
    const { cart } = useCart();
    const router = useRouter();
    const { mutateAsync: logout } = useLogout();

    const cartCount = useMemo(() => cart?.count ?? 0, [cart?.count]);

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    const accountLinks = useMemo(() => [
        { name: t('account.profile'), href: '/profile', icon: User },
        { name: t('account.logout'), href: '#', icon: LogOut, onClick: handleLogout },
    ], [handleLogout, t]);

    return (
        <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden sm:flex items-center gap-1 md:gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>

            {/* Cart */}
            <Link
                href="/cart"
                className="flex items-center justify-center size-10 rounded-full hover:bg-accent text-foreground transition-colors relative"
            >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {cartCount > 9 ? '9+' : cartCount}
                    </span>
                )}
            </Link>

            {/* User Account */}
            {isAuthenticated && user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 md:size-10 rounded-full border-2 border-border ml-1 overflow-hidden p-0"
                        >
                            <Avatar className="size-full">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-bold leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {accountLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <DropdownMenuItem
                                        key={link.name}
                                        asChild={!link.onClick}
                                        onClick={link.onClick}
                                        className="cursor-pointer"
                                    >
                                        {link.onClick ? (
                                            <div className="flex items-center gap-2 w-full">
                                                <Icon className="h-4 w-4" />
                                                <span>{link.name}</span>
                                            </div>
                                        ) : (
                                            <Link href={link.href} className="flex items-center gap-2 w-full">
                                                <Icon className="h-4 w-4" />
                                                <span>{link.name}</span>
                                            </Link>
                                        )}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button
                    onClick={() => router.push('/login')}
                    variant="ghost"
                    size="icon"
                    className="size-10 rounded-full hover:bg-accent text-foreground"
                >
                    <User className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
}
