"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { ToastProvider } from "@/components/ui/toast";
import { FloatingButton } from "@/components/ui/floating-button";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Topbar />
          <main className="flex-1 overflow-y-auto mt-16 p-6 bg-gray-50/50">
            {children}
          </main>
        </div>
      </div>
      <FloatingButton />
    </ToastProvider>
  );
}

