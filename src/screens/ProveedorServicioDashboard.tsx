import { useState } from 'react'
import { Link } from 'react-router-dom'
import SkeletonList from '../components/SkeletonList'
import FormularioCotizacion from '../components/FormularioCotizacion'
import { useAppState } from '../context/AppStateContext'
import { useAuth } from '../context/AuthContext'
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'
import { convertToUSD } from '../data/initialData'
import type { ServiceDemand } from '../data/initialData'

const ProveedorServicioDashboard = () => {
  const { services, quotes, addQuote, updateQuote, removeQuote } = useAppState()
  const { currentUser } = useAuth()
  const isLoading = useSkeletonDelay([services.length])
  const [selectedService, setSelectedService] = useState<ServiceDemand | null>(null)
  const [editingQuote, setEditingQuote] = useState<{ id: string; service: ServiceDemand; quote: any } | null>(null)

  const pendingServices = services.filter(
    (service) => service.estado === 'PUBLICADO' || service.estado === 'EN_EVALUACION',
  )
  const myQuotes = quotes.filter((q) => q.providerId === currentUser?.id)
  const avgTicket = myQuotes.length
    ? Math.round(myQuotes.reduce((acc, quote) => acc + convertToUSD(quote.totalPrice, quote.currency || 'USD'), 0) / myQuotes.length)
    : 0

  const handleSubmitQuote = (quoteData: {
    serviceId: string
    providerId: string
    providerName: string
    totalPrice: number
    currency: string
    leadTimeDays: number
    message: string
    suppliesBreakdown: any[]
  }) => {
    addQuote({
      ...quoteData,
      providerId: currentUser?.id || '',
      providerName: currentUser?.name || '',
      rating: 4.5, // Mock rating
    })
    setSelectedService(null)
  }

  const handleUpdateQuote = (quoteData: {
    serviceId: string
    providerId: string
    providerName: string
    totalPrice: number
    currency: string
    leadTimeDays: number
    message: string
    suppliesBreakdown: any[]
  }) => {
    if (editingQuote) {
      updateQuote(editingQuote.id, {
        totalPrice: quoteData.totalPrice,
        currency: quoteData.currency,
        leadTimeDays: quoteData.leadTimeDays,
        message: quoteData.message,
        suppliesBreakdown: quoteData.suppliesBreakdown,
      })
      setEditingQuote(null)
    }
  }

  const handleDeleteQuote = (quoteId: string) => {
    if (confirm('¿Estás seguro de eliminar esta cotización?')) {
      removeQuote(quoteId)
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <header>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Proveedor de servicio</p>
        <h2 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">Oportunidades para cotizar</h2>
        <p className="text-xs text-slate-500">Revisa las solicitudes recientes y envía tu propuesta.</p>
      </header>
      {isLoading ? (
        <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
              <div className="h-2.5 w-24 rounded bg-slate-200" />
              <div className="mt-1.5 h-6 w-16 rounded bg-slate-200" />
            </article>
          ))}
        </div>
      ) : (
        <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
            <p className="text-[10px] uppercase text-slate-400">Demandas activas</p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900">{pendingServices.length}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
            <p className="text-[10px] uppercase text-slate-400">Ticket promedio</p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900">USD {avgTicket.toLocaleString()}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
            <p className="text-[10px] uppercase text-slate-400">Cotizaciones enviadas</p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900">{myQuotes.length}</p>
          </article>
        </div>
      )}

      {selectedService && (
        <FormularioCotizacion
          service={selectedService}
          onSubmit={handleSubmitQuote}
          onCancel={() => setSelectedService(null)}
        />
      )}

      {editingQuote && (
        <FormularioCotizacion
          service={editingQuote.service}
          onSubmit={handleUpdateQuote}
          onCancel={() => setEditingQuote(null)}
          editingQuote={editingQuote.quote}
        />
      )}

      {isLoading ? (
        <SkeletonList rows={4} variant="service" />
      ) : pendingServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">No hay servicios disponibles para cotizar en este momento.</p>
          <p className="mt-2 text-xs text-slate-400">Los nuevos servicios aparecerán aquí cuando sean publicados.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {pendingServices.map((service) => {
              const existingQuote = myQuotes.find((q) => q.serviceId === service.id)
              return (
                <div key={service.id} className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">{service.id}</p>
                      <h3 className="text-sm font-semibold text-slate-900">{service.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      {existingQuote ? (
                        <>
                          <button
                            onClick={() =>
                              setEditingQuote({
                                id: existingQuote.id,
                                service,
                                quote: existingQuote,
                              })
                            }
                            className="rounded-full border border-brand-500 px-3 py-1.5 text-xs font-semibold text-brand-500 hover:bg-brand-50 flex-shrink-0"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteQuote(existingQuote.id)}
                            className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 flex-shrink-0"
                          >
                            Eliminar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedService(service)}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 flex-shrink-0"
                        >
                          Enviar cotización
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">{service.description}</p>
                  <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] uppercase text-slate-400">Categoría</p>
                      <p className="text-xs font-semibold text-slate-900 capitalize">{service.categoria}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400">Ciudad</p>
                      <p className="text-xs font-semibold text-slate-900">{service.ciudad}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400">Insumos</p>
                      <p className="text-xs font-semibold text-slate-900">
                        {service.insumosRequeridos?.length || 0} ítems
                      </p>
                    </div>
                  </div>
                  {existingQuote && (
                    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2">
                      <p className="text-[10px] font-semibold uppercase text-emerald-700">Cotización Enviada</p>
                      <p className="mt-0.5 text-xs font-semibold text-emerald-900">
                        {existingQuote.currency} {existingQuote.totalPrice.toLocaleString()} · {existingQuote.leadTimeDays} días
                      </p>
                    </div>
                  )}
                  <Link
                    to={`/app/servicios/${service.id}`}
                    className="mt-2 block text-xs font-semibold text-brand-500 hover:text-brand-400"
                  >
                    Ver detalles →
                  </Link>
                </div>
              )
            })}
          </div>

          {myQuotes.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Mis Cotizaciones Recientes</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Últimas cotizaciones que has enviado</p>
                </div>
                <Link
                  to="/app/cotizaciones"
                  className="text-xs font-semibold text-brand-500 hover:text-brand-400"
                >
                  Ver todas →
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {myQuotes.slice(0, 3).map((quote) => {
                  const service = services.find((s) => s.id === quote.serviceId)
                  const canEdit = service?.estado === 'PUBLICADO' || service?.estado === 'EN_EVALUACION'
                  return (
                    <div key={quote.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-widest text-slate-400">{quote.id}</p>
                          <h4 className="mt-0.5 text-xs font-semibold text-slate-900 line-clamp-1">
                            {service?.title || 'Servicio no encontrado'}
                          </h4>
                        </div>
                        {!canEdit && (
                          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 flex-shrink-0">
                            {service?.estado === 'ASIGNADO' ? 'Asignada' : 'Cerrada'}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div>
                          <p className="text-[9px] uppercase text-slate-400">Precio</p>
                          <p className="text-xs font-semibold text-slate-900">
                            {quote.currency} {quote.totalPrice.toLocaleString()}
                            {quote.currency !== 'USD' && (
                              <span className="ml-1 text-[10px] text-slate-500">
                                (≈ USD {convertToUSD(quote.totalPrice, quote.currency).toLocaleString()})
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase text-slate-400">Plazo</p>
                          <p className="text-xs font-semibold text-slate-900">{quote.leadTimeDays} días</p>
                        </div>
                        {quote.message && (
                          <p className="text-[10px] text-slate-500 line-clamp-1">{quote.message}</p>
                        )}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Link
                          to={`/app/servicios/${quote.serviceId}`}
                          className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 text-center"
                        >
                          Ver servicio
                        </Link>
                        {canEdit && (
                          <button
                            onClick={() => {
                              const service = services.find((s) => s.id === quote.serviceId)
                              if (service) {
                                setEditingQuote({
                                  id: quote.id,
                                  service,
                                  quote,
                                })
                              }
                            }}
                            className="rounded-lg border border-brand-500 px-2 py-1 text-[10px] font-semibold text-brand-500 hover:bg-brand-50"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProveedorServicioDashboard
