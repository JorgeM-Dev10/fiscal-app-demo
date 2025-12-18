"use client";

import * as React from "react";
import { Search, Bell, User, ChevronDown, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

export function Topbar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [notifications, setNotifications] = React.useState(5);
  const [showCompanyDropdown, setShowCompanyDropdown] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { addToast } = useToast();

  const companies = ["Empresa ABC S.A. de C.V.", "Comercial XYZ S.A.", "Servicios Tecnológicos S.C."];

  const handleSync = async () => {
    setIsSyncing(true);
    addToast("Sincronizando datos...", "info");
    
    // Simular sincronización
    setTimeout(() => {
      setIsSyncing(false);
      addToast("Sincronización completada", "success");
      setNotifications((prev) => prev + 1);
    }, 2000);
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 border-b bg-background z-20">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar CFDI, proveedor, UUID, concepto…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus:shadow-lg"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2"
          >
            {isSyncing ? (
              <>
                <Spinner size="sm" />
                <span className="hidden sm:inline">Sincronizando...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Sincronizar ahora</span>
              </>
            )}
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotifications(0)}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </Button>
          </div>

          <div className="relative">
            <div
              className="relative flex items-center gap-2 cursor-pointer"
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
            >
              <span className="text-sm font-medium">{companies[0]}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            {showCompanyDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCompanyDropdown(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-64 bg-background border rounded-md shadow-lg z-20">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                      Empresas
                    </div>
                    {companies.map((company, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent"
                        onClick={() => setShowCompanyDropdown(false)}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                JD
              </div>
            </Button>
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-20">
                  <div className="p-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      Mi cuenta
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Roles
                    </button>
                    <div className="border-t my-1" />
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent text-red-600"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
