'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Bookmark,
    Package,
    ChevronRight,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
        },
        {
            label: "Products",
            icon: Package,
            href: "/admin/products",
            subMenu: [
                { label: "Product List", href: "/admin/products" },
                { label: "History Variants", href: "/admin/products/variants" },
            ],
        },
        {
            label: "Orders",
            icon: ShoppingCart,
            href: "/admin/orders",
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
                                        const isActive = item.href === "/admin"
                                            ? pathname === "/admin" || pathname === "/admin/"
                                            : pathname.startsWith(item.href);
                                        const hasSubMenu = item.subMenu && item.subMenu.length > 0;

                                        if (hasSubMenu) {
                                            return (
                                                <Collapsible
                                                    key={item.label}
                                                    asChild
                                                    defaultOpen={isActive}
                                                >
                                                    <SidebarMenuItem>
                                                        <SidebarMenuButton
                                                            asChild
                                                            isActive={isActive}
                                                        >
                                                            <Link href={item.href}>
                                                                <Icon />
                                                                <span>{item.label}</span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                        <CollapsibleTrigger asChild>
                                                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                                <ChevronRight />
                                                                <span className="sr-only">Toggle</span>
                                                            </SidebarMenuAction>
                                                        </CollapsibleTrigger>
                                                        <CollapsibleContent>
                                                            <SidebarMenuSub>
                                                                {item.subMenu.map((sub) => {
                                                                    const subIsActive = pathname === sub.href;
                                                                    return (
                                                                        <SidebarMenuSubItem key={sub.label}>
                                                                            <SidebarMenuSubButton
                                                                                asChild
                                                                                isActive={subIsActive}
                                                                            >
                                                                                <Link href={sub.href}>
                                                                                    <span>{sub.label}</span>
                                                                                </Link>
                                                                            </SidebarMenuSubButton>
                                                                        </SidebarMenuSubItem>
                                                                    );
                                                                })}
                                                            </SidebarMenuSub>
                                                        </CollapsibleContent>
                                                    </SidebarMenuItem>
                                                </Collapsible>
                                            );
                                        }

                                        return (
                                            <SidebarMenuItem key={item.label}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isActive}
                                                >
                                                    <Link href={item.href}>
                                                        <Icon />
                                                        <span>{item.label}</span>
                                                    </Link>
                                                </SidebarMenuButton>
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