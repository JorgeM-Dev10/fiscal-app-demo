"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer } from "@/components/ui/drawer";
import { Tooltip } from "@/components/ui/tooltip";
import { Eye, FileText, AlertTriangle, CheckCircle2, Search, Filter, X, User } from "lucide-react";
import { cfdiRecibidos } from "@/mock/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CFDIRecibido, Estatus, TipoCFDI, Riesgo } from "@/mock/data";
import Link from "next/link";

export default function CFDIRecibidosPage() {
  const [data, setData] = React.useState(cfdiRecibidos);
  const [filteredData, setFilteredData] = React.useState(cfdiRecibidos);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState({
    estatus: "" as Estatus | "",
    tipo: "" as TipoCFDI | "",
    riesgo: "" as Riesgo | "",
    fechaDesde: "",
    fechaHasta: "",
    montoMin: "",
    montoMax: "",
    proveedor: "",
  });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedCFDI, setSelectedCFDI] = React.useState<CFDIRecibido | null>(null);
  const [drawerType, setDrawerType] = React.useState<"xml" | "alertas" | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    let filtered = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.uuid.toLowerCase().includes(query) ||
          item.proveedor.rfc.toLowerCase().includes(query) ||
          item.proveedor.razonSocial.toLowerCase().includes(query)
      );
    }

    if (filters.estatus) {
      filtered = filtered.filter((item) => item.estatus === filters.estatus);
    }

    if (filters.tipo) {
      filtered = filtered.filter((item) => item.tipo === filters.tipo);
    }

    if (filters.riesgo) {
      filtered = filtered.filter((item) => item.riesgo === filters.riesgo);
    }

    if (filters.fechaDesde) {
      filtered = filtered.filter((item) => new Date(item.fecha) >= new Date(filters.fechaDesde));
    }

    if (filters.fechaHasta) {
      filtered = filtered.filter((item) => new Date(item.fecha) <= new Date(filters.fechaHasta));
    }

    if (filters.montoMin) {
      filtered = filtered.filter((item) => item.total >= parseFloat(filters.montoMin));
    }

    if (filters.montoMax) {
      filtered = filtered.filter((item) => item.total <= parseFloat(filters.montoMax));
    }

    if (filters.proveedor) {
      const query = filters.proveedor.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.proveedor.rfc.toLowerCase().includes(query) ||
          item.proveedor.razonSocial.toLowerCase().includes(query)
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, filters, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVerXML = (cfdi: CFDIRecibido) => {
    setSelectedCFDI(cfdi);
    setDrawerType("xml");
    setDrawerOpen(true);
  };

  const handleVerAlertas = (cfdi: CFDIRecibido) => {
    setSelectedCFDI(cfdi);
    setDrawerType("alertas");
    setDrawerOpen(true);
  };

  const handleMarcarConciliado = (id: string) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, estatus: "OK" as Estatus } : item))
    );
  };

  const getStatusBadge = (estatus: Estatus) => {
    const variants = {
      OK: "success",
      Warn: "warning",
      Critical: "critical",
    } as const;
    return <Badge variant={variants[estatus]}>{estatus}</Badge>;
  };

  const getRiesgoBadge = (riesgo: Riesgo) => {
    const variants = {
      bajo: "success",
      medio: "warning",
      alto: "critical",
    } as const;
    return <Badge variant={variants[riesgo]}>{riesgo.toUpperCase()}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CFDI Recibidos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y valida los comprobantes fiscales recibidos de proveedores
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Búsqueda</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="UUID, RFC, proveedor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Estatus</label>
                <select
                  value={filters.estatus}
                  onChange={(e) => setFilters({ ...filters, estatus: e.target.value as Estatus | "" })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="OK">OK</option>
                  <option value="Warn">Warn</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Riesgo</label>
                <select
                  value={filters.riesgo}
                  onChange={(e) => setFilters({ ...filters, riesgo: e.target.value as Riesgo | "" })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="bajo">Bajo</option>
                  <option value="medio">Medio</option>
                  <option value="alto">Alto</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Proveedor</label>
                <Input
                  placeholder="RFC o razón social"
                  value={filters.proveedor}
                  onChange={(e) => setFilters({ ...filters, proveedor: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <select
                  value={filters.tipo}
                  onChange={(e) => setFilters({ ...filters, tipo: e.target.value as TipoCFDI | "" })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Egreso">Egreso</option>
                  <option value="Traslado">Traslado</option>
                  <option value="Pago">Pago</option>
                </select>
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

              <div>
                <label className="text-sm font-medium mb-1 block">Monto mínimo</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={filters.montoMin}
                  onChange={(e) => setFilters({ ...filters, montoMin: e.target.value })}
                />
              </div>
            </div>

            {(filters.estatus || filters.tipo || filters.riesgo || filters.fechaDesde || filters.fechaHasta || filters.montoMin || filters.montoMax || filters.proveedor || searchQuery) && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      estatus: "",
                      tipo: "",
                      riesgo: "",
                      fechaDesde: "",
                      fechaHasta: "",
                      montoMin: "",
                      montoMax: "",
                      proveedor: "",
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

        {/* Tabla */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados ({filteredData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium">Fecha/Hora</th>
                    <th className="text-left p-3 text-sm font-medium">Proveedor</th>
                    <th className="text-left p-3 text-sm font-medium">UUID</th>
                    <th className="text-right p-3 text-sm font-medium">Total</th>
                    <th className="text-center p-3 text-sm font-medium">Estatus</th>
                    <th className="text-center p-3 text-sm font-medium">Riesgo</th>
                    <th className="text-center p-3 text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((cfdi) => (
                    <tr key={cfdi.id} className="border-b hover:bg-accent/50 transition-all duration-200 hover:shadow-sm group">
                      <td className="p-3 text-sm">
                        <Tooltip content={formatDate(cfdi.fecha)}>
                          <span>{formatDate(cfdi.fecha)}</span>
                        </Tooltip>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-sm">{cfdi.proveedor.razonSocial}</div>
                          <div className="text-xs text-muted-foreground">{cfdi.proveedor.rfc}</div>
                        </div>
                      </td>
                      <td className="p-3 text-sm font-mono text-xs">
                        <Tooltip content={cfdi.uuid}>
                          <span>{cfdi.uuid.substring(0, 8)}...</span>
                        </Tooltip>
                      </td>
                      <td className="p-3 text-sm text-right font-medium">
                        {formatCurrency(cfdi.total)}
                      </td>
                      <td className="p-3 text-center">
                        {getStatusBadge(cfdi.estatus)}
                      </td>
                      <td className="p-3 text-center">
                        {getRiesgoBadge(cfdi.riesgo)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Tooltip content="Ver detalle">
                            <Link href={`/cfdi/recibidos/${cfdi.id}`}>
                              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </Tooltip>
                          <Tooltip content="Ver XML">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleVerXML(cfdi)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Ver proveedor">
                            <Link href={`/proveedores/${cfdi.proveedor.rfc}`}>
                              <Button variant="ghost" size="icon" className="hover:bg-blue-100 hover:text-blue-700">
                                <User className="h-4 w-4" />
                              </Button>
                            </Link>
                          </Tooltip>
                          {cfdi.estatus !== "OK" && (
                            <Tooltip content="Marcar conciliado">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMarcarConciliado(cfdi.id)}
                                className="hover:bg-green-100 hover:text-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        {/* Drawer */}
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedCFDI(null);
            setDrawerType(null);
          }}
          title={
            drawerType === "xml"
              ? "XML del CFDI"
              : drawerType === "alertas"
              ? "Alertas relacionadas"
              : ""
          }
          size="lg"
        >
          {selectedCFDI && drawerType === "xml" && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md font-mono text-xs overflow-x-auto">
                <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
  Version="4.0" 
  Fecha="${selectedCFDI.fecha}"
  Total="${selectedCFDI.total}"
  TipoDeComprobante="I">
  <cfdi:Emisor Rfc="${selectedCFDI.proveedor.rfc}" 
    Nombre="${selectedCFDI.proveedor.razonSocial}" />
  <cfdi:Receptor Rfc="RECEPTOR123" Nombre="Tu Empresa" />
  <cfdi:Conceptos>
    <cfdi:Concepto Cantidad="1" 
      Descripcion="Servicio" 
      ValorUnitario="${selectedCFDI.subtotal}" 
      Importe="${selectedCFDI.subtotal}" />
  </cfdi:Conceptos>
</cfdi:Comprobante>`}</pre>
              </div>
              <Button className="w-full">Exportar XML</Button>
            </div>
          )}

          {selectedCFDI && drawerType === "alertas" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Alertas relacionadas con este CFDI
              </p>
              {selectedCFDI.estatus !== "OK" && (
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={selectedCFDI.estatus === "Critical" ? "critical" : "warning"}>
                      {selectedCFDI.estatus}
                    </Badge>
                    <span className="font-medium text-sm">Alerta detectada</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Riesgo: {selectedCFDI.riesgo}
                  </p>
                </div>
              )}
            </div>
          )}
        </Drawer>
      </div>
    </MainLayout>
  );
}

