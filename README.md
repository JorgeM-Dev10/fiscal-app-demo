# FiscalGuard - Sistema de Validación Fiscal

Frontend demo (mockup navegable) de un sistema SaaS tipo dashboard para validación fiscal y legal.

## 🚀 Características

- **Dashboard completo** con KPIs, gráficas y feed de actividad
- **Gestión de CFDI** (Emitidos y Recibidos) con validación y filtros avanzados
- **Centro de alertas** con gestión de estados y asignación de responsables
- **Documentos legales** con análisis de objeto social
- **Validaciones SAT** con catálogo de claves y reglas de alineación
- **Gestión de proveedores** con evaluación de riesgo
- **Integraciones** con sistemas externos
- **Reportes** personalizables
- **Configuración** completa del sistema

## 🛠️ Stack Tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui** (componentes UI personalizados)
- **lucide-react** (iconos)
- **recharts** (gráficas)

## 📦 Instalación

1. Clona el repositorio o navega al directorio del proyecto

2. Instala las dependencias:

```bash
npm install
```

## 🏃 Ejecución

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

El servidor se iniciará en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
app-fiscal/
├── app/                    # Páginas y rutas (App Router)
│   ├── dashboard/          # Dashboard principal
│   ├── cfdi/              # CFDI Emitidos y Recibidos
│   ├── alertas/           # Centro de alertas
│   ├── documentos-legales/ # Documentos legales
│   ├── validaciones-sat/  # Validaciones SAT
│   ├── proveedores/       # Gestión de proveedores
│   ├── integraciones/     # Integraciones
│   ├── reportes/         # Reportes
│   └── configuracion/     # Configuración
├── components/            # Componentes React
│   ├── layout/           # Layout, Sidebar, Topbar
│   └── ui/              # Componentes UI reutilizables
├── lib/                  # Utilidades
├── mock/                 # Datos mock (JSON/TS)
└── public/              # Archivos estáticos
```

## 🎨 Características de UI/UX

- **Diseño minimalista y moderno** con mucho espacio en blanco
- **Estados de color**:
  - Verde = OK
  - Amarillo = Warn
  - Rojo = Critical
  - Azul = Acción primaria
- **Componentes interactivos**:
  - Buscador global
  - Filtros avanzados
  - Paginación
  - Quick view (drawer lateral)
  - Acciones por fila
- **Micro detalles**:
  - Loading states con spinner
  - Badges de estado
  - Tooltips informativos
  - Drawer lateral para XML/alertas
  - Botón flotante para acciones rápidas

## 📊 Datos Mock

Todos los datos son simulados y se encuentran en `/mock/data.ts`:
- CFDI Emitidos (35 items)
- CFDI Recibidos (40 items)
- Alertas (60 items)
- Proveedores (20 items)
- Documentos Legales (5 items)

## 🔄 Interacciones Simuladas

- **Sincronización**: Simula carga de datos con timeout
- **Marcar como revisado/resuelto**: Actualiza estado local
- **Filtros y búsqueda**: Filtrado en tiempo real
- **Drawer lateral**: Visualización de XML y detalles sin salir de la lista
- **Estados locales**: Todo funciona con React state (sin backend)

## 📝 Rutas Disponibles

- `/dashboard` - Dashboard principal
- `/cfdi/emitidos` - CFDI Emitidos
- `/cfdi/emitidos/[id]` - Detalle CFDI Emitido
- `/cfdi/recibidos` - CFDI Recibidos
- `/cfdi/recibidos/[id]` - Detalle CFDI Recibido
- `/alertas` - Centro de alertas
- `/documentos-legales` - Documentos legales
- `/validaciones-sat` - Validaciones SAT
- `/proveedores` - Lista de proveedores
- `/proveedores/[rfc]` - Perfil de proveedor
- `/integraciones` - Integraciones
- `/reportes` - Reportes
- `/configuracion` - Configuración

## 🎯 Funcionalidades Principales

### Dashboard
- KPIs en tiempo real
- Gráficas de alertas y motivos
- Tabla de alertas recientes
- Feed de actividad
- Acciones rápidas

### CFDI
- Tablas con filtros avanzados
- Búsqueda por UUID, RFC, cliente/proveedor
- Vista de detalle completa
- Inspector XML
- Drawer lateral para quick view

### Alertas
- Filtros por severidad, tipo, estado
- Acciones masivas
- Detalle completo con recomendaciones
- Asignación de responsables

### Documentos Legales
- Subida drag & drop (simulada)
- Análisis de objeto social
- Edición y confirmación de texto

### Validaciones SAT
- Actividades del contribuyente
- Catálogo de claves SAT
- Constancia fiscal
- Reglas de alineación configurables

## 🚧 Notas Importantes

- **No hay backend real**: Todo funciona con datos mock y estados locales
- **Sin autenticación**: Se simula usuario logueado
- **Datos en memoria**: Los cambios se pierden al recargar la página
- **Demo funcional**: Todas las interacciones están implementadas pero son simuladas

## 📄 Scripts Disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## 🎨 Personalización

Los colores y estilos se pueden personalizar en:
- `tailwind.config.ts` - Configuración de Tailwind
- `app/globals.css` - Variables CSS y estilos globales

## 📚 Próximos Pasos

Para convertir esto en una aplicación real, necesitarías:
1. Implementar backend (API REST o GraphQL)
2. Base de datos (PostgreSQL, MongoDB, etc.)
3. Autenticación real (NextAuth, Auth0, etc.)
4. Integración con servicios SAT
5. Procesamiento real de XML
6. Sistema de notificaciones

## 📞 Soporte

Este es un proyecto demo. Para preguntas o sugerencias, consulta la documentación de Next.js y las librerías utilizadas.

---

Desarrollado con ❤️ usando Next.js y TypeScript

