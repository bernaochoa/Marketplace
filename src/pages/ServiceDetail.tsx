// Imports de React y hooks
import { useEffect } from 'react'
// Imports de React Router para navegación y parámetros de ruta
import { useParams, Link } from 'react-router-dom'
// Context para acceder al estado global de la aplicación
import { useAppState } from '../context/AppStateContext'
// Componente para comparar y seleccionar cotizaciones
import ComparadorCotizaciones from '../components/ComparadorCotizaciones'
// Hook personalizado para mostrar skeleton loading
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'

/**
 * Componente ServiceDetail
 * 
 * Página de detalle de un servicio específico.
 * Muestra:
 * - Información completa del servicio (título, descripción, categoría, ubicación, etc.)
 * - Estado del servicio (PUBLICADO, EN_EVALUACION, ASIGNADO, COMPLETADO)
 * - Insumos requeridos para el servicio
 * - Cotizaciones recibidas para este servicio
 * - Permite seleccionar una cotización para asignar el servicio
 */
const ServiceDetail = () => {
  // Obtener el ID del servicio desde los parámetros de la URL
  // Ejemplo: /app/servicios/srv-01 → id = "srv-01"
  const { id } = useParams<{ id: string }>()
  
  // Obtener datos y funciones del estado global mediante Context API
  // services: Array con todos los servicios
  // quotes: Array con todas las cotizaciones
  // selectQuote: Función para seleccionar una cotización para un servicio
  // selectedQuotes: Mapeo de serviceId -> quoteId (cotizaciones seleccionadas)
  const { services, quotes, selectQuote, selectedQuotes } = useAppState()
  
  // Buscar el servicio específico por su ID
  const service = services.find((s) => s.id === id)
  
  // Hook personalizado que muestra skeleton loading durante 800ms
  // Se reinicia cuando cambia el ID del servicio (service?.id)
  const isLoading = useSkeletonDelay([service?.id])

  /**
   * MOUNT: Se ejecuta SOLO UNA VEZ cuando el componente se monta
   * Array vacío [] = solo en mount/unmount
   * 
   * Ejemplos de uso:
   * - Scroll al inicio de la página
   * - Registrar visita/analytics
   * - Cargar datos iniciales
   * - Inicializar suscripciones
   */
  useEffect(() => {
    // Scroll suave al inicio cuando el componente se monta
    window.scrollTo({ top: 0, behavior: 'smooth' })
    console.log('ServiceDetail montado - servicio:', id)
    
    // CLEANUP: Se ejecuta cuando el componente se desmonta
    return () => {
      console.log('ServiceDetail desmontado - limpiando recursos')
    }
  }, []) // Array vacío = MOUNT puro (solo una vez)

  // Si el servicio no existe, mostrar mensaje de error
  if (!service) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">Servicio no encontrado</p>
        <Link to="/app" className="mt-4 inline-block text-sm font-semibold text-brand-500 hover:text-brand-400">
          Volver al dashboard
        </Link>
      </div>
    )
  }

  // Filtrar solo las cotizaciones de este servicio específico
  const serviceQuotes = quotes.filter((q) => q.serviceId === service.id)
  
  // Buscar la cotización seleccionada para este servicio (si existe)
  const selectedQuote = serviceQuotes.find((q) => q.id === selectedQuotes[service.id])

  /**
   * Mapeo de estados del servicio a etiquetas legibles en español
   * Se usa para mostrar el estado en la interfaz
   */
  const estadoLabels: Record<string, string> = {
    PUBLICADO: 'Publicado',
    EN_EVALUACION: 'En Evaluación',
    ASIGNADO: 'Asignado',
    COMPLETADO: 'Completado',
  }

  /**
   * Mapeo de categorías del servicio a etiquetas legibles en español
   * Se usa para mostrar la categoría en la interfaz
   */
  const categoriaLabels: Record<string, string> = {
    jardineria: 'Jardinería',
    piscinas: 'Piscinas',
    limpieza: 'Limpieza',
    otros: 'Otros',
  }

  /**
   * Mapeo de estados del servicio a clases CSS de colores
   * Cada estado tiene un color diferente para identificación visual
   */
  const estadoColors: Record<string, string> = {
    PUBLICADO: 'bg-blue-100 text-blue-700 border-blue-200',
    EN_EVALUACION: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    ASIGNADO: 'bg-green-100 text-green-700 border-green-200',
    COMPLETADO: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header de la página con navegación y título */}
      <header>
        {/* Link para volver al dashboard */}
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-500 hover:text-brand-400 mb-2"
        >
          ← Volver
        </Link>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Detalle de Servicio</p>
        <h2 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">{service.title}</h2>
        <p className="text-xs text-slate-500">Gestiona los detalles del servicio y compara cotizaciones.</p>
      </header>

      {/* Grid principal: información del servicio a la izquierda, cotizaciones a la derecha */}
      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        {/* Columna izquierda: Información del servicio */}
        {/* lg:sticky hace que se quede fijo al hacer scroll */}
        <div className="lg:sticky lg:top-4 lg:h-fit space-y-3 order-2 lg:order-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-card">
            {/* Badges: ID del servicio, estado y cotización seleccionada */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {/* ID del servicio */}
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600">
                {service.id}
              </span>
              {/* Estado del servicio con color según el estado */}
              <span
                className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
                  estadoColors[service.estado] || estadoColors.PUBLICADO
                }`}
              >
                {estadoLabels[service.estado] || service.estado}
              </span>
              {/* Badge que indica si hay una cotización seleccionada */}
              {selectedQuote && (
                <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  ✓ Seleccionada
                </span>
              )}
            </div>

            {/* Descripción del servicio */}
            <div className="mb-3">
              <p className="text-xs text-slate-600">{service.description}</p>
            </div>

            {/* Información detallada: Categoría, Ciudad, Dirección, Fecha Preferida */}
            <div className="space-y-2 mb-3">
              <div>
                <p className="text-[10px] uppercase text-slate-400">Categoría</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-900 capitalize">
                  {categoriaLabels[service.categoria] || service.categoria}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400">Ciudad</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-900">{service.ciudad}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400">Dirección</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-900">{service.direccion}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400">Fecha Preferida</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-900">
                  {new Date(service.fechaPreferida).toLocaleDateString('es-UY')}
                </p>
              </div>
            </div>

            {/* Panel destacado con la cotización seleccionada (si existe) */}
            {selectedQuote && (
              <div className="mb-3 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-3">
                <p className="text-[10px] font-semibold uppercase text-emerald-700">Cotización Seleccionada</p>
                <p className="mt-1 text-sm font-semibold text-emerald-900">
                  {selectedQuote.providerName}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-emerald-800">
                  {selectedQuote.currency} {selectedQuote.totalPrice.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  Plazo: {selectedQuote.leadTimeDays} días · Rating: ⭐ {selectedQuote.rating.toFixed(1)}
                </p>
                {/* Mensaje adicional de la cotización (si existe) */}
                {selectedQuote.message && (
                  <p className="mt-2 text-xs text-emerald-700">{selectedQuote.message}</p>
                )}
              </div>
            )}

            {/* Sección de insumos requeridos */}
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-slate-900 mb-2">Insumos Requeridos</h3>
              {service.insumosRequeridos?.length > 0 ? (
                // Lista de insumos requeridos
                <div className="space-y-2">
                  {service.insumosRequeridos.map((insumo) => (
                    <div
                      key={insumo.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700"
                    >
                      <p className="font-semibold text-slate-900">{insumo.name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {insumo.quantity} {insumo.unit}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                // Mensaje cuando no hay insumos requeridos
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-center text-xs text-slate-500">
                  No se especificaron insumos requeridos
                </div>
              )}
            </div>

            {/* Información de fechas: Publicado y Asignado (si aplica) */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-500">
              <p>
                <span className="font-semibold">Publicado:</span>{' '}
                {new Date(service.createdAt).toLocaleDateString('es-UY', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              {/* Mostrar información de asignación si el servicio está asignado */}
              {service.estado === 'ASIGNADO' && selectedQuote && (
                <p className="mt-1">
                  <span className="font-semibold">Asignado:</span> {selectedQuote.providerName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha: Cotizaciones recibidas */}
        <div className="min-w-0 order-1 lg:order-2">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Cotizaciones Recibidas</h3>
          <p className="text-xs text-slate-500 mb-3">
            Selecciona una cotización para asignar el servicio.
          </p>
          {/* Componente para comparar y seleccionar cotizaciones */}
          <ComparadorCotizaciones
            quotes={serviceQuotes}
            selectedQuoteId={selectedQuotes[service.id]}
            onSelectQuote={(quoteId) => selectQuote(service.id, quoteId)}
            serviceTitle={service.title}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail
