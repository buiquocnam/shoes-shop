'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, ShoppingCartIcon, LogOut, Search, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/hooks/useLogout";

const navLinks: { name: string; href: string }[] = [
    { name: 'Home', href: '/' },
    { name: 'Shoes', href: '/products' },
    { name: 'Contact', href: '/contact' },
];


const NavLinks = ({ className, onLinkClick }: { className?: string; onLinkClick?: () => void }) => {
    const pathname = usePathname();

    return (
        <>
            {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <NavigationMenuItem key={link.name}>
                        <Link
                            href={link.href}
                            onClick={onLinkClick}
                            className={cn(
                                navigationMenuTriggerStyle(),
                                "text-sm sm:text-base",
                                isActive && "text-primary bg-primary/10",
                                className
                            )}
                        >
                            {link.name}
                        </Link>
                    </NavigationMenuItem>
                );
            })}
        </>
    );
};

const Header = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { cart } = useCartStore();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutateAsync: logout } = useLogout();

    const searchFromUrl = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(searchFromUrl);

    useEffect(() => {
        setSearchTerm(searchFromUrl);
    }, [searchFromUrl]);

    const hiddenPaths = ['/login', '/register', '/verify-email', '/forget-password'];
    if (pathname.startsWith('/admin') || hiddenPaths.includes(pathname)) {
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    const accountLinks = [
        { name: 'My Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
        { name: 'Logout', href: '#', icon: <LogOut className="w-4 h-4" />, onClick: handleLogout },
    ];

    const handleSearch = (query?: string) => {
        const term = query || searchTerm;
        if (term.trim()) {
            router.push(`/products?search=${encodeURIComponent(term.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };


    return (
        <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
                <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center gap-2 sm:gap-4 min-h-[3.5rem] sm:min-h-[4rem]">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-primary" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                        </svg>
                        <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                            <span className="text-primary">Sole</span>Mate
                        </h1>
                    </Link>

                    {/* NAVIGATION - Center (PC) */}
                    <NavigationMenu className="hidden md:flex justify-self-center align-center">
                        <NavigationMenuList className=" w-full">
                            <NavLinks />
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
                        {/* Search Input với Popover - Desktop */}
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            className="h-9 w-48 xl:w-64 pr-3 text-sm border border-gray-200 rounded-md bg-background focus:outline-none focus:ring-0"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        {/* Search Icon - Mobile/Tablet */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => router.push('/products')}
                        >
                            <Search className="h-4 w-4" />
                        </Button>

                        {/* Cart - Dùng Button + Badge */}
                        <Button variant="ghost" size="icon" asChild className="relative">
                            <Link href="/cart">
                                <ShoppingCartIcon className="h-4 w-4" />
                                {cart?.count && cart.count > 0 && (
                                    <Badge
                                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs "
                                    >
                                        {cart.count > 9 ? '9+' : cart.count}
                                    </Badge>
                                )}
                            </Link>
                        </Button>

                        {/* User - Dùng Avatar */}
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                            <AvatarFallback className="bg-orange-100 text-gray-800">
                                                {user.name?.[0]?.toUpperCase() ?? 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" sideOffset={8} className="w-48">
                                    <DropdownMenuGroup>
                                        {accountLinks.map((link) => (
                                            <DropdownMenuItem
                                                key={link.name}
                                                asChild={!link.onClick}
                                                onClick={link.onClick}
                                            >
                                                <Link href={link.href} onClick={link?.onClick ? link.onClick : undefined} className="flex items-center gap-2 cursor-pointer w-full">
                                                    {link.icon}
                                                    <span>{link.name}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/login">
                                    <User className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation - Dùng chung NavLinks component */}
                <nav className="md:hidden border-t border-gray-200 pt-2 mt-2">
                    <NavigationMenu className="flex justify-center align-center w-full" >
                        <NavigationMenuList className="flex justify-center align-center w-full">
                            <NavLinks />
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>
            </div>
        </header>
    );
};

export default Header;