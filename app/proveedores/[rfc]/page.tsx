"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { proveedores, cfdiRecibidos } from "@/mock/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProveedorDetailPage() {
  const params = useParams();
  const proveedor = proveedores.find((p) => p.rfc === params.rfc);
  const facturasProveedor = cfdiRecibidos.filter(
    (cfdi) => cfdi.proveedor.rfc === params.rfc
  ).slice(0, 5);

  if (!proveedor) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Proveedor no encontrado</p>
          <Link href="/proveedores">
            <Button variant="outline" className="mt-4">
              Volver a la lista
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

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
        <div className="flex items-center gap-4">
          <Link href="/proveedores">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{proveedor.razonSocial}</h1>
            <p className="text-muted-foreground mt-1">RFC: {proveedor.rfc}</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Volumen facturas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proveedor.volumenFacturas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Riesgo promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2">{getRiesgoBadge(proveedor.riesgoPromedio)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Alertas abiertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{proveedor.alertasAbiertas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Semáforo alineación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2">{getSemaforoBadge(proveedor.semaforoAlineacion)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Facturas recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Facturas recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {facturasProveedor.map((cfdi) => (
                  <div
                    key={cfdi.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div>
                      <p className="text-sm font-medium">{formatCurrency(cfdi.total)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(cfdi.fecha)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cfdi.estatus === "OK" ? (
                        <Badge variant="success">OK</Badge>
                      ) : (
                        <Badge variant={cfdi.estatus === "Critical" ? "critical" : "warning"}>
                          {cfdi.estatus}
                        </Badge>
                      )}
                      <Link href={`/cfdi/recibidos/${cfdi.id}`}>
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas relacionadas</CardTitle>
            </CardHeader>
            <CardContent>
              {proveedor.alertasAbiertas > 0 ? (
                <div className="space-y-3">
                  {Array.from({ length: Math.min(proveedor.alertasAbiertas, 5) }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 border rounded-md"
                    >
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Alerta #{idx + 1}</p>
                        <p className="text-xs text-muted-foreground">Requiere revisión</p>
                      </div>
                      <Badge variant="warning">Pendiente</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No hay alertas abiertas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Acciones */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {proveedor.esCritico ? (
                <Button variant="outline" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Quitar de críticos
                </Button>
              ) : (
                <Button variant="outline" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Marcar como crítico
                </Button>
              )}
              {proveedor.enListaConfianza ? (
                <Button variant="outline" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Quitar de lista de confianza
                </Button>
              ) : (
                <Button variant="outline" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Agregar a lista de confianza
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

