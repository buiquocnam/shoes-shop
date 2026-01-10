"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export type SortOption = {
  value: string;
  labelKey: string;
  sort_by?: string;
};

export default function SortSelect() {
  const t = useTranslations('Products.sort');
  const router = useRouter();
  const searchParams = useSearchParams();

  const SORT_OPTIONS: SortOption[] = useMemo(() => [
    { value: "countSell", labelKey: "bestSelling", sort_by: "countSell" },
    { value: "asc", labelKey: "oldest", sort_by: "asc" },
    { value: "desc", labelKey: "newest", sort_by: "desc" },
  ], []);

  const currentSort = useMemo(() => {
    const sortBy = searchParams.get("sort_by");

    if (!sortBy) {
      return "countSell"; // Default to "Bán chạy"
    }

    const option = SORT_OPTIONS.find((opt) => opt.sort_by === sortBy);

    return option?.value || "countSell";
  }, [searchParams, SORT_OPTIONS]);

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    const params = new URLSearchParams(searchParams.toString());

    if (option?.sort_by) {
      params.set("sort_by", option.sort_by);
    }

    // Remove sort_order if exists
    params.delete("sort_order");

    // Reset to page 1 when sorting changes
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === currentSort);
  const currentLabel = currentOption ? t(currentOption.labelKey) : t('bestSelling');

  return (
    <div className="relative group">
      <Select value={currentSort} onValueChange={handleSortChange} >
        <SelectTrigger className="flex items-center bg-card gap-2 px-4 py-2 rounded-full cursor-pointer">
          <span>
            {t('label')} <span className="text-primary font-bold">{currentLabel}</span>
          </span>
        </SelectTrigger>
        <SelectContent className="bg-card border-none">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="cursor-pointer">
              {t(option.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

