'use client';

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface NavLinksProps {
    className?: string;
    itemClassName?: string;
    activeClassName?: string;
}

export function NavLinks({ className, itemClassName, activeClassName }: NavLinksProps) {
    const t = useTranslations('Header');
    const pathname = usePathname();

    const NAV_LINKS = useMemo(() => [
        { name: t('nav.home'), href: '/' },
        { name: t('nav.products'), href: '/products' },
        { name: t('nav.contact'), href: '/contact' },
    ], [t]);

    return (
        <nav className={cn("flex items-center", className)}>
            {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={cn(
                            "text-foreground text-sm font-bold transition-colors uppercase",
                            itemClassName,
                            isActive
                                ? cn("text-primary", activeClassName)
                                : "hover:text-primary"
                        )}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}
