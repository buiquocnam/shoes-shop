"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DrawerOverlayProps {
  children: React.ReactNode;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
}

/**
 * Drawer overlay component
 * Dùng cho Edit Info và Edit Images
 */
export function DrawerOverlay({
  children,
  title,
  open,
  onOpenChange,
  side = "right",
  className,
}: DrawerOverlayProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn("flex flex-col p-0", className)}
      >
        {/* Header - Fixed */}
        {title && (
          <div className="px-6 pt-6 pb-4 border-b">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

