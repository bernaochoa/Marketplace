import { useEffect, useMemo, useState } from 'react'
import DemandaList from '../components/DemandaList'
import ComparadorCotizaciones from '../components/ComparadorCotizaciones'
import FormularioNuevoServicio from '../components/FormularioNuevoServicio'
import { useAppState } from '../context/AppStateContext'
import { useAuth } from '../context/AuthContext'
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'

const SolicitanteDashboard = () => {
  const { services, quotes, selectQuote, selectedQuotes, addService } = useAppState()
  const { currentUser } = useAuth()
  const [activeServiceId, setActiveServiceId] = useState(services[0]?.id ?? '')
  const [showForm, setShowForm] = useState(false)
  const isLoadingQuotes = useSkeletonDelay([quotes.length])

  useEffect(() => {
    if (!activeServiceId && services.length) {
      setActiveServiceId(services[0].id)
    }
  }, [activeServiceId, services])

  const activeService = services.find((service) => service.id === activeServiceId) ?? services[0]

  const filteredQuotes = useMemo(
    () => quotes.filter((quote) => quote.serviceId === activeService?.id),
    [quotes, activeService?.id],
  )

  const myServices = useMemo(
    () => services.filter((s) => s.solicitanteId === currentUser?.id),
    [services, currentUser?.id],
  )

  const handleSubmitService = (serviceData: {
    title: string
    description: string
    categoria: any
    direccion: string
    ciudad: string
    fechaPreferida: string
    insumosRequeridos: any[]
  }) => {
    addService({
      ...serviceData,
      solicitanteId: currentUser?.id || '',
      estado: 'PUBLICADO',
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Solicitante</p>
          <h2 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">Mis Servicios</h2>
          <p className="text-xs text-slate-500">Gestiona tus servicios publicados y compara cotizaciones.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-400 whitespace-nowrap self-start sm:self-auto"
        >
          {showForm ? 'Cancelar' : '+ Publicar Servicio'}
        </button>
      </div>

      {showForm && (
        <FormularioNuevoServicio onSubmit={handleSubmitService} onCancel={() => setShowForm(false)} />
      )}

      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <h3 className="text-sm font-semibold text-slate-900">Servicios activos</h3>
          <p className="mt-0.5 text-xs text-slate-500">Selecciona un servicio para comparar cotizaciones.</p>
          <div className="mt-3 sm:mt-4">
            <DemandaList services={myServices} selectedId={activeService?.id} onSelect={setActiveServiceId} />
          </div>
          {myServices.length === 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
              No has publicado servicios aún. Usa el botón "Publicar Servicio" para comenzar.
            </div>
          )}
        </div>
        <div className="min-w-0">
          {activeService ? (
            <ComparadorCotizaciones
              quotes={filteredQuotes}
              selectedQuoteId={selectedQuotes[activeService?.id ?? '']}
              onSelectQuote={(quoteId) => activeService && selectQuote(activeService.id, quoteId)}
              serviceTitle={activeService?.title ?? 'Selecciona una demanda'}
              isLoading={isLoadingQuotes}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              Selecciona un servicio para ver las cotizaciones
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SolicitanteDashboard
