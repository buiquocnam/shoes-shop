"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Sidebar, ProductList, ProductListLoading } from "@/features/product/components";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

export function ProductPageClient() {
    const t = useTranslations('Products');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background w-full">
                <div className="w-full mx-auto px-4 md:px-8 py-4 md:py-8">
                    {/* Mobile Filter Button */}
                    <div className="md:hidden mb-4">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Filter className="w-4 h-4" />
                                    {t('filter')}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 overflow-y-auto">
                                <SheetHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
                                    <SheetTitle>{t('filter')}</SheetTitle>
                                </SheetHeader>
                                <div className="px-6 py-4">
                                    <Sidebar />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-8 items-start">
                        {/* Desktop Sidebar - Hidden on mobile */}
                        <aside className="hidden md:block sticky top-8">
                            <Sidebar />
                        </aside>

                        {/* Main Content */}
                        <main className="min-w-0">
                            <Suspense fallback={<ProductListLoading />}>
                                <ProductList />
                            </Suspense>
                        </main>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
