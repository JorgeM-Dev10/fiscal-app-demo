"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer } from "@/components/ui/drawer";
import { Tooltip } from "@/components/ui/tooltip";
import { Eye, FileText, AlertTriangle, CheckCircle2, Search, Filter, X } from "lucide-react";
import { cfdiEmitidos } from "@/mock/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CFDIEmitido, Estatus, TipoCFDI } from "@/mock/data";
import Link from "next/link";

export default function CFDIEmitidosPage() {
  const [data, setData] = React.useState(cfdiEmitidos);
  const [filteredData, setFilteredData] = React.useState(cfdiEmitidos);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState({
    estatus: "" as Estatus | "",
    tipo: "" as TipoCFDI | "",
    fechaDesde: "",
    fechaHasta: "",
    montoMin: "",
    montoMax: "",
    cliente: "",
  });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedCFDI, setSelectedCFDI] = React.useState<CFDIEmitido | null>(null);
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
          item.cliente.rfc.toLowerCase().includes(query) ||
          item.cliente.razonSocial.toLowerCase().includes(query) ||
          item.motivo?.toLowerCase().includes(query)
      );
    }

    if (filters.estatus) {
      filtered = filtered.filter((item) => item.estatus === filters.estatus);
    }

    if (filters.tipo) {
      filtered = filtered.filter((item) => item.tipo === filters.tipo);
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

    if (filters.cliente) {
      const query = filters.cliente.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.cliente.rfc.toLowerCase().includes(query) ||
          item.cliente.razonSocial.toLowerCase().includes(query)
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

  const handleVerXML = (cfdi: CFDIEmitido) => {
    setSelectedCFDI(cfdi);
    setDrawerType("xml");
    setDrawerOpen(true);
  };

  const handleVerAlertas = (cfdi: CFDIEmitido) => {
    setSelectedCFDI(cfdi);
    setDrawerType("alertas");
    setDrawerOpen(true);
  };

  const handleMarcarRevisado = (id: string) => {
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CFDI Emitidos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y valida tus comprobantes fiscales emitidos
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
                    placeholder="UUID, RFC, cliente..."
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
                <label className="text-sm font-medium mb-1 block">Cliente</label>
                <Input
                  placeholder="RFC o razón social"
                  value={filters.cliente}
                  onChange={(e) => setFilters({ ...filters, cliente: e.target.value })}
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

              <div>
                <label className="text-sm font-medium mb-1 block">Monto mínimo</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={filters.montoMin}
                  onChange={(e) => setFilters({ ...filters, montoMin: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Monto máximo</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={filters.montoMax}
                  onChange={(e) => setFilters({ ...filters, montoMax: e.target.value })}
                />
              </div>
            </div>

            {(filters.estatus || filters.tipo || filters.fechaDesde || filters.fechaHasta || filters.montoMin || filters.montoMax || filters.cliente || searchQuery) && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      estatus: "",
                      tipo: "",
                      fechaDesde: "",
                      fechaHasta: "",
                      montoMin: "",
                      montoMax: "",
                      cliente: "",
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
            <CardTitle>
              Resultados ({filteredData.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium">Fecha/Hora</th>
                    <th className="text-left p-3 text-sm font-medium">Cliente</th>
                    <th className="text-left p-3 text-sm font-medium">UUID</th>
                    <th className="text-right p-3 text-sm font-medium">Total</th>
                    <th className="text-center p-3 text-sm font-medium">Estatus</th>
                    <th className="text-left p-3 text-sm font-medium">Motivo</th>
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
                          <div className="font-medium text-sm">{cfdi.cliente.razonSocial}</div>
                          <div className="text-xs text-muted-foreground">{cfdi.cliente.rfc}</div>
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
                      <td className="p-3 text-sm text-muted-foreground">
                        {cfdi.motivo || "-"}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Tooltip content="Ver detalle">
                            <Link href={`/cfdi/emitidos/${cfdi.id}`}>
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
                          <Tooltip content="Ver alertas">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleVerAlertas(cfdi)}
                              className="hover:bg-yellow-100 hover:text-yellow-700"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          {cfdi.estatus !== "OK" && (
                            <Tooltip content="Marcar como revisado">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMarcarRevisado(cfdi.id)}
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
  Serie="A" 
  Folio="${selectedCFDI.id}"
  Fecha="${selectedCFDI.fecha}"
  Sello="..."
  FormaPago="03"
  NoCertificado="..."
  Certificado="..."
  SubTotal="${selectedCFDI.subtotal}"
  Moneda="MXN"
  Total="${selectedCFDI.total}"
  TipoDeComprobante="I"
  MetodoPago="PUE"
  LugarExpedicion="12345">
  <cfdi:Emisor Rfc="${selectedCFDI.cliente.rfc}" 
    Nombre="${selectedCFDI.cliente.razonSocial}" />
  <cfdi:Receptor Rfc="RECEPTOR123" Nombre="Receptor S.A." />
  <cfdi:Conceptos>
    <cfdi:Concepto Cantidad="1" Unidad="UNI" 
      Descripcion="Servicio" ValorUnitario="${selectedCFDI.subtotal}" 
      Importe="${selectedCFDI.subtotal}">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="${selectedCFDI.subtotal}" 
            Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" 
            Importe="${selectedCFDI.impuestos}" />
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="${selectedCFDI.impuestos}">
    <cfdi:Traslados>
      <cfdi:Traslado Base="${selectedCFDI.subtotal}" 
        Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" 
        Importe="${selectedCFDI.impuestos}" />
    </cfdi:Traslados>
  </cfdi:Impuestos>
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
              <div className="space-y-2">
                {selectedCFDI.estatus !== "OK" && (
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={selectedCFDI.estatus === "Critical" ? "critical" : "warning"}>
                        {selectedCFDI.estatus}
                      </Badge>
                      <span className="font-medium text-sm">Alerta detectada</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedCFDI.motivo}</p>
                  </div>
                )}
                {selectedCFDI.estatus === "OK" && (
                  <p className="text-sm text-muted-foreground">No hay alertas para este CFDI</p>
                )}
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </MainLayout>
  );
}

