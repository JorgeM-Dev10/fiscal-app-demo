"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plug, Folder, Mail, Upload, CheckCircle2, XCircle, Settings, RefreshCw } from "lucide-react";

export default function IntegracionesPage() {
  const [integraciones, setIntegraciones] = React.useState([
    {
      id: "facturacion",
      nombre: "Software de facturación",
      descripcion: "Conecta tu sistema de facturación para sincronización automática",
      icon: Plug,
      conectado: false,
      ultimaSincronizacion: null as string | null,
    },
    {
      id: "carpeta",
      nombre: "Carpeta de recepción",
      descripcion: "Monitorea una carpeta local para importar CFDI automáticamente",
      icon: Folder,
      conectado: true,
      ultimaSincronizacion: "2024-01-15T10:30:00",
    },
    {
      id: "correo",
      nombre: "Correo electrónico",
      descripcion: "Importa CFDI desde correos electrónicos automáticamente",
      icon: Mail,
      conectado: false,
      ultimaSincronizacion: null,
    },
    {
      id: "carga",
      nombre: "Carga masiva XML",
      descripcion: "Sube múltiples archivos XML de forma masiva",
      icon: Upload,
      conectado: false,
      ultimaSincronizacion: null,
    },
  ]);

  const [logs, setLogs] = React.useState([
    { fecha: "2024-01-15T10:30:00", accion: "Sincronización completada", estado: "success", detalles: "15 CFDI importados" },
    { fecha: "2024-01-15T09:15:00", accion: "Error de conexión", estado: "error", detalles: "No se pudo conectar al servidor" },
    { fecha: "2024-01-14T16:45:00", accion: "Sincronización completada", estado: "success", detalles: "8 CFDI importados" },
  ]);

  const handleConectar = (id: string) => {
    setIntegraciones((prev) =>
      prev.map((int) =>
        int.id === id
          ? {
              ...int,
              conectado: true,
              ultimaSincronizacion: new Date().toISOString(),
            }
          : int
      )
    );
  };

  const handleProbarConexion = (id: string) => {
    // Simular prueba
    console.log(`Probando conexión: ${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Integraciones</h1>
          <p className="text-muted-foreground mt-1">
            Conecta sistemas externos y fuentes de datos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integraciones.map((integracion, idx) => {
            const Icon = integracion.icon;
            return (
              <Card key={integracion.id} className="animate-fade-in hover:scale-[1.02]" style={{ animationDelay: `${idx * 100}ms` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integracion.nombre}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {integracion.descripcion}
                        </p>
                      </div>
                    </div>
                    {integracion.conectado ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Conectado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        No conectado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {integracion.ultimaSincronizacion && (
                      <div className="text-sm text-muted-foreground">
                        Última sincronización:{" "}
                        {new Date(integracion.ultimaSincronizacion).toLocaleString("es-MX")}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {integracion.conectado ? (
                        <>
                          <Button variant="outline" className="flex-1 gap-2 hover:scale-105">
                            <Settings className="h-4 w-4" />
                            Gestionar
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleProbarConexion(integracion.id)}
                            className="hover:scale-110 hover:rotate-180 transition-transform duration-500"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="flex-1 gap-2 hover:scale-105"
                          onClick={() => handleConectar(integracion.id)}
                        >
                          <Plug className="h-4 w-4" />
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Log de sincronización */}
        <Card>
          <CardHeader>
            <CardTitle>Log de sincronización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 border rounded-md"
                >
                  {log.estado === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.accion}</p>
                    <p className="text-xs text-muted-foreground">{log.detalles}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.fecha).toLocaleString("es-MX")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Carga masiva */}
        <Card>
          <CardHeader>
            <CardTitle>Carga masiva XML</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Arrastra y suelta archivos XML aquí
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                o haz clic para seleccionar múltiples archivos
              </p>
              <Button>Seleccionar archivos</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

