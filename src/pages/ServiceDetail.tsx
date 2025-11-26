import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import ComparadorCotizaciones from '../components/ComparadorCotizaciones'
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { services, quotes, selectQuote, selectedQuotes } = useAppState()
  const service = services.find((s) => s.id === id)
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

  const serviceQuotes = quotes.filter((q) => q.serviceId === service.id)
  const selectedQuote = serviceQuotes.find((q) => q.id === selectedQuotes[service.id])

  const estadoLabels: Record<string, string> = {
    PUBLICADO: 'Publicado',
    EN_EVALUACION: 'En Evaluación',
    ASIGNADO: 'Asignado',
    COMPLETADO: 'Completado',
  }

  const categoriaLabels: Record<string, string> = {
    jardineria: 'Jardinería',
    piscinas: 'Piscinas',
    limpieza: 'Limpieza',
    otros: 'Otros',
  }

  const estadoColors: Record<string, string> = {
    PUBLICADO: 'bg-blue-100 text-blue-700 border-blue-200',
    EN_EVALUACION: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    ASIGNADO: 'bg-green-100 text-green-700 border-green-200',
    COMPLETADO: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <header>
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

      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        {/* Columna izquierda: Información del servicio */}
        <div className="lg:sticky lg:top-4 lg:h-fit space-y-3 order-2 lg:order-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-card">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600">
                {service.id}
              </span>
              <span
                className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
                  estadoColors[service.estado] || estadoColors.PUBLICADO
                }`}
              >
                {estadoLabels[service.estado] || service.estado}
              </span>
              {selectedQuote && (
                <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  ✓ Seleccionada
                </span>
              )}
            </div>

            <div className="mb-3">
              <p className="text-xs text-slate-600">{service.description}</p>
            </div>

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
                {selectedQuote.message && (
                  <p className="mt-2 text-xs text-emerald-700">{selectedQuote.message}</p>
                )}
              </div>
            )}

            <div className="mb-3">
              <h3 className="text-xs font-semibold text-slate-900 mb-2">Insumos Requeridos</h3>
              {service.insumosRequeridos?.length > 0 ? (
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
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-center text-xs text-slate-500">
                  No se especificaron insumos requeridos
                </div>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-500">
              <p>
                <span className="font-semibold">Publicado:</span>{' '}
                {new Date(service.createdAt).toLocaleDateString('es-UY', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              {service.estado === 'ASIGNADO' && selectedQuote && (
                <p className="mt-1">
                  <span className="font-semibold">Asignado:</span> {selectedQuote.providerName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha: Cotizaciones */}
        <div className="min-w-0 order-1 lg:order-2">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Cotizaciones Recibidas</h3>
          <p className="text-xs text-slate-500 mb-3">
            Selecciona una cotización para asignar el servicio.
          </p>
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
