'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchFormProps {
    className?: string;
    inputClassName?: string;
    onSearch?: () => void;
}

export function SearchForm({ className, inputClassName, onSearch }: SearchFormProps) {
    const t = useTranslations('Header');
    const router = useRouter();
    const searchParams = useSearchParams();

    const searchFromUrl = searchParams.get('name') || searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(searchFromUrl);

    useEffect(() => {
        setSearchTerm(searchFromUrl);
    }, [searchFromUrl]);

    const handleSearch = useCallback((query?: string) => {
        const term = query || searchTerm;
        if (term.trim()) {
            router.push(`/products?name=${encodeURIComponent(term.trim())}`);
            onSearch?.();
        }
    }, [searchTerm, router, onSearch]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={cn("relative w-full", className)}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground z-10">
                <Search className="h-4 w-4 md:h-5 w-5" />
            </div>
            <Input
                type="text"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                    "w-full bg-background border-border rounded-full py-2 pl-10 md:pl-11 pr-4 shadow-sm h-10 md:h-11 text-sm md:text-base transition-all focus-visible:ring-primary focus-visible:border-primary",
                    inputClassName
                )}
                placeholder={t('search.placeholder')}
            />
        </div>
    );
}
