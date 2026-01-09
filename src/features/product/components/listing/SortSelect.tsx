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

export type SortOption = {
  value: string;
  label: string;
  sort_by?: string;
};

const SORT_OPTIONS: SortOption[] = [
  { value: "countSell", label: "Bán chạy", sort_by: "countSell" },
  { value: "asc", label: "Cũ", sort_by: "asc" },
  { value: "desc", label: "Mới", sort_by: "desc" },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = useMemo(() => {
    const sortBy = searchParams.get("sort_by");

    if (!sortBy) {
      return "countSell"; // Default to "Bán chạy"
    }

    const option = SORT_OPTIONS.find((opt) => opt.sort_by === sortBy);

    return option?.value || "countSell";
  }, [searchParams]);

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

  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Bán chạy";

  return (
    <div className="relative group">
      <Select value={currentSort} onValueChange={handleSortChange} >
        <SelectTrigger className="flex items-center bg-white gap-2 px-4 py-2 rounded-full cursor-pointer">
          <span>
            Sắp xếp theo: <span className="text-primary font-bold">{currentLabel}</span>
          </span>
        </SelectTrigger>
        <SelectContent className="bg-white border-none">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="cursor-pointer">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

