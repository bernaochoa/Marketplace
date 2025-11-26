// Imports de React Router para navegación
import { Link } from 'react-router-dom'
// Context para acceder al estado global de la aplicación
import { useAppState } from '../context/AppStateContext'
// Context para obtener el usuario actual
import { useAuth } from '../context/AuthContext'
// Hook personalizado para mostrar skeleton loading
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'

/**
 * Componente CotizacionesPage
 * 
 * Página para que los Proveedores de Servicio gestionen sus cotizaciones.
 * Muestra:
 * - Lista de todas las cotizaciones enviadas por el usuario actual
 * - Información de cada cotización (precio, plazo, rating, desglose)
 * - Estado de la cotización (si puede editarse o ya está asignada/cerrada)
 * - Opción para eliminar cotizaciones (solo si el servicio está en PUBLICADO o EN_EVALUACION)
 * - Link para ver el detalle del servicio asociado
 */
const CotizacionesPage = () => {
  // Obtener datos y funciones del estado global mediante Context API
  // quotes: Array con todas las cotizaciones del sistema
  // services: Array con todos los servicios
  // removeQuote: Función para eliminar una cotización
  const { quotes, services, removeQuote } = useAppState()
  
  // Obtener el usuario actual del Context de autenticación
  // Se usa para filtrar solo las cotizaciones del usuario actual
  const { currentUser } = useAuth()
  
  // Hook personalizado que muestra skeleton loading durante 800ms
  // Se reinicia cuando cambia la cantidad de cotizaciones (quotes.length)
  const isLoading = useSkeletonDelay([quotes.length])

  // Filtrar solo las cotizaciones del usuario actual
  // Compara el providerId de cada cotización con el id del usuario actual
  const myQuotes = quotes.filter((q) => q.providerId === currentUser?.id)

  /**
   * Maneja la eliminación de una cotización
   * Muestra un diálogo de confirmación antes de eliminar
   * 
   * @param quoteId - ID de la cotización a eliminar
   */
  const handleDelete = (quoteId: string) => {
    if (confirm('¿Estás seguro de eliminar esta cotización?')) {
      removeQuote(quoteId)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header de la página con título y descripción */}
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Mis Cotizaciones</h1>
        <p className="mt-1 text-sm text-slate-500">Gestiona las cotizaciones que has enviado</p>
      </header>

      {/* Renderizado condicional según el estado de carga y datos */}
      {isLoading ? (
        // Mostrar skeleton loading mientras se cargan los datos
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-2 h-6 w-48 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : myQuotes.length === 0 ? (
        // Mostrar mensaje cuando no hay cotizaciones
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          No has enviado cotizaciones aún
        </div>
      ) : (
        // Mostrar lista de cotizaciones
        <div className="space-y-3">
          {myQuotes.map((quote) => {
            // Buscar el servicio asociado a esta cotización
            const service = services.find((s) => s.id === quote.serviceId)
            
            // Determinar si la cotización puede editarse
            // Solo se puede editar si el servicio está en PUBLICADO o EN_EVALUACION
            // Si está ASIGNADO o COMPLETADO, no se puede editar
            const canEdit = service?.estado === 'PUBLICADO' || service?.estado === 'EN_EVALUACION'

            return (
              <div key={quote.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  {/* Información de la cotización */}
                  <div className="flex-1">
                    {/* ID y estado de la cotización */}
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">{quote.id}</p>
                      {/* Mostrar badge si la cotización no se puede editar */}
                      {!canEdit && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {service?.estado === 'ASIGNADO' ? 'Asignada' : 'Cerrada'}
                        </span>
                      )}
                    </div>
                    
                    {/* Título del servicio */}
                    <h3 className="mt-1 text-sm font-semibold text-slate-900">
                      {service?.title || 'Servicio no encontrado'}
                    </h3>
                    
                    {/* Mensaje adicional de la cotización */}
                    <p className="mt-1 text-xs text-slate-500">{quote.message || 'Sin mensaje adicional'}</p>
                    
                    {/* Grid con métricas principales: Precio, Plazo, Rating */}
                    <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] uppercase text-slate-400">Precio Total</p>
                        <p className="text-sm font-semibold text-slate-900">USD {quote.totalPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-400">Plazo</p>
                        <p className="text-sm font-semibold text-slate-900">{quote.leadTimeDays} días</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-400">Rating</p>
                        <p className="text-sm font-semibold text-slate-900">⭐ {quote.rating.toFixed(1)}</p>
                      </div>
                    </div>
                    
                    {/* Desglose de insumos (si existe) */}
                    {quote.suppliesBreakdown.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[10px] uppercase text-slate-400">Desglose</p>
                        <div className="mt-1 space-y-1">
                          {quote.suppliesBreakdown.map((line) => (
                            <div key={line.id} className="text-xs text-slate-600">
                              {line.name} - {line.quantity} {line.unit} × USD {line.price.toFixed(2)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Link para ver el detalle del servicio */}
                    <Link
                      to={`/app/servicios/${quote.serviceId}`}
                      className="mt-3 inline-block text-xs font-semibold text-brand-500 hover:text-brand-400"
                    >
                      Ver servicio →
                    </Link>
                  </div>
                  
                  {/* Botones de acción - solo se muestran si se puede editar */}
                  {canEdit && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CotizacionesPage

