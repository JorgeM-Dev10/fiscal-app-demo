"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, AlertTriangle, XCircle, Upload, Settings } from "lucide-react";

export default function ValidacionesSATPage() {
  const [activeTab, setActiveTab] = React.useState("actividades");
  const [searchClave, setSearchClave] = React.useState("");

  const actividades = [
    { codigo: "84111505", descripcion: "Servicios de consultoría en administración", estado: "OK" },
    { codigo: "84111506", descripcion: "Servicios de consultoría en administración de recursos humanos", estado: "OK" },
    { codigo: "84111507", descripcion: "Servicios de consultoría en administración financiera", estado: "Warn" },
    { codigo: "84111508", descripcion: "Servicios de consultoría en administración de la producción", estado: "OK" },
  ];

  const clavesMasUsadas = [
    { clave: "84111505", descripcion: "Servicios de consultoría", uso: 45 },
    { clave: "84111506", descripcion: "Consultoría RH", uso: 32 },
    { clave: "84111507", descripcion: "Consultoría financiera", uso: 28 },
    { clave: "84111508", descripcion: "Consultoría producción", uso: 15 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Validaciones SAT</h1>
          <p className="text-muted-foreground mt-1">
            Valida y alinea actividades, productos y servicios con el SAT
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-4">
            {[
              { id: "actividades", label: "Actividades del contribuyente" },
              { id: "catalogo", label: "Catálogo productos/servicios" },
              { id: "constancia", label: "Constancia situación fiscal" },
              { id: "reglas", label: "Reglas de alineación" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab: Actividades */}
        {activeTab === "actividades" && (
          <Card>
            <CardHeader>
              <CardTitle>Actividades del contribuyente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actividades.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm">{act.codigo}</span>
                        {act.estado === "OK" ? (
                          <Badge variant="success">OK</Badge>
                        ) : (
                          <Badge variant="warning">Revisar</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{act.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {act.estado === "OK" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab: Catálogo */}
        {activeTab === "catalogo" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Buscador de claves SAT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por clave o descripción..."
                    value={searchClave}
                    onChange={(e) => setSearchClave(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claves más usadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clavesMasUsadas.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-medium">{item.clave}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.descripcion}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.uso} usos
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab: Constancia */}
        {activeTab === "constancia" && (
          <Card>
            <CardHeader>
              <CardTitle>Constancia de situación fiscal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Subir constancia fiscal</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Formato PDF o imagen
                  </p>
                  <Button>Seleccionar archivo</Button>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3">Datos clave</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">RFC</label>
                      <p className="font-medium">ABC123456789</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Régimen fiscal</label>
                      <p className="font-medium">Régimen General</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Fecha de emisión</label>
                      <p className="font-medium">15/01/2024</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Vigencia</label>
                      <p className="font-medium">31/12/2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab: Reglas */}
        {activeTab === "reglas" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Reglas de alineación</span>
                <Button className="gap-2">
                  <Settings className="h-4 w-4" />
                  Actualizar reglas
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Validar actividades vs facturación</span>
                    <Badge variant="success">Activa</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verifica que las actividades facturadas coincidan con las registradas en el SAT
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Validar claves SAT</span>
                    <Badge variant="success">Activa</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Valida que las claves de productos/servicios sean correctas
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Alertar discrepancias</span>
                    <Badge variant="success">Activa</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Genera alertas cuando se detecten inconsistencias
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

