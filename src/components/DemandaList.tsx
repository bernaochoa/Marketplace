import type { ServiceDemand } from '../data/initialData'
import SkeletonList from './SkeletonList'
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'

interface DemandaListProps {
  services: ServiceDemand[]
  selectedId?: string
  onSelect: (serviceId: string) => void
}

const statusColor: Record<string, string> = {
  PUBLICADO: 'bg-blue-100 text-blue-700',
  EN_EVALUACION: 'bg-amber-100 text-amber-800',
  ASIGNADO: 'bg-green-100 text-green-700',
  COMPLETADO: 'bg-slate-100 text-slate-700',
  // Legacy
  'En evaluación': 'bg-amber-100 text-amber-800',
  'En curso': 'bg-sky-100 text-sky-700',
  Adjudicado: 'bg-emerald-100 text-emerald-700',
}

const statusLabel: Record<string, string> = {
  PUBLICADO: 'Publicado',
  EN_EVALUACION: 'En Evaluación',
  ASIGNADO: 'Asignado',
  COMPLETADO: 'Completado',
}

const DemandaList = ({ services, selectedId, onSelect }: DemandaListProps) => {
  const isLoading = useSkeletonDelay([services.length])

  if (isLoading) {
    return <SkeletonList rows={3} hasMedia />
  }

  return (
    <div className="space-y-4">
      {services.map((service) => {
        const isActive = service.id === selectedId
        const borderStyles = isActive
          ? 'border-slate-900 shadow-card'
          : 'border-slate-200 hover:border-brand-400 hover:shadow-card/50'

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            className={`w-full rounded-2xl border bg-white p-5 text-left transition ${borderStyles}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Demanda #{service.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{service.title}</h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusColor[service.estado || service.status || 'PUBLICADO']
                }`}
              >
                {statusLabel[service.estado || ''] || service.status || 'Publicado'}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-500">
              <div>
                <p className="text-xs uppercase text-slate-400">Categoría</p>
                <p className="font-semibold text-slate-900 capitalize">{service.categoria || 'Otros'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Ciudad</p>
                <p className="font-semibold text-slate-900">{service.ciudad || service.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Fecha</p>
                <p className="font-semibold text-slate-900">
                  {service.fechaPreferida
                    ? new Date(service.fechaPreferida).toLocaleDateString('es-UY')
                    : service.deadline || 'N/A'}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default DemandaList
