# Marketplace de Servicios con Insumos

Plataforma web donde un Solicitante publica servicios, Proveedores de Servicio cotizan esos pedidos, y Proveedores de Insumos ofrecen los insumos requeridos para ejecutar el servicio.

## Stack Tecnológico

- **Frontend**: React.js 19.2.0 con TypeScript
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.9.6
- **Estilos**: Tailwind CSS 3.4.13
- **Estado**: React Context API + localStorage para persistencia
- **Autenticación**: Hardcodeada (lista fija de usuarios)

## Instalación y Ejecución

### Requisitos Previos

- Node.js 18+ y npm

### Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   - La aplicación estará disponible en `http://localhost:5173`

4. **Build para producción:**
   ```bash
   npm run build
   ```

## Usuarios Hardcodeados

El sistema incluye 3 usuarios preconfigurados para testing:

### Solicitante
- **Email**: `maria@cliente.com`
- **Contraseña**: `solicitante123`
- **Rol**: SOLICITANTE
- **Organización**: Ministerio de Salud

### Proveedor de Servicio
- **Email**: `luis@infra.com`
- **Contraseña**: `proveedor123`
- **Rol**: PROVEEDOR_SERVICIO
- **Organización**: InfraWorks

### Proveedor de Insumos
- **Email**: `ana@insumos.co`
- **Contraseña**: `insumos123`
- **Rol**: PROVEEDOR_INSUMOS
- **Organización**: Insumos del Sur

## Funcionalidades por Rol

### Solicitante

- ✅ **Publicar servicios**: Crear servicios con título, descripción, categoría, ubicación, fecha preferida e insumos requeridos
- ✅ **Ver servicios publicados**: Lista de todos los servicios creados
- ✅ **Comparar cotizaciones**: Tabla comparativa con precio, plazo, rating y desglose
- ✅ **Seleccionar cotización**: Al seleccionar, el servicio cambia a estado "ASIGNADO"
- ✅ **Historial**: Ver todos los servicios con su estado y cotización seleccionada

### Proveedor de Servicio

- ✅ **Ver servicios publicados**: Lista de servicios disponibles para cotizar
- ✅ **Enviar cotización**: Crear cotización con precio, plazo, mensaje y desglose de ítems
- ✅ **Editar cotización**: Modificar cotizaciones mientras el servicio esté en "PUBLICADO" o "EN_EVALUACION"
- ✅ **Eliminar cotización**: Retirar cotizaciones antes de que el servicio sea asignado
- ✅ **Ver mis cotizaciones**: Página dedicada con todas las cotizaciones enviadas

### Proveedor de Insumos

- ✅ **Catálogo de insumos**: CRUD completo de insumos (crear, editar, eliminar)
- ✅ **Crear packs**: Agrupar insumos con descuento automático
- ✅ **Múltiples monedas**: Soporte para USD, UYU, EUR, ARS, BRL con conversión automática a USD
- ✅ **Filtros por categoría**: Filtrar insumos en el catálogo

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/             # Context API para estado global
├── data/                # Datos iniciales y tipos
├── hooks/               # Custom hooks
├── pages/               # Páginas principales
├── screens/             # Dashboards por rol
├── App.tsx              # Router principal
└── main.tsx             # Punto de entrada
```

## Modelo de Datos

### Service (Servicio)
```typescript
{
  id: string
  solicitanteId: string
  title: string
  description: string
  categoria: 'jardineria' | 'piscinas' | 'limpieza' | 'otros'
  direccion: string
  ciudad: string
  fechaPreferida: string // ISO date
  insumosRequeridos: RequiredSupply[]
  estado: 'PUBLICADO' | 'EN_EVALUACION' | 'ASIGNADO' | 'COMPLETADO'
  cotizacionSeleccionadaId?: string
  createdAt: string
}
```

### Quote (Cotización)
```typescript
{
  id: string
  serviceId: string
  providerId: string
  providerName: string
  totalPrice: number
  currency: string
  leadTimeDays: number
  rating: number // 1-5
  message: string
  suppliesBreakdown: QuoteLine[]
}
```

### Supply (Insumo)
```typescript
{
  id: string
  name: string
  category: string
  unit: string
  price: number
  currency: 'USD' | 'UYU' | 'EUR' | 'ARS' | 'BRL'
  stock: number
  description?: string
}
```

## Persistencia de Datos

Los datos se persisten en `localStorage` del navegador:

- **Servicios**: `servicios-market-services`
- **Cotizaciones**: `servicios-market-quotes`
- **Insumos**: `servicios-market-supplies`
- **Packs**: `servicios-market-packs`
- **Cotizaciones seleccionadas**: `servicios-market-selected-quotes`

**Nota**: Al recargar la página, los datos persisten. Para resetear, limpiar el localStorage del navegador.

## Rutas

- `/` - Página de inicio
- `/seleccionar-rol` - Selección de rol de usuario
- `/app` - Dashboard principal (según rol)
- `/app/servicios/:id` - Detalle de servicio con cotizaciones
- `/app/insumos` - Catálogo de insumos (Proveedor de Insumos)
- `/app/cotizaciones` - Mis cotizaciones (Proveedor de Servicio)

## Decisiones Técnicas

### Estado Global
- **React Context API**: Para estado compartido entre componentes
  - `AppStateContext`: Gestiona servicios, cotizaciones, insumos y packs
  - `AuthContext`: Gestiona autenticación y usuarios actuales
- **localStorage**: Para persistencia sin backend
  - Los datos se guardan automáticamente al modificar el estado
  - Se cargan al inicializar la aplicación
- **No Redux**: Se optó por Context API por simplicidad del proyecto

### Routing
- **React Router DOM**: Navegación SPA con rutas anidadas
  - Rutas principales en `App.tsx`
  - Rutas anidadas en `DashboardShell.tsx` para `/app/*`
- **Rutas protegidas**: Verificación de autenticación en `DashboardShell`
  - Si no está autenticado, muestra el componente `Login`
  - Las rutas dentro de `/app/*` requieren autenticación

### Mockeo de Datos
- **Datos iniciales**: Definidos en `src/data/initialData.ts`
  - `INITIAL_SERVICES`: Servicios de ejemplo con diferentes estados
  - `INITIAL_QUOTES`: Cotizaciones de ejemplo con múltiples monedas
  - `INITIAL_SUPPLIES`: Insumos de ejemplo con diferentes categorías
  - `INITIAL_PACKS`: Packs de ejemplo
  - `INITIAL_USERS`: Usuarios hardcodeados para autenticación
- **Persistencia**: Los datos se cargan desde `localStorage` si existen, sino se usan los datos iniciales
- **Conversión de monedas**: Tasas fijas en `CURRENCY_RATES` (USD, UYU, EUR, ARS, BRL)
  - Función `convertToUSD()` para normalizar precios
  - Función `convertFromUSD()` para convertir de USD a otras monedas

### Validaciones
- **Formularios HTML5**: Validación nativa con `required`
- **Validación de precios**: Precios deben ser > 0
- **Validación de fechas**: Fecha preferida no puede ser en el pasado (usando `min` en input date)

### UX/UI
- **Skeleton Loading**: Estados de carga con `SkeletonList` component
  - Hook `useSkeletonDelay` para controlar tiempos de carga (800ms)
  - Variantes: `supply`, `service`, `pack`, `comparator`, `form`, etc.
- **Responsive Design**: Tailwind CSS con breakpoints `sm:`, `md:`, `lg:`
  - Mobile-first approach
  - Tablas se convierten en cards en mobile
- **Empty States**: Mensajes cuando no hay datos
- **Feedback Visual**: Modales de confirmación para acciones destructivas (`DeleteConfirmModal`)

## Flujo Principal

1. **Solicitante publica servicio** → Estado: `PUBLICADO`
2. **Proveedores envían cotizaciones** → Servicio puede cambiar a `EN_EVALUACION`
3. **Solicitante compara y selecciona** → Estado: `ASIGNADO`, se guarda `cotizacionSeleccionadaId`
4. **Servicio completado** → Estado: `COMPLETADO` (manual)

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter de código

## Notas Adicionales

- Los datos iniciales se cargan desde `src/data/initialData.ts`
- Los estados de carga usan un delay de 800ms para mejor UX
- El sistema soporta múltiples monedas con conversión automática a USD para packs
- Los componentes son completamente responsive para mobile y desktop
