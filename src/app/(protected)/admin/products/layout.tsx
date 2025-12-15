"use client";

import { ReactNode } from "react";

interface ProductsLayoutProps {
  children: ReactNode;
  overlay: ReactNode;
}

/**
 * Layout cho admin products với parallel route @overlay
 * Cho phép hiển thị overlay (drawer/fullscreen) mà không làm mất product list
 */
export default function ProductsLayout({ children, overlay }: ProductsLayoutProps) {
  return (
    <>
      {children}
      {overlay}
    </>
  );
}


