"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FullscreenOverlayProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  className?: string;
}

/**
 * Fullscreen overlay component
 * Dùng cho Create Product và Edit Variants
 */
export function FullscreenOverlay({
  children,
  title,
  onClose,
  className,
}: FullscreenOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background",
        "animate-in fade-in-0",
        className
      )}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          {title && (
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto max-w-6xl p-6">{children}</div>
      </div>
    </div>
  );
}

















