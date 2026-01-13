"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { useLogout } from "@/features/auth"
import { Button } from "@/components/ui/button"

const items = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
    },
    {
        title: "Products",
        url: "#",
        subItems: [
            { title: "All Products", url: "/admin/products" },
            { title: "History Variants", url: "/admin/products/history" },
        ],
    },
    {
        title: "Categories",
        url: "/admin/categories",
    },
    {
        title: "Brands",
        url: "/admin/brands",
    },
    {
        title: "Users",
        url: "/admin/users",
    },
    {
        title: "Banners",
        url: "/admin/banners",
    },
    {
        title: "Coupons",
        url: "/admin/coupons",
    },
    {
        title: "Payments",
        url: "/admin/payments",
    },
    {
        title: "Chat",
        url: "/admin/chat",
    },
]

export function SideBarAdmin() {
    const { mutateAsync: logout } = useLogout();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader >
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    className="mx-auto h-10 w-auto object-contain p-2"
                    width={110}
                    height={36}
                    unoptimized
                />
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {/* Item cha */}
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <span className="font-semibold">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>

                                    {/* Sub menu */}
                                    {item.subItems && (
                                        <SidebarMenuSub>
                                            {item.subItems.map((sub) => (
                                                <SidebarMenuSubItem key={sub.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={sub.url}>
                                                            <span>{sub.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>
                <Button variant="destructive" onClick={() => logout()}>Đăng xuất</Button>
            </SidebarFooter>
        </Sidebar>
    )
}
