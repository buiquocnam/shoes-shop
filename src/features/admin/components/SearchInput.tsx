"use client";

import { useState, useEffect, memo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearch: (value?: string) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  withContainer?: boolean;
}

export const SearchInput = memo(function SearchInput({
  onSearch,
  defaultValue = "",
  placeholder = "Tìm kiếm...",
  className,
  withContainer = false,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(value || undefined);
    }

  };

  const input = (
    <div className={`relative ${className || "w-full max-w-md"}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="h-10 w-full rounded-lg bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );

  if (withContainer) {
    return (
      <div className="grid gap-4 rounded-xl bg-card p-4 shadow-sm md:flex md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {input}
        </div>
      </div>
    );
  }

  return input;
});

