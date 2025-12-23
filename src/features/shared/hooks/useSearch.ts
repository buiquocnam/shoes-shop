"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";

export function useSearch(
  valueFromUrl: string,
  onSearch: (value?: string) => void
) {
  const [value, setValue] = useState(valueFromUrl);
  const debounced = useDebounce(value, 500);
  
  useEffect(() => {
    if (debounced !== valueFromUrl) {
      onSearch(debounced || undefined);
    }
  }, [debounced, valueFromUrl, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, onEnter?: (value: string) => void) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter(value);
    }
  }, [value]);

  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value),
    onKeyDown: handleKeyDown,
  };
}

