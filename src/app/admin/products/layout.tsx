"use client";

import { ReactNode } from "react";

/**
 * Layout cho admin products
 * Đơn giản hóa sau khi chuyển từ parallel routes sang real routes
 */
export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
