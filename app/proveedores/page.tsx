"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { proveedores } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function ProveedoresPage() {
  const [data] = React.useState(proveedores);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(proveedores);

  React.useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredData(
        data.filter(
          (p) =>
            p.rfc.toLowerCase().includes(query) ||
            p.razonSocial.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  const getRiesgoBadge = (riesgo: string) => {
    const variants = {
      bajo: "success",
      medio: "warning",
      alto: "critical",
    } as const;
    return <Badge variant={variants[riesgo as keyof typeof variants]}>{riesgo.toUpperCase()}</Badge>;
  };

  const getSemaforoBadge = (semaforo: string) => {
    const variants = {
      OK: "success",
      Warn: "warning",
      Critical: "critical",
    } as const;
    return <Badge variant={variants[semaforo as keyof typeof variants]}>{semaforo}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y monitorea el riesgo de tus proveedores
          </p>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por RFC o razón social..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de proveedores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((proveedor, idx) => (
            <Card key={proveedor.id} className="hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{proveedor.razonSocial}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{proveedor.rfc}</p>
                  </div>
                  {proveedor.esCritico && (
                    <Badge variant="critical">Crítico</Badge>
                  )}
                  {proveedor.enListaConfianza && (
                    <Badge variant="success">Confianza</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Volumen facturas</span>
                    <span className="font-medium">{proveedor.volumenFacturas}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Riesgo promedio</span>
                    {getRiesgoBadge(proveedor.riesgoPromedio)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Alertas abiertas</span>
                    <span className="font-medium">{proveedor.alertasAbiertas}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Facturas recientes</span>
                    <span className="font-medium">{proveedor.facturasRecientes}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Semáforo alineación</span>
                    {getSemaforoBadge(proveedor.semaforoAlineacion)}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/proveedores/${proveedor.rfc}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      Ver perfil
                    </Button>
                  </Link>
                  {proveedor.esCritico ? (
                    <Button variant="outline" size="icon" title="Quitar de críticos">
                      <Shield className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="icon" title="Marcar como crítico">
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  )}
                  {proveedor.enListaConfianza ? (
                    <Button variant="outline" size="icon" title="Quitar de confianza">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="icon" title="Agregar a lista de confianza">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

