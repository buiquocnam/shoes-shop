'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Bookmark,
    Package,
    ListOrdered,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
} from "@/components/ui/sidebar";

function getInitialActive(pathname: string): string {
    if (pathname === "/admin/") {
        return "/admin";
    }
    return pathname;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [activePath, setActivePath] = useState<string>(getInitialActive(pathname));

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
        },
        {
            label: "Products",
            icon: Package,
            subMenu: [
                { label: "Product List", href: "/admin/products" },
                { label: "History Variants", href: "/admin/products/variants" },
            ],
        },
        {
            label: "Categories",
            icon: ListOrdered,
            href: "/admin/categories",
        },
        {
            label: "Users",
            icon: Users,
            href: "/admin/users",
        },
        {
            label: "Brands",
            icon: Bookmark,
            href: "/admin/brands",
        },
    ];

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full mx-auto">
                <Sidebar collapsible="none" className="w-64 border-r">
                    <SidebarHeader>
                        <div className="flex items-center gap-2 px-2 py-2">
                            <Package className="h-6 w-6 text-primary" />
                            <h1 className="text-lg font-semibold">
                                Shoe<span className="text-primary">Admin</span>
                            </h1>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const hasSubMenu = item.subMenu && item.subMenu.length > 0;
                                        const isActive = hasSubMenu
                                            ? item.subMenu.some(sub => activePath === sub.href)
                                            : activePath === item.href;

                                        return (
                                            <SidebarMenuItem key={item.label}>
                                                <SidebarMenuButton
                                                    asChild={!hasSubMenu}
                                                    isActive={isActive}
                                                >
                                                    {hasSubMenu ? (
                                                        <div className="flex items-center gap-2 w-full">
                                                            <Icon />
                                                            <span>{item.label}</span>
                                                        </div>
                                                    ) : (
                                                        item.href && (
                                                            <Link
                                                                href={item.href}
                                                                onClick={() => {
                                                                    setActivePath(item.href!);
                                                                }}
                                                            >
                                                                <Icon />
                                                                <span>{item.label}</span>
                                                            </Link>
                                                        )
                                                    )}
                                                </SidebarMenuButton>
                                                {hasSubMenu && (
                                                    <SidebarMenuSub>
                                                        {item.subMenu.map((sub) => {
                                                            const subIsActive = activePath === sub.href;
                                                            return (
                                                                <SidebarMenuSubItem key={sub.label}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={subIsActive}
                                                                    >
                                                                        <Link
                                                                            href={sub.href}
                                                                            onClick={() => {
                                                                                setActivePath(sub.href);
                                                                            }}
                                                                        >
                                                                            <span>{sub.label}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        })}
                                                    </SidebarMenuSub>
                                                )}
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}