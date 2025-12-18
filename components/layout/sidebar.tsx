"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Download,
  AlertTriangle,
  FileCheck,
  Shield,
  Users,
  Plug,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cfdi/emitidos", label: "CFDI Emitidos", icon: FileText },
  { href: "/cfdi/recibidos", label: "CFDI Recibidos", icon: Download },
  { href: "/alertas", label: "Alertas", icon: AlertTriangle },
  { href: "/documentos-legales", label: "Documentos Legales", icon: FileCheck },
  { href: "/validaciones-sat", label: "Validaciones SAT", icon: Shield },
  { href: "/proveedores", label: "Proveedores", icon: Users },
  { href: "/integraciones", label: "Integraciones", icon: Plug },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-background z-30">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary">FiscalGuard</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out relative group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive ? "" : "group-hover:scale-110"
                )} />
                <span className="relative">
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-foreground/30 rounded-full" />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

