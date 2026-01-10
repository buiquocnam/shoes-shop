'use client';

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { NavLinks } from "./header/NavLinks";
import { SearchForm } from "./header/SearchForm";
import { UserMenu } from "./header/UserMenu";
import { MobileNav } from "./header/MobileNav";

export default function Header() {
    const pathname = usePathname();
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const shouldHide = useMemo(
        () => pathname.startsWith('/admin'),
        [pathname]
    );

    if (shouldHide) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
                {/* Left: Logo & Desktop Nav */}
                <div className="flex items-center gap-4 lg:gap-12">
                    <Link
                        href="/"
                        className="flex items-center gap-2 transform transition-transform hover:scale-105"
                    >
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={110}
                            height={36}
                            className="h-8 md:h-10 w-auto object-contain"
                            priority
                            unoptimized
                        />
                    </Link>

                    <NavLinks className="hidden md:flex gap-6 lg:gap-8" />
                </div>

                {/* Right: Search & User Actions */}
                <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
                    {/* Desktop Search */}
                    <SearchForm className="hidden lg:flex max-w-[280px] xl:max-w-xs" />

                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Mobile/Tablet Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden size-10 rounded-full hover:bg-accent"
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        >
                            {isMobileSearchOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Search className="h-5 w-5" />
                            )}
                        </Button>

                        <div className="hidden md:flex items-center">
                            <UserMenu />
                        </div>

                        <MobileNav />
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            <div
                className={cn(
                    "lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-border bg-background",
                    isMobileSearchOpen ? "max-h-20 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
                )}
            >
                <div className="px-4">
                    <SearchForm
                        onSearch={() => setIsMobileSearchOpen(false)}
                        inputClassName="bg-muted/50 border-none shadow-none h-11"
                    />
                </div>
            </div>
        </header>
    );
}
