"use client";

import { useState, useEffect, memo } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/features/shared/hooks/useDebounce";

interface SearchInputProps {
  onSearch: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export const SearchInput = memo(function SearchInput({
  onSearch,
  defaultValue = "",
  placeholder = "Tìm kiếm...",
  className = "w-64",
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);
  const debounced = useDebounce(value, 500);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (debounced !== defaultValue) {
      onSearch(debounced);
    }
  }, [debounced, defaultValue, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(value);
    }
  };

  return (
    <Input
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
});

