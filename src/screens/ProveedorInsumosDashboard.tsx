import { useState } from 'react'
import FormularioNuevoInsumo from '../components/FormularioNuevoInsumo'
import FormularioPackInsumos from '../components/FormularioPackInsumos'
import SupplyCard from '../components/SupplyCard'
import SkeletonList from '../components/SkeletonList'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { useAppState } from '../context/AppStateContext'
import { useAuth } from '../context/AuthContext'
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'
import type { Supply } from '../data/initialData'

const ProveedorInsumosDashboard = () => {
  const { supplies, packs, addPack, addSupply, updateSupply, removeSupply } = useAppState()
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'catalogo' | 'packs'>('catalogo')
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null)
  const [deletingSupply, setDeletingSupply] = useState<Supply | null>(null)
  const isLoadingPacks = useSkeletonDelay([packs.length, activeTab])
  const isLoadingSupplies = useSkeletonDelay([supplies.length, activeTab])
  const isLoadingForm = useSkeletonDelay([activeTab])

  const handleCreatePack = (payload: { name: string; supplyIds: string[]; totalPrice: number; basePrice: number }) => {
    addPack({ ...payload, createdBy: currentUser?.name ?? 'Proveedor' })
  }

  const handleAddSupply = (supply: Omit<Supply, 'id'>) => {
    if (editingSupply) {
      updateSupply(editingSupply.id, supply)
      setEditingSupply(null)
    } else {
      addSupply(supply)
    }
  }

  const handleEditSupply = (supply: Supply) => {
    setEditingSupply(supply)
    // Cambiar al tab de catálogo si estamos en otro tab
    if (activeTab !== 'catalogo') {
      setActiveTab('catalogo')
    }
  }

  const handleDeleteClick = (supply: Supply) => {
    setDeletingSupply(supply)
  }

  const handleDeleteConfirm = () => {
    if (deletingSupply) {
      removeSupply(deletingSupply.id)
      setDeletingSupply(null)
      // Si estaba editando el insumo que se elimina, cancelar edición
      if (editingSupply?.id === deletingSupply.id) {
        setEditingSupply(null)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeletingSupply(null)
  }

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Proveedor de insumos</p>
        <h2 className="mt-0.5 text-lg font-semibold text-slate-900">
          {activeTab === 'catalogo' ? 'Tu Catálogo' : 'Crear Packs'} ({activeTab === 'catalogo' ? supplies.length : packs.length}{' '}
          {activeTab === 'catalogo' ? 'insumos' : 'packs'})
        </h2>
        <p className="text-xs text-slate-500">
          {activeTab === 'catalogo'
            ? 'Gestiona los insumos disponibles en tu catálogo'
            : 'Agrupa insumos frecuentes e incorpora un descuento automático'}
        </p>
      </header>

      <div className="flex gap-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab('catalogo')
            setEditingSupply(null)
          }}
          className={`px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === 'catalogo'
              ? 'border-b-2 border-brand-500 text-dark-blue'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Catálogo de Insumos
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('packs')
            setEditingSupply(null)
          }}
          className={`px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === 'packs'
              ? 'border-b-2 border-brand-500 text-dark-blue'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Crear Packs
        </button>
      </div>

      {activeTab === 'catalogo' ? (
        <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
          <div className="lg:sticky lg:top-4 lg:h-fit">
            {isLoadingForm ? (
              <SkeletonList variant="form" />
            ) : (
              <FormularioNuevoInsumo
                onAddSupply={handleAddSupply}
                editingSupply={editingSupply}
                onCancel={() => setEditingSupply(null)}
              />
            )}
          </div>
          <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-card">
            {isLoadingSupplies ? (
              <>
                <header className="mb-3">
                  <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
                </header>
                <SkeletonList rows={4} variant="supply" />
              </>
            ) : (
              <>
                <header className="mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">Insumos del Catálogo</h3>
                </header>
                {supplies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 sm:p-6 text-center text-xs sm:text-sm text-slate-500">
                Aún no has agregado insumos. Utiliza el formulario superior para empezar.
              </div>
            ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {supplies.map((supply) => (
                      <SupplyCard
                        key={supply.id}
                        supply={supply}
                        onEdit={handleEditSupply}
                        onDelete={() => handleDeleteClick(supply)}
                        isEditing={editingSupply?.id === supply.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          {isLoadingForm ? (
            <SkeletonList variant="form-pack" />
          ) : (
            <FormularioPackInsumos supplies={supplies} onCreatePack={handleCreatePack} />
          )}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-slate-400">Packs guardados</p>
                <h3 className="text-base font-semibold text-slate-900">Historial reciente</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {packs.length} activos
              </span>
            </header>
            {isLoadingPacks ? (
              <SkeletonList rows={2} variant="pack" />
            ) : packs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                Aún no has creado packs. Utiliza el formulario superior para empezar.
              </div>
            ) : (
              <div className="space-y-3">
                {packs.map((pack) => (
                  <article
                    key={pack.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase text-slate-400">{pack.id}</p>
                        <h4 className="text-lg font-semibold text-slate-900">{pack.name}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase text-slate-400">Precio pack</p>
                        <p className="text-xl font-semibold text-slate-900">USD {pack.totalPrice}</p>
                        <p className="text-xs text-emerald-600">
                          Ahorro {Math.max(0, Math.round(((pack.basePrice - pack.totalPrice) / pack.basePrice) * 100))}%
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {pack.supplyIds.length} insumos · Creado por {pack.createdBy}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
      <DeleteConfirmModal
        supply={deletingSupply}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}

export default ProveedorInsumosDashboard
