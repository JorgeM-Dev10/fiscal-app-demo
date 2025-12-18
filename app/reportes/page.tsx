"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Calendar, Save } from "lucide-react";

export default function ReportesPage() {
  const [fechaDesde, setFechaDesde] = React.useState("");
  const [fechaHasta, setFechaHasta] = React.useState("");
  const [tipoReporte, setTipoReporte] = React.useState("cumplimiento");

  const plantillas = [
    { id: "mensual", nombre: "Mensual automático", descripcion: "Genera reporte mensual automáticamente" },
    { id: "semanal", nombre: "Semanal", descripcion: "Reporte semanal de cumplimiento" },
  ];

  const handleGenerarReporte = () => {
    // Simular generación
    console.log("Generando reporte...");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground mt-1">
            Genera reportes de cumplimiento fiscal y legal
          </p>
        </div>

        {/* Generar reporte */}
        <Card>
          <CardHeader>
            <CardTitle>Generar reporte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo de reporte</label>
                <select
                  value={tipoReporte}
                  onChange={(e) => setTipoReporte(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="cumplimiento">Cumplimiento</option>
                  <option value="alertas">Alertas</option>
                  <option value="proveedor">Por proveedor</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Fecha desde</label>
                  <Input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Fecha hasta</label>
                  <Input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleGenerarReporte} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Generar reporte
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vista previa */}
        <Card>
          <CardHeader>
            <CardTitle>Vista previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Genera un reporte para ver la vista previa</p>
            </div>
          </CardContent>
        </Card>

        {/* Plantillas guardadas */}
        <Card>
          <CardHeader>
            <CardTitle>Plantillas guardadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plantillas.map((plantilla) => (
                <div
                  key={plantilla.id}
                  className="flex items-center justify-between p-4 border rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{plantilla.nombre}</p>
                    <p className="text-sm text-muted-foreground">{plantilla.descripcion}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Programar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Generar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Save className="h-4 w-4" />
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

