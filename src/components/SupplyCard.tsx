import type { Supply } from '../data/initialData'

interface SupplyCardProps {
  supply: Supply
  onEdit: (supply: Supply) => void
  onDelete: () => void
  isEditing?: boolean
}

const SupplyCard = ({ supply, onEdit, onDelete, isEditing = false }: SupplyCardProps) => {
  return (
    <div
      className={`rounded-xl border bg-white p-3 shadow-sm transition ${
        isEditing ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20' : 'border-slate-200'
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">{supply.name}</h3>
          <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            {supply.category}
          </span>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(supply)}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
            aria-label="Editar insumo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-slate-200 p-1.5 text-rose-600 hover:bg-rose-50"
            aria-label="Eliminar insumo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {supply.description && <p className="mb-2.5 text-xs text-slate-600">{supply.description}</p>}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-[10px] font-semibold uppercase text-slate-500">Precio</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">
            {supply.currency} {supply.price.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-[10px] font-semibold uppercase text-slate-500">Unidad</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">{supply.unit}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-[10px] font-semibold uppercase text-slate-500">Stock</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">{supply.stock}</p>
        </div>
      </div>
    </div>
  )
}

export default SupplyCard

