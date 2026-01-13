"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 px-2 flex items-center gap-2 hover:bg-accent rounded-full transition-colors">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground uppercase">
                        {locale}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLocale('vi')} className={cn("hover:bg-accent", locale === 'vi' && 'bg-accent')}>
                    Tiếng Việt 
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale('en')} className={cn("hover:bg-accent", locale === 'en' && 'bg-accent')}>
                    English 
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
