'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Bookmark,
    Settings,
    LogOut,
    Trash2
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        {
            label: "Dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            href: "/admin",
        },
        {
            label: "Products",
            icon: <Trash2 className="h-5 w-5" />,
            href: "/admin/products",
            subMenu: [
                { label: "Product List", href: "/admin/products" },
                { label: "History Variants", href: "/admin/products/variants" },
            ],
        },
        {
            label: "Orders",
            icon: <ShoppingCart className="h-5 w-5" />,
            href: "/admin/orders",
        },
        {
            label: "Users",
            icon: <Users className="h-5 w-5" />,
            href: "/admin/users",
        },
        {
            label: "Brands",
            icon: <Bookmark className="h-5 w-5" />,
            href: "/admin/brands",
        },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar Container */}
            <div className="w-64 bg-gray-100 p-4 flex flex-col border-r border-gray-200">

                {/* Logo and Title */}
                <div className="flex items-center mb-8 px-2 py-3">
                    <Trash2 className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold ml-2 text-gray-900">
                        Shoe<span className="text-primary">Admin</span>
                    </h1>
                </div>

                {/* Top Menu Items */}
                <div className="flex flex-col space-y-1 flex-1">
                    {menuItems.map((item) => {

                        let itemIsActive = false;

                        if (item.href === "/admin") {
                            itemIsActive = pathname === "/admin" || pathname === "/admin/";
                        } else {
                            itemIsActive = pathname.startsWith(item.href);
                        }

                        const itemClass = itemIsActive
                            ? 'font-semibold bg-primary/10 text-primary'
                            : 'text-gray-700 hover:bg-gray-100';

                        return (
                            <div key={item.label} className="flex flex-col">
                                <Link
                                    href={item.href}
                                    className={`flex items-center cursor-pointer w-full px-4 py-2 rounded-lg transition duration-150 ${itemClass}`}
                                >
                                    {/* Icon và Label */}
                                    <span className="mr-2">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>

                                {/* Sub Menu (giữ nguyên Link bên trong subMenu) */}
                                {item.subMenu && itemIsActive && (
                                    <div className="flex flex-col pl-6 mt-1 space-y-1 border-l border-gray-200 ml-5">
                                        {item.subMenu.map((sub) => {
                                            const subIsActive = pathname === sub.href;
                                            const subClass = subIsActive
                                                ? 'bg-gray-200 font-semibold text-gray-900'
                                                : 'text-gray-700 hover:bg-gray-100';

                                            return (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    className={`px-3 py-1 rounded text-sm transition duration-150 ${subClass}`}
                                                >
                                                    {sub.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}