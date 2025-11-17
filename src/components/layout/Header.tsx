'use client';

import Link from "next/link";
import { User, ShoppingCartIcon, Search, Heart, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { clearAuthCookies } from "@/lib/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; 
import { Role } from "@/types/global";
import { useCartStore } from "@/store/useCartStore";
import { usePathname } from "next/navigation";

// Giả định màu 'primary' được định nghĩa trong tailwind.config.js 
// tương đương với màu đỏ sẫm (burgundy) của thương hiệu.

const Header = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const isAdmin = user?.role === Role.ADMIN;
    const createHref = isAdmin ? '/admin' : '/profile';
    const { cart } = useCartStore();
    const pathname = usePathname();

    if( pathname.startsWith('/admin')) {
        return null;
    }
    
    const handleLogout = async () => {
        await clearAuthCookies();
        logout();

        window.location.href = '/';
    };

    // --- MOCK Component cho Avatar User (theo hình) ---
    const UserAvatarPlaceholder = ({ userName }: { userName: string | undefined }) => {
        const initial = userName ? userName[0].toUpperCase() : 'U';
        return (
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center cursor-pointer transition-shadow hover:shadow-md">
                <span className="text-sm font-semibold text-gray-800">{initial}</span>
            </div>
        );
    };

    // --- Tái cấu trúc Navbar links ---
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shoes', href: '/products' },
        { name: 'Contact', href: '/contact' },
    ];

    // --- Tái cấu trúc User Menu Item ---
    const UserDropdown = ({ user, isAdmin, createHref, handleLogout }: { user: any, isAdmin: boolean, createHref: string, handleLogout: () => void }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full transition-colors duration-150 hover:bg-gray-100">
                    <UserAvatarPlaceholder userName={user.name} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild> 
                        <Link href={createHref} className="flex items-center gap-2 w-full cursor-pointer">
                            <User className="w-4 h-4 text-gray-700" />
                            <span>{isAdmin ? 'Admin Dashboard' : 'My Profile'}</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    // --- Tái cấu trúc Icon Button ---
    const IconButton = ({ children, href, count }: { children: React.ReactNode, href: string, count?: number }) => (
        <Link href={href} className="relative p-2 rounded-full bg-gray-50 transition-colors duration-150 hover:bg-gray-100">
            {children}
            {((count ?? 0) > 0) && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
                    {count! > 9 ? '9+' : count!}
                </span>
            )}
        </Link>
    );

    return (
        <header className="bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center h-16">
                
                {/* LOGO - Tái tạo SoleMate */}
                <Link href="/">
                    <div className="flex items-center gap-1">
                        {/* Biểu tượng logo sử dụng màu primary */}
                        <svg className="w-6 h-6 fill-primary" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                        </svg>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            <span className="text-primary">Sole</span>Mate
                        </h1>
                    </div>
                </Link>

                {/* NAVIGATION (Center) */}
                <nav className="hidden md:block">
                    <ul className="flex gap-8">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link 
                                    href={link.href} 
                                    className="text-base font-medium text-gray-700 hover:text-primary transition duration-150"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* ICONS (Right) */}
                <div className="flex items-center gap-2">
                    {/* Search Icon */}
                    <IconButton href="/search">
                        <Search className="w-5 h-5 text-gray-700" />
                    </IconButton>

                    {/* Wishlist Icon */}
                    <IconButton href="/wishlist">
                        <Heart className="w-5 h-5 text-gray-700" />
                    </IconButton>

                    {/* Cart Icon */}
                    <IconButton href="/cart" count={cart?.count}>
                        <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
                    </IconButton>

                    {/* User Icon/Avatar */}
                    {isAuthenticated && user ? (
                        <UserDropdown user={user} isAdmin={isAdmin} createHref={createHref} handleLogout={handleLogout} />
                    ) : (
                        <IconButton href="/login">
                            <User className="w-5 h-5 text-gray-700" />
                        </IconButton>
                    )}
                </div>
            </div>
        </header>
    );
};
export default Header;