'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Bookmark,
    Package,
    ListOrdered,
    MessageSquare,
    CreditCard,
    LogOut,
    User,
    Tag,
    Image as ImageIcon
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function getInitialActive(pathname: string): string {
    if (pathname === "/admin/") {
        return "/admin";
    }
    return pathname;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const { mutate: logout } = useLogout();
    const [activePath, setActivePath] = useState<string>(getInitialActive(pathname));

    // Sync activePath với pathname khi pathname thay đổi
    useEffect(() => {
        setActivePath(getInitialActive(pathname));
    }, [pathname]);

    const menuItems = [
        {
            label: "Thống kê",
            icon: BarChart3,
            href: "/admin",
        },
        {
            label: "Sản phẩm",
            icon: Package,
            subMenu: [
                { label: "Danh sách", href: "/admin/products" },
                { label: "Lịch sử nhập xuất", href: "/admin/products/history" },
            ],
        },
        {
            label: "Người dùng",
            icon: User,
            href: "/admin/users",
        },
        {
            label: "Danh mục",
            icon: ListOrdered,
            href: "/admin/categories",
        },
        {
            label: "Thương hiệu",
            icon: Bookmark,
            href: "/admin/brands",
        },
        {
            label: "Banner",
            icon: ImageIcon,
            href: "/admin/banners",
        },
        {
            label: "Coupons",
            icon: Tag,
            href: "/admin/coupons",
        },
        {
            label: "Thanh toán",
            icon: CreditCard,
            href: "/admin/payments",
        },
        {
            label: "Chat",
            icon: MessageSquare,
            href: "/admin/chat",
        },
    ];

    return (
      <>
        <SidebarProvider>
            <Sidebar 
                collapsible="none" 
                className="fixed left-0 top-0 z-50 w-64 h-screen shadow-xl shadow-black/50 overflow-hidden"
            >
                <SidebarHeader>
                  <Image src="/images/logo.png" alt="logo" width={100} height={100}  className="m-auto h-full"/>
                </SidebarHeader>
                <SidebarContent className="overflow-y-auto">
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
                    <SidebarGroup className="mt-auto">
                        <SidebarGroupContent>
                            <div className="flex items-center gap-3 px-2 py-3">
                                <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                                        {user?.name?.[0]?.toUpperCase() ?? 'AD'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-sm font-medium text-sidebar-foreground truncate">
                                        {user?.name ?? 'Admin'}
                                    </span>
                                    <span className="text-xs text-sidebar-foreground/70 truncate">
                                        {user?.email ?? 'admin@shoeshop.com'}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-sidebar-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => logout()}
                                    title="Đăng xuất"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <main className="ml-64 w-full min-h-screen overflow-auto">
                {children}
            </main>
        </SidebarProvider>
      </>
    )

    
}