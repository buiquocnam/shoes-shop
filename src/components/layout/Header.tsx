'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { User, ShoppingCart, LogOut, Search, Menu, ArrowRight } from "lucide-react";
import { useAuthStore, useIsAuthenticated } from "@/store/useAuthStore";
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
import Image from "next/image";

const NAV_LINKS = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Liên hệ', href: '/contact' },
] as const;


export default function Header() {
    const { user } = useAuthStore();
    const isAuthenticated = useIsAuthenticated();
    const { cart } = useCartStore();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutateAsync: logout } = useLogout();

    const searchFromUrl = searchParams.get('name') || searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(searchFromUrl);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    useEffect(() => {
        setSearchTerm(searchFromUrl);
    }, [searchFromUrl]);

    const shouldHide = useMemo(
        () => pathname.startsWith('/admin') ,
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

    if (shouldHide) {
        return null;
    }

    return (
        <>
            {/* Header Main */}
            <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4 md:gap-8">
                    {/* Left Section: Logo + Navigation */}
                    <div className="flex items-center gap-4 lg:gap-10">
                        <Link
                            href="/"
                            className="flex items-center gap-2 md:gap-3 text-slate-900 group"
                        >
                            <Image
                                src="/images/logo.png"
                                alt="Logo"
                                width={100}
                                height={33}
                                className="h-8 md:h-10 w-auto object-contain group-hover:opacity-80 transition-opacity"
                                priority
                                unoptimized
                            />
                        </Link>
                        <nav className="hidden md:flex items-center gap-4 lg:gap-8">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "text-slate-900 text-sm font-bold transition-colors uppercase ",
                                            isActive
                                                ? "text-primary"
                                                : "hover:text-primary"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Section: Search + Actions */}
                    <div className="flex flex-1 justify-end items-center gap-2 md:gap-6">
                        {/* Desktop Search */}
                        <div className="hidden lg:flex w-full max-w-sm relative">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 z-10">
                                    <Search className="h-5 w-5" />
                                </div>
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    className="w-full bg-white border-border rounded-full py-2.5 pl-11 pr-4 shadow-sm"
                                    placeholder="Tìm kiếm sản phẩm..."
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 md:gap-3">
                            {/* Mobile Search Toggle */}
                            <Button
                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                variant="ghost"
                                size="icon"
                                className="lg:hidden size-10 rounded-full hover:bg-slate-100 text-slate-900"
                            >
                                {isMobileSearchOpen ? (
                                    <span className="text-xl">✕</span>
                                ) : (
                                    <Search className="h-5 w-5" />
                                )}
                            </Button>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 text-slate-900 transition-colors relative"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute top-2 right-2 size-2 bg-primary rounded-full"></span>
                                )}
                            </Link>

                            {/* User Account */}
                            {isAuthenticated && user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 md:size-10 rounded-full border-2 border-slate-200 ml-1 overflow-hidden p-0"
                                        >
                                            <Avatar className="size-full">
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
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
                                <Button
                                    onClick={() => router.push('/login')}
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full hover:bg-slate-100 text-slate-900"
                                >
                                    <User className="h-5 w-5" />
                                </Button>
                            )}

                            {/* Mobile Menu */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="lg:hidden size-10 rounded-full text-gray-700 hover:bg-gray-100"
                                    >
                                        <Menu className="h-5 w-5" />
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
                                                                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors uppercase ",
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

            {/* Mobile Search Overlay */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100 bg-white ${isMobileSearchOpen ? 'max-h-20 opacity-100 py-3' : 'max-h-0 opacity-0 py-0'}`}>
                <div className="px-4">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 z-10">
                            <Search className="h-5 w-5" />
                        </div>
                        <Input
                            autoFocus={isMobileSearchOpen}
                            type="text"
                            autoComplete="off"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full bg-slate-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                            placeholder="Tìm kiếm sản phẩm..."
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
