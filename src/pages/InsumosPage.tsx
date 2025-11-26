import { useState } from 'react'
import FormularioNuevoInsumo from '../components/FormularioNuevoInsumo'
import SupplyCard from '../components/SupplyCard'
import SkeletonList from '../components/SkeletonList'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { useAppState } from '../context/AppStateContext'
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'
import type { Supply } from '../data/initialData'

const InsumosPage = () => {
  const { supplies, addSupply, updateSupply, removeSupply } = useAppState()
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null)
  const [deletingSupply, setDeletingSupply] = useState<Supply | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('')
  const isLoading = useSkeletonDelay([supplies.length])

  const categories = Array.from(new Set(supplies.map((s) => s.category))).sort()

  const filteredSupplies = filterCategory
    ? supplies.filter((s) => s.category === filterCategory)
    : supplies

  const handleAddSupply = (supply: Omit<Supply, 'id'>) => {
    if (editingSupply) {
      updateSupply(editingSupply.id, supply)
      setEditingSupply(null)
    } else {
      addSupply(supply)
    }
  }

  const handleDeleteConfirm = () => {
    if (deletingSupply) {
      removeSupply(deletingSupply.id)
      setDeletingSupply(null)
      if (editingSupply?.id === deletingSupply.id) {
        setEditingSupply(null)
      }
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Catálogo de Insumos</h1>
        <p className="mt-1 text-sm text-slate-500">Gestiona tu catálogo de insumos disponibles</p>
      </header>

      <div className="flex gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:outline-none"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <FormularioNuevoInsumo
            onAddSupply={handleAddSupply}
            editingSupply={editingSupply}
            onCancel={() => setEditingSupply(null)}
          />
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-card">
          <header className="mb-3">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Insumos del Catálogo ({filteredSupplies.length})
            </h3>
          </header>
          {isLoading ? (
            <SkeletonList rows={4} variant="supply" />
          ) : filteredSupplies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              {filterCategory ? 'No hay insumos en esta categoría' : 'Aún no has agregado insumos'}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredSupplies.map((supply) => (
                <SupplyCard
                  key={supply.id}
                  supply={supply}
                  onEdit={setEditingSupply}
                  onDelete={() => setDeletingSupply(supply)}
                  isEditing={editingSupply?.id === supply.id}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <DeleteConfirmModal
        supply={deletingSupply}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingSupply(null)}
      />
    </div>
  )
}

export default InsumosPage

