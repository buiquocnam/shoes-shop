import { Metadata } from "next";
import { ReactNode } from "react";
import { SideBarAdmin } from "@/features/admin/components";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
    title: 'Admin Shoes Shop',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <SideBarAdmin />
            <main className="w-full flex-1 min-h-screen bg-background text-foreground transition-colors duration-300">
                {children}
            </main>
        </SidebarProvider>
    );
}
