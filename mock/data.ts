import { format } from "date-fns";

export type Estatus = "OK" | "Warn" | "Critical";
export type Riesgo = "bajo" | "medio" | "alto";
export type TipoCFDI = "Ingreso" | "Egreso" | "Traslado" | "Pago";
export type SeveridadAlerta = "baja" | "media" | "alta" | "crítica";
export type TipoAlerta = "validación" | "consistencia" | "riesgo" | "vencimiento" | "discrepancia";
export type EstadoAlerta = "Nueva" | "En revisión" | "Resuelta";

export interface CFDIEmitido {
  id: string;
  uuid: string;
  fecha: string;
  cliente: {
    rfc: string;
    razonSocial: string;
  };
  total: number;
  subtotal: number;
  impuestos: number;
  estatus: Estatus;
  motivo?: string;
  tipo: TipoCFDI;
  xml?: string;
}

export interface CFDIRecibido {
  id: string;
  uuid: string;
  fecha: string;
  proveedor: {
    rfc: string;
    razonSocial: string;
  };
  total: number;
  subtotal: number;
  impuestos: number;
  estatus: Estatus;
  riesgo: Riesgo;
  tipo: TipoCFDI;
  consistenciaConcepto?: {
    ok: boolean;
    explicacion?: string;
  };
  xml?: string;
}

export interface Alerta {
  id: string;
  severidad: SeveridadAlerta;
  tipo: TipoAlerta;
  titulo: string;
  descripcion: string;
  fecha: string;
  entidadRelacionada: {
    tipo: "CFDI" | "Proveedor" | "Documento";
    id: string;
    nombre: string;
  };
  estado: EstadoAlerta;
  responsable?: string;
  evidencia?: string;
  recomendacion?: string;
}

export interface Proveedor {
  id: string;
  rfc: string;
  razonSocial: string;
  volumenFacturas: number;
  riesgoPromedio: Riesgo;
  alertasAbiertas: number;
  facturasRecientes: number;
  semaforoAlineacion: Estatus;
  esCritico?: boolean;
  enListaConfianza?: boolean;
}

export interface DocumentoLegal {
  id: string;
  tipo: "Acta constitutiva" | "Asamblea" | "Poderes" | "Otros";
  nombre: string;
  fechaSubida: string;
  estatusAnalisis: "pendiente" | "en proceso" | "listo";
  objetoSocial?: string;
  resumen?: string;
}

// Generar datos mock
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const razonesSociales = [
  "Empresa ABC S.A. de C.V.",
  "Comercial XYZ S.A.",
  "Servicios Tecnológicos S.C.",
  "Distribuidora Nacional S.A. de C.V.",
  "Grupo Industrial del Norte",
  "Consultoría Fiscal y Legal",
  "Manufacturas del Sur S.A.",
  "Logística Integral S.A. de C.V.",
  "Desarrollo de Software S.C.",
  "Construcciones Metropolitanas",
];

const rfcList = [
  "ABC123456789",
  "XYZ987654321",
  "TEC456789012",
  "DIS789012345",
  "GIN012345678",
  "CFL345678901",
  "MAN678901234",
  "LOG901234567",
  "DSO234567890",
  "COM567890123",
];

const motivos = [
  "Validación SAT exitosa",
  "RFC receptor no encontrado",
  "Concepto no coincide con clave SAT",
  "Impuestos calculados incorrectamente",
  "Fecha fuera de rango permitido",
  "UUID duplicado",
  "Total no coincide con sumas",
  "Sin incidencias detectadas",
];

const tiposAlerta = [
  "Validación SAT fallida",
  "Discrepancia en totales",
  "Concepto no alineado con actividad",
  "Proveedor con riesgo alto",
  "Documento faltante",
  "Vencimiento próximo",
];

export const cfdiEmitidos: CFDIEmitido[] = Array.from({ length: 35 }, (_, i) => {
  const clienteIndex = i % razonesSociales.length;
  const estatus: Estatus = i % 10 === 0 ? "Critical" : i % 5 === 0 ? "Warn" : "OK";
  const tipo: TipoCFDI = ["Ingreso", "Egreso", "Traslado", "Pago"][i % 4] as TipoCFDI;
  const total = Math.random() * 100000 + 1000;
  
  return {
    id: `emit-${i + 1}`,
    uuid: generateUUID().toUpperCase(),
    fecha: format(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    cliente: {
      rfc: rfcList[clienteIndex],
      razonSocial: razonesSociales[clienteIndex],
    },
    total: Math.round(total * 100) / 100,
    subtotal: Math.round(total * 0.84 * 100) / 100,
    impuestos: Math.round(total * 0.16 * 100) / 100,
    estatus,
    motivo: motivos[i % motivos.length],
    tipo,
  };
});

export const cfdiRecibidos: CFDIRecibido[] = Array.from({ length: 40 }, (_, i) => {
  const proveedorIndex = i % razonesSociales.length;
  const estatus: Estatus = i % 12 === 0 ? "Critical" : i % 6 === 0 ? "Warn" : "OK";
  const riesgo: Riesgo = i % 15 === 0 ? "alto" : i % 8 === 0 ? "medio" : "bajo";
  const tipo: TipoCFDI = ["Ingreso", "Egreso", "Traslado", "Pago"][i % 4] as TipoCFDI;
  const total = Math.random() * 150000 + 500;
  
  return {
    id: `rec-${i + 1}`,
    uuid: generateUUID().toUpperCase(),
    fecha: format(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    proveedor: {
      rfc: rfcList[proveedorIndex],
      razonSocial: razonesSociales[proveedorIndex],
    },
    total: Math.round(total * 100) / 100,
    subtotal: Math.round(total * 0.84 * 100) / 100,
    impuestos: Math.round(total * 0.16 * 100) / 100,
    estatus,
    riesgo,
    tipo,
    consistenciaConcepto: {
      ok: i % 7 !== 0,
      explicacion: i % 7 === 0 ? "La clave SAT no corresponde al concepto descrito" : undefined,
    },
  };
});

export const alertas: Alerta[] = Array.from({ length: 60 }, (_, i) => {
  const severidad: SeveridadAlerta = i % 20 === 0 ? "crítica" : i % 10 === 0 ? "alta" : i % 5 === 0 ? "media" : "baja";
  const tipo: TipoAlerta = ["validación", "consistencia", "riesgo", "vencimiento", "discrepancia"][i % 5] as TipoAlerta;
  const estado: EstadoAlerta = i % 15 === 0 ? "Resuelta" : i % 8 === 0 ? "En revisión" : "Nueva";
  
  return {
    id: `alert-${i + 1}`,
    severidad,
    tipo,
    titulo: tiposAlerta[i % tiposAlerta.length],
    descripcion: `Se detectó una ${tipo} en el ${i % 2 === 0 ? "CFDI" : "proveedor"} relacionado. Requiere revisión inmediata.`,
    fecha: format(new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    entidadRelacionada: {
      tipo: i % 2 === 0 ? "CFDI" : "Proveedor",
      id: i % 2 === 0 ? `emit-${Math.floor(i / 2) + 1}` : `prov-${Math.floor(i / 2) + 1}`,
      nombre: i % 2 === 0 ? `CFDI ${generateUUID().substring(0, 8)}` : razonesSociales[i % razonesSociales.length],
    },
    estado,
    responsable: estado !== "Nueva" ? ["Juan Pérez", "María González", "Carlos Rodríguez"][i % 3] : undefined,
    evidencia: `Fragmento XML: <Total>${Math.round(Math.random() * 100000)}</Total>`,
    recomendacion: "Verificar con el proveedor y solicitar corrección del documento.",
  };
});

export const proveedores: Proveedor[] = Array.from({ length: 20 }, (_, i) => {
  const riesgo: Riesgo = i % 8 === 0 ? "alto" : i % 4 === 0 ? "medio" : "bajo";
  const semaforo: Estatus = riesgo === "alto" ? "Critical" : riesgo === "medio" ? "Warn" : "OK";
  
  return {
    id: `prov-${i + 1}`,
    rfc: rfcList[i % rfcList.length],
    razonSocial: razonesSociales[i % razonesSociales.length],
    volumenFacturas: Math.floor(Math.random() * 500 + 10),
    riesgoPromedio: riesgo,
    alertasAbiertas: Math.floor(Math.random() * 15),
    facturasRecientes: Math.floor(Math.random() * 50 + 5),
    semaforoAlineacion: semaforo,
    esCritico: riesgo === "alto",
    enListaConfianza: riesgo === "bajo" && i % 3 === 0,
  };
});

export const documentosLegales: DocumentoLegal[] = [
  {
    id: "doc-1",
    tipo: "Acta constitutiva",
    nombre: "Acta_Constitutiva_2024.pdf",
    fechaSubida: format(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    estatusAnalisis: "listo",
    objetoSocial: "Prestación de servicios de consultoría fiscal, asesoría legal y desarrollo de software. Comercialización de productos tecnológicos.",
    resumen: "Objeto social detectado: Servicios profesionales y tecnología. Actividades principales: Consultoría, desarrollo de software, comercialización.",
  },
  {
    id: "doc-2",
    tipo: "Asamblea",
    nombre: "Acta_Asamblea_Extraordinaria_2024.pdf",
    fechaSubida: format(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    estatusAnalisis: "en proceso",
  },
  {
    id: "doc-3",
    tipo: "Poderes",
    nombre: "Poder_Notarial_Representante_Legal.pdf",
    fechaSubida: format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    estatusAnalisis: "pendiente",
  },
  {
    id: "doc-4",
    tipo: "Otros",
    nombre: "Constancia_Fiscal_2024.pdf",
    fechaSubida: format(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    estatusAnalisis: "listo",
    resumen: "Constancia fiscal vigente hasta diciembre 2024.",
  },
  {
    id: "doc-5",
    tipo: "Acta constitutiva",
    nombre: "Modificacion_Acta_2023.pdf",
    fechaSubida: format(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    estatusAnalisis: "listo",
    objetoSocial: "Modificación al objeto social para incluir actividades de comercio electrónico y servicios de logística.",
    resumen: "Modificación detectada: Se agregaron actividades de e-commerce y logística.",
  },
];

