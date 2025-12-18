"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Drawer({ open, onClose, title, children, side = "right", size = "md" }: DrawerProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed z-50 bg-background border shadow-2xl transition-transform duration-300 ease-out animate-slide-in",
          side === "right" ? "right-0 top-0 bottom-0" : "left-0 top-0 bottom-0",
          {
            "w-96": size === "sm",
            "w-[500px]": size === "md",
            "w-[600px]": size === "lg",
            "w-[800px]": size === "xl",
          }
        )}
      >
        <div className="flex flex-col h-full">
          {(title || true) && (
            <div className="flex items-center justify-between p-4 border-b">
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </>
  );
}

