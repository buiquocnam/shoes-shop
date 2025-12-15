// src/features/admin/hooks/useUpdateSearchParams.ts
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export const useUpdateParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (params: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        sp.delete(key);
      } else {
        sp.set(key, String(value));
      }
    });

    router.push(`?${sp.toString()}`);
  };
};
