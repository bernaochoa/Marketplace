import { useEffect, useRef, useState } from 'react'
import type { Supply } from '../data/initialData'

interface FormularioNuevoInsumoProps {
  onAddSupply: (supply: Omit<Supply, 'id'>) => void
  editingSupply?: Supply | null
  onCancel?: () => void
}

const FormularioNuevoInsumo = ({ onAddSupply, editingSupply, onCancel }: FormularioNuevoInsumoProps) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [unit, setUnit] = useState('unidad')
  const [stock, setStock] = useState(100)
  const [price, setPrice] = useState<number | ''>('')
  const [currency, setCurrency] = useState('USD')
  const [description, setDescription] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (editingSupply) {
      setName(editingSupply.name || '')
      setCategory(editingSupply.category || '')
      setUnit(editingSupply.unit || 'unidad')
      setStock(editingSupply.stock || 100)
      setPrice(editingSupply.price || '')
      setCurrency(editingSupply.currency || 'USD')
      setDescription(editingSupply.description || '')
      // Scroll al formulario cuando se edita
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else {
      // Resetear formulario cuando no hay edición
      setName('')
      setCategory('')
      setUnit('unidad')
      setStock(100)
      setPrice('')
      setCurrency('USD')
      setDescription('')
    }
  }, [editingSupply])

  const categories = ['Construcción', 'Pintura', 'Electricidad', 'Mantenimiento', 'Climatización', 'Residuos', 'Limpieza', 'Infraestructura', 'Seguridad']
  const units = ['unidad', 'kg', 'litros', 'metros', 'kit', 'botella', 'bidón', 'par']
  const currencies = ['USD', 'UYU', 'EUR', 'ARS', 'BRL']

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name || !category || !unit || price === '' || price <= 0) return

    onAddSupply({
      name,
      category,
      unit,
      stock,
      price: typeof price === 'number' ? price : Number(price),
      currency,
      description: description || undefined,
    })

    setName('')
    setCategory('')
    setUnit('unidad')
    setStock(100)
    setPrice('')
    setCurrency('USD')
    setDescription('')
    if (onCancel) onCancel()
  }

  return (
    <section
      className={`rounded-2xl border bg-white p-4 shadow-card transition ${
        editingSupply ? 'border-brand-500 bg-brand-50/30' : 'border-slate-200'
      }`}
      ref={formRef}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Catálogo de Insumos</p>
          <h3 className="mt-0.5 text-base font-semibold text-slate-900">
            {editingSupply ? (
              <span className="flex items-center gap-2">
                <span>Editar Insumo</span>
                <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold text-white">Modo edición</span>
              </span>
            ) : (
              'Agregar Nuevo Insumo'
            )}
          </h3>
        </div>
        {editingSupply && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50"
            aria-label="Cancelar edición"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700" htmlFor="name">
            Nombre del Insumo <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
            placeholder="Ej: Cemento Portland"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700" htmlFor="category">
            Categoría <span className="text-rose-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
            required
          >
            <option value="">Selecciona categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700" htmlFor="description">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
            placeholder="Describe el insumo..."
            rows={3}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="price">
              Precio por Unidad <span className="text-rose-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => {
                const value = e.target.value
                setPrice(value === '' ? '' : Math.max(0, Number(value)))
              }}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="currency">
              Moneda <span className="text-rose-500">*</span>
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              required
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="unit">
              Unidad <span className="text-rose-500">*</span>
            </label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              required
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="stock">
              Stock Disponible <span className="text-rose-500">*</span>
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          {editingSupply && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-dark-blue shadow-md shadow-brand-500/20 transition hover:bg-brand-400"
          >
            {editingSupply ? '✓ Actualizar' : '+ Agregar'} Insumo
          </button>
        </div>
      </form>
    </section>
  )
}

export default FormularioNuevoInsumo

