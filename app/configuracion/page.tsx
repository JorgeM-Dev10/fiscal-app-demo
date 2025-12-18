"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Bell, Shield, FileText, Plus, Trash2 } from "lucide-react";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = React.useState("empresa");

  const usuarios = [
    { id: "1", nombre: "Juan Pérez", email: "juan@empresa.com", rol: "Admin" },
    { id: "2", nombre: "María González", email: "maria@empresa.com", rol: "Auditor" },
    { id: "3", nombre: "Carlos Rodríguez", email: "carlos@empresa.com", rol: "Operador" },
  ];

  const roles = ["Admin", "Auditor", "Operador", "Solo lectura"];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona la configuración del sistema y usuarios
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-4">
            {[
              { id: "empresa", label: "Empresa", icon: Building2 },
              { id: "usuarios", label: "Usuarios y roles", icon: Users },
              { id: "reglas", label: "Reglas de alertas", icon: Shield },
              { id: "notificaciones", label: "Notificaciones", icon: Bell },
              { id: "auditoria", label: "Auditoría", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab: Empresa */}
        {activeTab === "empresa" && (
          <Card>
            <CardHeader>
              <CardTitle>Información de la empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Razón social</label>
                  <Input defaultValue="Empresa ABC S.A. de C.V." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">RFC</label>
                  <Input defaultValue="ABC123456789" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Dirección</label>
                  <Input defaultValue="Av. Principal 123, Col. Centro" />
                </div>
                <Button>Guardar cambios</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab: Usuarios */}
        {activeTab === "usuarios" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Usuarios</CardTitle>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar usuario
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usuarios.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="flex items-center justify-between p-4 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{usuario.nombre}</p>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>{usuario.rol}</Badge>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Roles disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roles.map((rol) => (
                    <div
                      key={rol}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <span className="font-medium">{rol}</span>
                      <Button variant="outline" size="sm">
                        Configurar permisos
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab: Reglas */}
        {activeTab === "reglas" && (
          <Card>
            <CardHeader>
              <CardTitle>Reglas de alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Validación SAT fallida</span>
                    <Badge variant="success">Activa</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Genera alerta cuando un CFDI no pase la validación del SAT
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Discrepancia en totales</span>
                    <Badge variant="success">Activa</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Alerta cuando los totales no coincidan con las sumas
                  </p>
                </div>
                <Button>Agregar regla</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab: Notificaciones */}
        {activeTab === "notificaciones" && (
          <Card>
            <CardHeader>
              <CardTitle>Configuración de notificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Notificaciones por email</p>
                    <p className="text-sm text-muted-foreground">
                      Recibe alertas críticas por correo electrónico
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Notificaciones in-app</p>
                    <p className="text-sm text-muted-foreground">
                      Muestra notificaciones en la aplicación
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Frecuencia</label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Tiempo real</option>
                    <option>Cada hora</option>
                    <option>Diario</option>
                    <option>Semanal</option>
                  </select>
                </div>
                <Button>Guardar cambios</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab: Auditoría */}
        {activeTab === "auditoria" && (
          <Card>
            <CardHeader>
              <CardTitle>Log de auditoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { fecha: "2024-01-15 10:30", usuario: "Juan Pérez", accion: "CFDI marcado como revisado", entidad: "CFDI-123" },
                  { fecha: "2024-01-15 09:15", usuario: "María González", accion: "Alerta resuelta", entidad: "ALERT-456" },
                  { fecha: "2024-01-14 16:45", usuario: "Carlos Rodríguez", accion: "Proveedor agregado", entidad: "PROV-789" },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="text-sm font-medium">{log.accion}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.usuario} • {log.fecha} • {log.entidad}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

