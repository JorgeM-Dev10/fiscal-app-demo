"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cfdiRecibidos } from "@/mock/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CFDIRecibidoDetailPage() {
  const params = useParams();
  const cfdi = cfdiRecibidos.find((c) => c.id === params.id);

  if (!cfdi) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">CFDI no encontrado</p>
          <Link href="/cfdi/recibidos">
            <Button variant="outline" className="mt-4">
              Volver a la lista
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const getStatusBadge = (estatus: string) => {
    const variants = {
      OK: "success",
      Warn: "warning",
      Critical: "critical",
    } as const;
    return <Badge variant={variants[estatus as keyof typeof variants]}>{estatus}</Badge>;
  };

  const getRiesgoBadge = (riesgo: string) => {
    const variants = {
      bajo: "success",
      medio: "warning",
      alto: "critical",
    } as const;
    return <Badge variant={variants[riesgo as keyof typeof variants]}>{riesgo.toUpperCase()}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/cfdi/recibidos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Detalle CFDI Recibido</h1>
            <p className="text-muted-foreground mt-1">UUID: {cfdi.uuid}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Resumen */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datos generales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha y hora</label>
                  <p className="text-sm">{formatDate(cfdi.fecha)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
                  <p className="text-sm font-medium">{cfdi.proveedor.razonSocial}</p>
                  <p className="text-xs text-muted-foreground">{cfdi.proveedor.rfc}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">UUID</label>
                  <p className="text-sm font-mono">{cfdi.uuid}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <p className="text-sm">{cfdi.tipo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estatus</label>
                  <div className="mt-1">{getStatusBadge(cfdi.estatus)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Riesgo</label>
                  <div className="mt-1">{getRiesgoBadge(cfdi.riesgo)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impuestos detectados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">{formatCurrency(cfdi.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">IVA (16%)</span>
                  <span className="text-sm font-medium">{formatCurrency(cfdi.impuestos)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">{formatCurrency(cfdi.total)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consistencia concepto vs clave SAT</CardTitle>
              </CardHeader>
              <CardContent>
                {cfdi.consistenciaConcepto?.ok ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="success">OK</Badge>
                    <span className="text-sm">El concepto coincide con la clave SAT</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="critical">No coincide</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cfdi.consistenciaConcepto?.explicacion || "La clave SAT no corresponde al concepto descrito"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Inspector XML */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inspector XML</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-b mb-4">
                  <div className="flex gap-4">
                    <button className="pb-2 border-b-2 border-primary text-sm font-medium">
                      Nodos
                    </button>
                    <button className="pb-2 text-sm text-muted-foreground hover:text-foreground">
                      Validaciones
                    </button>
                    <button className="pb-2 text-sm text-muted-foreground hover:text-foreground">
                      Raw XML
                    </button>
                  </div>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="pl-2">
                    <span className="text-blue-600">{"<cfdi:Comprobante>"}</span>
                    <div className="pl-4 space-y-1 mt-1">
                      <div>
                        <span className="text-green-600">Version</span>
                        <span className="text-gray-600">="4.0"</span>
                      </div>
                      <div>
                        <span className="text-green-600">Fecha</span>
                        <span className="text-gray-600">="{cfdi.fecha}"</span>
                      </div>
                      <div>
                        <span className="text-green-600">Total</span>
                        <span className="text-gray-600">="{cfdi.total}"</span>
                      </div>
                      <div className="pl-2">
                        <span className="text-blue-600">{"<cfdi:Emisor>"}</span>
                        <div className="pl-4">
                          <div>
                            <span className="text-green-600">Rfc</span>
                            <span className="text-gray-600">="{cfdi.proveedor.rfc}"</span>
                          </div>
                          <div>
                            <span className="text-green-600">Nombre</span>
                            <span className="text-gray-600">="{cfdi.proveedor.razonSocial}"</span>
                          </div>
                        </div>
                        <span className="text-blue-600">{"</cfdi:Emisor>"}</span>
                      </div>
                    </div>
                    <span className="text-blue-600">{"</cfdi:Comprobante>"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button className="flex-1 gap-2">
                <FileText className="h-4 w-4" />
                Generar reporte
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <AlertTriangle className="h-4 w-4" />
                Crear caso/alerta
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar XML
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

