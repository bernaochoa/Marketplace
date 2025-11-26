import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import { useAuth } from '../context/AuthContext'
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'

const CotizacionesPage = () => {
  const { quotes, services, removeQuote } = useAppState()
  const { currentUser } = useAuth()
  const isLoading = useSkeletonDelay([quotes.length])

  const myQuotes = quotes.filter((q) => q.providerId === currentUser?.id)

  const handleDelete = (quoteId: string) => {
    if (confirm('¿Estás seguro de eliminar esta cotización?')) {
      removeQuote(quoteId)
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Mis Cotizaciones</h1>
        <p className="mt-1 text-sm text-slate-500">Gestiona las cotizaciones que has enviado</p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-2 h-6 w-48 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : myQuotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          No has enviado cotizaciones aún
        </div>
      ) : (
        <div className="space-y-3">
          {myQuotes.map((quote) => {
            const service = services.find((s) => s.id === quote.serviceId)
            const canEdit = service?.estado === 'PUBLICADO' || service?.estado === 'EN_EVALUACION'

            return (
              <div key={quote.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">{quote.id}</p>
                      {!canEdit && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {service?.estado === 'ASIGNADO' ? 'Asignada' : 'Cerrada'}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900">
                      {service?.title || 'Servicio no encontrado'}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{quote.message || 'Sin mensaje adicional'}</p>
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
                    <Link
                      to={`/app/servicios/${quote.serviceId}`}
                      className="mt-3 inline-block text-xs font-semibold text-brand-500 hover:text-brand-400"
                    >
                      Ver servicio →
                    </Link>
                  </div>
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

