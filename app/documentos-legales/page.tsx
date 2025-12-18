"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Edit, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { documentosLegales } from "@/mock/data";
import { formatDate } from "@/lib/utils";

export default function DocumentosLegalesPage() {
  const [data, setData] = React.useState(documentosLegales);
  const [isDragging, setIsDragging] = React.useState(false);
  const [editingDoc, setEditingDoc] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simular subida
    console.log("Archivo subido");
  };

  const getEstatusBadge = (estatus: string) => {
    if (estatus === "listo") {
      return <Badge variant="success">Listo</Badge>;
    } else if (estatus === "en proceso") {
      return <Badge variant="warning">En proceso</Badge>;
    } else {
      return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  const handleEdit = (doc: typeof documentosLegales[0]) => {
    setEditingDoc(doc.id);
    setEditText(doc.objetoSocial || "");
  };

  const handleSaveEdit = (id: string) => {
    setData((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, objetoSocial: editText } : doc
      )
    );
    setEditingDoc(null);
    setEditText("");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Documentos Legales</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona actas constitutivas, poderes y documentos corporativos
          </p>
        </div>

        {/* Card de subida */}
        <Card>
          <CardHeader>
            <CardTitle>Subir documento</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/5 scale-105 shadow-lg"
                  : "border-gray-300 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Arrastra y suelta tu documento aquí
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                o haz clic para seleccionar un archivo
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <select className="px-3 py-2 border rounded-md text-sm">
                  <option>Acta constitutiva</option>
                  <option>Asamblea</option>
                  <option>Poderes</option>
                  <option>Otros</option>
                </select>
                <Button>Seleccionar archivo</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos subidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium">Tipo</th>
                    <th className="text-left p-3 text-sm font-medium">Nombre</th>
                    <th className="text-left p-3 text-sm font-medium">Fecha subida</th>
                    <th className="text-center p-3 text-sm font-medium">Estatus análisis</th>
                    <th className="text-center p-3 text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-accent/50 hover:shadow-sm transition-all duration-200 group">
                      <td className="p-3 text-sm">{doc.tipo}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{doc.nombre}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {formatDate(doc.fechaSubida)}
                      </td>
                      <td className="p-3 text-center">
                        {getEstatusBadge(doc.estatusAnalisis)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {doc.estatusAnalisis === "listo" && doc.objetoSocial && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(doc)}
                              className="gap-1 hover:scale-105"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Panel de objeto social */}
        {data.filter((d) => d.objetoSocial && d.estatusAnalisis === "listo").length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Objeto social detectado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data
                  .filter((d) => d.objetoSocial && d.estatusAnalisis === "listo")
                  .map((doc) => (
                    <div key={doc.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{doc.nombre}</span>
                        {editingDoc === doc.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(doc.id)}
                            >
                              Guardar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingDoc(null);
                                setEditText("");
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(doc)}
                            className="gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Editar/Confirmar
                          </Button>
                        )}
                      </div>
                      {editingDoc === doc.id ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-3 border rounded-md text-sm min-h-[100px]"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{doc.objetoSocial}</p>
                      )}
                      {doc.resumen && (
                        <p className="text-xs text-muted-foreground mt-2">{doc.resumen}</p>
                      )}
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

