"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer } from "@/components/ui/drawer";
import { Tooltip } from "@/components/ui/tooltip";
import { Search, Filter, X, CheckCircle2, User, FileText, MessageSquare, Paperclip } from "lucide-react";
import { alertas } from "@/mock/data";
import { formatDate } from "@/lib/utils";
import type { Alerta, SeveridadAlerta, TipoAlerta, EstadoAlerta } from "@/mock/data";

export default function AlertasPage() {
  const [data, setData] = React.useState(alertas);
  const [filteredData, setFilteredData] = React.useState(alertas);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState({
    severidad: "" as SeveridadAlerta | "",
    tipo: "" as TipoAlerta | "",
    estado: "" as EstadoAlerta | "",
    responsable: "",
    fechaDesde: "",
    fechaHasta: "",
  });
  const [selectedAlerts, setSelectedAlerts] = React.useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedAlerta, setSelectedAlerta] = React.useState<Alerta | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 15;

  React.useEffect(() => {
    let filtered = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.titulo.toLowerCase().includes(query) ||
          item.descripcion.toLowerCase().includes(query) ||
          item.entidadRelacionada.nombre.toLowerCase().includes(query)
      );
    }

    if (filters.severidad) {
      filtered = filtered.filter((item) => item.severidad === filters.severidad);
    }

    if (filters.tipo) {
      filtered = filtered.filter((item) => item.tipo === filters.tipo);
    }

    if (filters.estado) {
      filtered = filtered.filter((item) => item.estado === filters.estado);
    }

    if (filters.responsable) {
      filtered = filtered.filter(
        (item) => item.responsable?.toLowerCase().includes(filters.responsable.toLowerCase())
      );
    }

    if (filters.fechaDesde) {
      filtered = filtered.filter((item) => new Date(item.fecha) >= new Date(filters.fechaDesde));
    }

    if (filters.fechaHasta) {
      filtered = filtered.filter((item) => new Date(item.fecha) <= new Date(filters.fechaHasta));
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, filters, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVerDetalle = (alerta: Alerta) => {
    setSelectedAlerta(alerta);
    setDrawerOpen(true);
  };

  const handleMarcarResuelta = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: "Resuelta" as EstadoAlerta } : item
      )
    );
  };

  const handleMarcarRevisadas = () => {
    selectedAlerts.forEach((id) => {
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, estado: "En revisión" as EstadoAlerta } : item
        )
      );
    });
    setSelectedAlerts(new Set());
  };

  const getSeveridadBadge = (severidad: SeveridadAlerta) => {
    const variants = {
      crítica: "critical",
      alta: "warning",
      media: "secondary",
      baja: "secondary",
    } as const;
    return <Badge variant={variants[severidad]}>{severidad.toUpperCase()}</Badge>;
  };

  const getEstadoBadge = (estado: EstadoAlerta) => {
    const colors = {
      Nueva: "bg-blue-100 text-blue-800",
      "En revisión": "bg-yellow-100 text-yellow-800",
      Resuelta: "bg-green-100 text-green-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[estado]}`}>
        {estado}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Centro de Alertas</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y resuelve alertas de validación fiscal y legal
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros avanzados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Búsqueda</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Título, descripción, entidad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Severidad</label>
                <select
                  value={filters.severidad}
                  onChange={(e) =>
                    setFilters({ ...filters, severidad: e.target.value as SeveridadAlerta | "" })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todas</option>
                  <option value="crítica">Crítica</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <select
                  value={filters.tipo}
                  onChange={(e) =>
                    setFilters({ ...filters, tipo: e.target.value as TipoAlerta | "" })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="validación">Validación</option>
                  <option value="consistencia">Consistencia</option>
                  <option value="riesgo">Riesgo</option>
                  <option value="vencimiento">Vencimiento</option>
                  <option value="discrepancia">Discrepancia</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Estado</label>
                <select
                  value={filters.estado}
                  onChange={(e) =>
                    setFilters({ ...filters, estado: e.target.value as EstadoAlerta | "" })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Nueva">Nueva</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Resuelta">Resuelta</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Responsable</label>
                <Input
                  placeholder="Nombre del responsable"
                  value={filters.responsable}
                  onChange={(e) => setFilters({ ...filters, responsable: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Fecha desde</label>
                <Input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) => setFilters({ ...filters, fechaDesde: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Fecha hasta</label>
                <Input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) => setFilters({ ...filters, fechaHasta: e.target.value })}
                />
              </div>
            </div>

            {(filters.severidad || filters.tipo || filters.estado || filters.responsable || filters.fechaDesde || filters.fechaHasta || searchQuery) && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      severidad: "",
                      tipo: "",
                      estado: "",
                      responsable: "",
                      fechaDesde: "",
                      fechaHasta: "",
                    });
                    setSearchQuery("");
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones masivas */}
        {selectedAlerts.size > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedAlerts.size} alerta(s) seleccionada(s)
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleMarcarRevisadas}>
                    Marcar revisadas
                  </Button>
                  <Button variant="outline" size="sm">
                    Asignar responsable
                  </Button>
                  <Button variant="outline" size="sm">
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de alertas */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas ({filteredData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paginatedData.map((alerta) => (
                <div
                  key={alerta.id}
                  className="flex items-start gap-4 p-4 border rounded-md hover:bg-accent/50 hover:shadow-md transition-all duration-200 hover:border-primary/20 group"
                >
                  <input
                    type="checkbox"
                    checked={selectedAlerts.has(alerta.id)}
                    onChange={(e) => {
                      const newSet = new Set(selectedAlerts);
                      if (e.target.checked) {
                        newSet.add(alerta.id);
                      } else {
                        newSet.delete(alerta.id);
                      }
                      setSelectedAlerts(newSet);
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeveridadBadge(alerta.severidad)}
                      <span className="font-medium">{alerta.titulo}</span>
                      {getEstadoBadge(alerta.estado)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alerta.descripcion}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Tipo: {alerta.tipo}</span>
                      <span>•</span>
                      <span>Relacionado: {alerta.entidadRelacionada.nombre}</span>
                      <span>•</span>
                      <span>{formatDate(alerta.fecha)}</span>
                      {alerta.responsable && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {alerta.responsable}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerDetalle(alerta)}
                      className="hover:scale-105"
                    >
                      Ver detalle
                    </Button>
                    {alerta.estado !== "Resuelta" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarcarResuelta(alerta.id)}
                        className="gap-1 hover:bg-green-100 hover:text-green-700 hover:scale-105"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Resolver
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Drawer de detalle */}
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedAlerta(null);
          }}
          title="Detalle de alerta"
          size="lg"
        >
          {selectedAlerta && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Qué detectó el sistema</label>
                <p className="text-sm mt-1">{selectedAlerta.titulo}</p>
                <p className="text-sm text-muted-foreground mt-2">{selectedAlerta.descripcion}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Por qué es un problema</label>
                <p className="text-sm mt-1">
                  Esta alerta indica una posible inconsistencia que podría afectar el cumplimiento fiscal.
                  Requiere revisión para evitar sanciones o problemas con el SAT.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Qué revisar / Recomendación</label>
                <p className="text-sm mt-1">
                  {selectedAlerta.recomendacion || "Verificar con el proveedor y solicitar corrección del documento."}
                </p>
              </div>

              {selectedAlerta.evidencia && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Evidencia</label>
                  <div className="mt-2 p-3 bg-gray-100 rounded-md font-mono text-xs">
                    {selectedAlerta.evidencia}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                <Button className="w-full gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar resuelta
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Agregar comentario
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Paperclip className="h-4 w-4" />
                  Adjuntar evidencia
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <FileText className="h-4 w-4" />
                  Crear tarea interna
                </Button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </MainLayout>
  );
}

