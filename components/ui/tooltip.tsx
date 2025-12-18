"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={cn(
            "absolute z-50 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap",
            {
              "bottom-full left-1/2 -translate-x-1/2 mb-2": side === "top",
              "top-full left-1/2 -translate-x-1/2 mt-2": side === "bottom",
              "right-full top-1/2 -translate-y-1/2 mr-2": side === "left",
              "left-full top-1/2 -translate-y-1/2 ml-2": side === "right",
            }
          )}
        >
          {content}
          <div
            className={cn("absolute w-2 h-2 bg-gray-900 rotate-45", {
              "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2": side === "top",
              "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2": side === "bottom",
              "right-0 top-1/2 -translate-y-1/2 translate-x-1/2": side === "left",
              "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2": side === "right",
            })}
          />
        </div>
      )}
    </div>
  );
}

