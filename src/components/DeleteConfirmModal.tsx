import type { Supply } from '../data/initialData'

interface DeleteConfirmModalProps {
  supply: Supply | null
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmModal = ({ supply, onConfirm, onCancel }: DeleteConfirmModalProps) => {
  if (!supply) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-rose-100 flex-shrink-0">
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">¿Eliminar insumo?</h3>
            <p className="mt-1 text-xs text-slate-600">
              Estás a punto de eliminar <span className="font-semibold text-slate-900">"{supply.name}"</span>. Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal

