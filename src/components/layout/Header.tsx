'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { User, ShoppingCart, LogOut, Search, Menu } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLogout } from "@/features/auth/hooks/useLogout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Giày', href: '/products' },
    { name: 'Liên hệ', href: '/contact' },
] as const;

const HIDDEN_PATHS = ['/login', '/register', '/verify-email', '/forget-password'] as const;

export default function Header() {
    const { user, isAuthenticated } = useAuthStore();
    const { cart } = useCartStore();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutateAsync: logout } = useLogout();

    const searchFromUrl = searchParams.get('name') || '';
    const [searchTerm, setSearchTerm] = useState(searchFromUrl);

    useEffect(() => {
        setSearchTerm(searchFromUrl);
    }, [searchFromUrl]);

    const shouldHide = useMemo(
        () => pathname.startsWith('/admin') || HIDDEN_PATHS.includes(pathname as any),
        [pathname]
    );

    const cartCount = useMemo(() => cart?.count ?? 0, [cart?.count]);

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    const accountLinks = useMemo(
        () => [
            { name: 'Hồ sơ của tôi', href: '/profile', icon: User },
            { name: 'Đăng xuất', href: '#', icon: LogOut, onClick: handleLogout },
        ],
        [handleLogout]
    );

    const handleSearch = useCallback(
        (query?: string) => {
            const term = query || searchTerm;
            if (term.trim()) {
                router.push(`/products?name=${encodeURIComponent(term.trim())}`);
            }
        },
        [searchTerm, router]
    );

    const handleSearchKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        },
        [handleSearch]
    );

    const handleSearchClick = useCallback(() => {
        router.push('/products');
    }, [router]);

    if (shouldHide) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 items-center h-16 gap-4">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <span className="text-lg font-bold text-primary-foreground">S</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold leading-none">
                                    <span className="text-primary">Sole</span>
                                    <span className="text-foreground">Mate</span>
                                </span>
                                <span className="text-[10px] leading-none text-muted-foreground">Premium Shoes</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Section - Desktop */}
                    <div className="flex justify-center">
                        <NavigationMenu className="hidden md:flex">
                            <NavigationMenuList>
                                {NAV_LINKS.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <NavigationMenuItem key={link.name}>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={link.href}
                                                    className={cn(
                                                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent data-[active]:text-accent-foreground",
                                                        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                                                    )}
                                                >
                                                    {link.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Actions Section */}
                    <div className="flex items-center justify-end gap-2">
                        {/* Search - Desktop */}
                        <div className="hidden lg:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchTerm}
                                    className="h-9 w-64 pl-9 pr-4 transition-all focus:w-72"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                        </div>

                        {/* Search Button - Mobile/Tablet */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={handleSearchClick}
                        >
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Tìm kiếm</span>
                        </Button>

                        {/* Cart */}
                        <Button variant="ghost" size="icon" asChild className="relative">
                            <Link href="/cart">
                                <ShoppingCart className="h-4 w-4" />
                                {cartCount > 0 && (
                                    <Badge
                                        variant="default"
                                        className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold"
                                    >
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </Badge>
                                )}
                                <span className="sr-only">Giỏ hàng</span>
                            </Link>
                        </Button>

                        {/* User Menu */}
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                                                {user.name?.[0]?.toUpperCase() ?? 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="sr-only">Menu người dùng</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
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
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/login">
                                    <User className="h-4 w-4" />
                                    <span className="sr-only">Đăng nhập</span>
                                </Link>
                            </Button>
                        )}

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Chuyển đổi menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 flex flex-col gap-6">
                                    {/* Navigation */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-muted-foreground">Điều hướng</h3>
                                        <Separator />
                                        <nav className="flex flex-col gap-1">
                                            {NAV_LINKS.map((link) => {
                                                const isActive = pathname === link.href;
                                                return (
                                                    <Link
                                                        key={link.name}
                                                        href={link.href}
                                                        className={cn(
                                                            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                                            isActive
                                                                ? "bg-primary text-primary-foreground"
                                                                : "hover:bg-accent hover:text-accent-foreground"
                                                        )}
                                                    >
                                                        {link.name}
                                                    </Link>
                                                );
                                            })}
                                        </nav>
                                    </div>

                                    {/* Account */}
                                    {isAuthenticated && (
                                        <>
                                            <Separator />
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-semibold text-muted-foreground">Tài khoản</h3>
                                                <Separator />
                                                <div className="flex flex-col gap-1">
                                                    {accountLinks.map((link) => {
                                                        const Icon = link.icon;
                                                        return (
                                                            <Link
                                                                key={link.name}
                                                                href={link.href}
                                                                onClick={link.onClick}
                                                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                                            >
                                                                <Icon className="h-4 w-4" />
                                                                {link.name}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
