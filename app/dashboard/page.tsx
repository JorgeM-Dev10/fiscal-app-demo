"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Download, CheckCircle2, TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cfdiEmitidos, cfdiRecibidos, alertas } from "@/mock/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const [dateRange, setDateRange] = React.useState("7");

  // Calcular KPIs
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const emitidosHoy = cfdiEmitidos.filter(
    (cfdi) => new Date(cfdi.fecha) >= hoy
  ).length;

  const recibidosHoy = cfdiRecibidos.filter(
    (cfdi) => new Date(cfdi.fecha) >= hoy
  ).length;

  const alertasCriticas = alertas.filter(
    (a) => a.severidad === "crítica" && a.estado !== "Resuelta"
  ).length;

  const totalCFDI = cfdiEmitidos.length + cfdiRecibidos.length;
  const cfdiSinIncidencias = cfdiEmitidos.filter((c) => c.estatus === "OK").length +
    cfdiRecibidos.filter((c) => c.estatus === "OK").length;
  const porcentajeSinIncidencias = totalCFDI > 0
    ? Math.round((cfdiSinIncidencias / totalCFDI) * 100)
    : 100;

  // Datos para gráficas
  const alertasPorDia = React.useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString("es-MX", { weekday: "short" });
    });

    return days.map((day, idx) => ({
      dia: day,
      alertas: Math.floor(Math.random() * 10) + 2,
    }));
  }, []);

  const topMotivos = [
    { motivo: "Validación SAT fallida", cantidad: 15 },
    { motivo: "Discrepancia en totales", cantidad: 12 },
    { motivo: "Concepto no alineado", cantidad: 8 },
    { motivo: "Proveedor riesgo alto", cantidad: 6 },
    { motivo: "Documento faltante", cantidad: 4 },
  ];

  const alertasRecientes = alertas
    .filter((a) => a.estado !== "Resuelta")
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  const actividadReciente = [
    { tiempo: "Hace 2 min", accion: "Nueva alerta crítica detectada", tipo: "alerta" },
    { tiempo: "Hace 5 min", accion: "CFDI recibido de Comercial XYZ", tipo: "cfdi" },
    { tiempo: "Hace 12 min", accion: "Sincronización completada", tipo: "sync" },
    { tiempo: "Hace 18 min", accion: "CFDI emitido validado", tipo: "cfdi" },
    { tiempo: "Hace 25 min", accion: "Proveedor agregado a lista de confianza", tipo: "proveedor" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Resumen de cumplimiento</h1>
            <p className="text-muted-foreground mt-1">
              Visión general del estado fiscal y legal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="1">Hoy</option>
              <option value="7">7 días</option>
              <option value="30">30 días</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group">
              <CardTitle className="text-sm font-medium">CFDI Emitidos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emitidosHoy}</div>
              <p className="text-xs text-muted-foreground">Hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CFDI Recibidos</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recibidosHoy}</div>
              <p className="text-xs text-muted-foreground">Hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{alertasCriticas}</div>
              <p className="text-xs text-muted-foreground">Pendientes de revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">% Sin Incidencias</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{porcentajeSinIncidencias}%</div>
              <p className="text-xs text-muted-foreground">CFDI validados correctamente</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle>Alertas por día</CardTitle>
              <CardDescription>Últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={alertasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="alertas" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Top motivos de alerta</CardTitle>
              <CardDescription>Principales causas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topMotivos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="motivo" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alertas recientes y actividad */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Alertas recientes</CardTitle>
                <CardDescription>Requieren atención inmediata</CardDescription>
              </div>
              <Link href="/alertas">
                <Button variant="outline" size="sm" className="hover:scale-105">Ver todas</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertasRecientes.map((alerta) => (
                  <div
                    key={alerta.id}
                    className="flex items-start justify-between p-3 border rounded-md hover:bg-accent/50 hover:shadow-sm hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            alerta.severidad === "crítica"
                              ? "critical"
                              : alerta.severidad === "alta"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {alerta.severidad}
                        </Badge>
                        <span className="text-sm font-medium">{alerta.titulo}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{formatDate(alerta.fecha)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 animate-pulse" />
                Actividad en tiempo real
              </CardTitle>
              <CardDescription>Últimas acciones del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actividadReciente.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 border-l-2 border-primary/20 pl-4 hover:border-primary/40 hover:bg-accent/30 transition-all duration-200 rounded-r-md group">
                    <div className="flex-1">
                      <p className="text-sm group-hover:font-medium transition-all">{act.accion}</p>
                      <p className="text-xs text-muted-foreground">{act.tiempo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Conecta servicios y sube documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2 hover:scale-105">
                <TrendingUp className="h-4 w-4" />
                Conectar software de facturación
              </Button>
              <Button variant="outline" className="gap-2 hover:scale-105">
                <FileText className="h-4 w-4" />
                Subir acta constitutiva
              </Button>
              <Button variant="outline" className="gap-2 hover:scale-105">
                <CheckCircle2 className="h-4 w-4" />
                Importar constancia fiscal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

