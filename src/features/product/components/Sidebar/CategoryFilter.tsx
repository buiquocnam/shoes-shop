"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { CategoryType } from "@/features/product/types";
import { useTranslations } from "next-intl";

interface CategoryFilterProps {
    categories: CategoryType[];
    isLoadingCategories: boolean;
    selectedCategoryId: string;
    setSelectedCategoryId: (id: string) => void;
}

export function CategoryFilter({
    categories,
    isLoadingCategories,
    selectedCategoryId,
    setSelectedCategoryId,
}: CategoryFilterProps) {
    const t = useTranslations('Sidebar');

    return (
        <div className="flex flex-col gap-2">
            {isLoadingCategories && categories.length === 0 ? (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full rounded-md" />
                    ))}
                </div>
            ) : (
                <>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={selectedCategoryId === ""}
                                onClick={() => setSelectedCategoryId("")}
                                className={cn(
                                    "w-full justify-start font-medium text-sm transition-colors rounded-lg",
                                    selectedCategoryId === ""
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent"
                                )}
                            >
                                {t('allCategories')}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        {categories.map((category) => (
                            <SidebarMenuItem key={category.id}>
                                <SidebarMenuButton
                                    isActive={selectedCategoryId === category.id}
                                    onClick={() => setSelectedCategoryId(category.id)}
                                    className={cn(
                                        "w-full justify-start font-medium text-sm transition-colors rounded-lg",
                                        selectedCategoryId === category.id
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent"
                                    )}
                                >
                                    {category.name}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </>
            )}
        </div>
    );
}
