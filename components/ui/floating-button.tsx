"use client";

import * as React from "react";
import { Plus, HelpCircle } from "lucide-react";
import { Button } from "./button";

interface FloatingButtonProps {
  type?: "nuevo" | "ayuda";
  onClick?: () => void;
}

export function FloatingButton({ type = "nuevo", onClick }: FloatingButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 animate-fade-in">
          <Button
            variant="default"
            size="lg"
            className="shadow-xl gap-2 hover:scale-105 transition-transform duration-200"
            onClick={() => {
              onClick?.();
              setIsOpen(false);
            }}
          >
            <Plus className="h-5 w-5" />
            Nuevo caso
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="shadow-xl gap-2 bg-background hover:scale-105 transition-transform duration-200"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <HelpCircle className="h-5 w-5" />
            Ayuda
          </Button>
        </div>
      )}
      <Button
        size="lg"
        className="rounded-full h-14 w-14 shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          <Plus className="h-6 w-6" />
        </span>
      </Button>
    </div>
  );
}

