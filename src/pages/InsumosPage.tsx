// Imports de React y hooks
import { useState } from 'react'
// Componentes de la aplicación
import FormularioNuevoInsumo from '../components/FormularioNuevoInsumo'
import SupplyCard from '../components/SupplyCard'
import SkeletonList from '../components/SkeletonList'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
// Context para acceder al estado global de la aplicación
import { useAppState } from '../context/AppStateContext'
// Hook personalizado para mostrar skeleton loading
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'
// Tipos TypeScript
import type { Supply } from '../data/initialData'

/**
 * Componente InsumosPage
 * 
 * Página para gestionar el catálogo de insumos.
 * Permite:
 * - Ver todos los insumos disponibles
 * - Filtrar por categoría
 * - Agregar nuevos insumos
 * - Editar insumos existentes
 * - Eliminar insumos
 */
const InsumosPage = () => {
  // Obtener datos y funciones del estado global mediante Context API
  // supplies: Array con todos los insumos del catálogo
  // addSupply: Función para agregar un nuevo insumo
  // updateSupply: Función para actualizar un insumo existente
  // removeSupply: Función para eliminar un insumo
  const { supplies, addSupply, updateSupply, removeSupply } = useAppState()

  // Estado local para el insumo que se está editando (null si no hay ninguno)
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null)
  
  // Estado local para el insumo que se está eliminando (null si no hay ninguno)
  // Se usa para mostrar el modal de confirmación
  const [deletingSupply, setDeletingSupply] = useState<Supply | null>(null)
  
  // Estado local para el filtro de categoría (string vacío = mostrar todas)
  const [filterCategory, setFilterCategory] = useState<string>('')
  
  // Hook personalizado que muestra skeleton loading durante 800ms
  // Se reinicia cuando cambia la cantidad de insumos (supplies.length)
  const isLoading = useSkeletonDelay([supplies.length])

  // Extraer todas las categorías únicas de los insumos y ordenarlas alfabéticamente
  // Array.from(new Set(...)) elimina duplicados
  // .sort() ordena alfabéticamente
  const categories = Array.from(new Set(supplies.map((s) => s.category))).sort()

  // Filtrar insumos según la categoría seleccionada
  // Si filterCategory está vacío, muestra todos los insumos
  // Si tiene valor, solo muestra los insumos de esa categoría
  const filteredSupplies = filterCategory
    ? supplies.filter((s) => s.category === filterCategory)
    : supplies

  /**
   * Maneja la acción de agregar o actualizar un insumo
   * 
   * @param supply - Datos del insumo (sin el id, que se genera automáticamente)
   * 
   * Si hay un insumo en edición (editingSupply), actualiza ese insumo
   * Si no hay insumo en edición, agrega uno nuevo
   */
  const handleAddSupply = (supply: Omit<Supply, 'id'>) => {
    if (editingSupply) {
      // Modo edición: actualizar el insumo existente
      updateSupply(editingSupply.id, supply)
      // Limpiar el estado de edición
      setEditingSupply(null)
    } else {
      // Modo creación: agregar un nuevo insumo
      addSupply(supply)
    }
  }

  /**
   * Maneja la confirmación de eliminación de un insumo
   * 
   * Se ejecuta cuando el usuario confirma la eliminación en el modal
   * Elimina el insumo del catálogo y limpia los estados relacionados
   */
  const handleDeleteConfirm = () => {
    if (deletingSupply) {
      // Eliminar el insumo del catálogo
      removeSupply(deletingSupply.id)
      // Cerrar el modal de confirmación
      setDeletingSupply(null)
      // Si el insumo eliminado estaba siendo editado, cancelar la edición
      if (editingSupply?.id === deletingSupply.id) {
        setEditingSupply(null)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Header de la página con título y descripción */}
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Catálogo de Insumos</h1>
        <p className="mt-1 text-sm text-slate-500">Gestiona tu catálogo de insumos disponibles</p>
      </header>

      {/* Selector de filtro por categoría */}
      <div className="flex gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:outline-none"
        >
          {/* Opción para mostrar todas las categorías */}
          <option value="">Todas las categorías</option>
          {/* Renderizar una opción por cada categoría única */}
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Grid principal: formulario a la izquierda, lista de insumos a la derecha */}
      <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
        {/* Columna izquierda: Formulario para agregar/editar insumos */}
        {/* lg:sticky hace que el formulario se quede fijo al hacer scroll */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <FormularioNuevoInsumo
            onAddSupply={handleAddSupply}
            editingSupply={editingSupply}
            onCancel={() => setEditingSupply(null)}
          />
        </div>

        {/* Columna derecha: Lista de insumos del catálogo */}
        <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-card">
          {/* Header de la sección con contador de insumos */}
          <header className="mb-3">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Insumos del Catálogo ({filteredSupplies.length})
            </h3>
          </header>

          {/* Renderizado condicional según el estado de carga y datos */}
          {isLoading ? (
            // Mostrar skeleton loading mientras se cargan los datos
            <SkeletonList rows={4} variant="supply" />
          ) : filteredSupplies.length === 0 ? (
            // Mostrar mensaje cuando no hay insumos
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              {filterCategory ? 'No hay insumos en esta categoría' : 'Aún no has agregado insumos'}
            </div>
          ) : (
            // Mostrar grid de tarjetas de insumos
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

      {/* Modal de confirmación para eliminar insumos */}
      {/* Solo se muestra si deletingSupply no es null */}
      <DeleteConfirmModal
        supply={deletingSupply}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingSupply(null)}
      />
    </div>
  )
}

export default InsumosPage

