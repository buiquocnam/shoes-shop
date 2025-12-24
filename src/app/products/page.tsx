"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import Sidebar from "@/features/product/components/Sidebar";
import ProductList from "@/features/product/components/ProductList";
import ProductListLoading from "@/features/product/components/ProductList/ProductListLoading";

export default function ProductPage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <div className="w-full mx-auto px-8 py-4 md:py-8">
                {/* Mobile Filter Button */}
                <div className="md:hidden mb-4">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Filter className="w-4 h-4" />
                                Bộ lọc sản phẩm
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 overflow-y-auto">
                            <SheetHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
                                <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                            </SheetHeader>
                            <div className="px-6 py-4">
                                <Sidebar />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Layout */}
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-8">
                    {/* Desktop Sidebar - Hidden on mobile */}
                    <aside className="hidden md:block">
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
    );
}
