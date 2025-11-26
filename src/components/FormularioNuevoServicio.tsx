import { useState } from 'react'
import type { ServiceCategory, RequiredSupply } from '../data/initialData'

interface FormularioNuevoServicioProps {
  onSubmit: (service: {
    title: string
    description: string
    categoria: ServiceCategory
    direccion: string
    ciudad: string
    fechaPreferida: string
    insumosRequeridos: RequiredSupply[]
  }) => void
  onCancel?: () => void
}

const FormularioNuevoServicio = ({ onSubmit, onCancel }: FormularioNuevoServicioProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoria, setCategoria] = useState<ServiceCategory>('otros')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [fechaPreferida, setFechaPreferida] = useState('')
  const [insumos, setInsumos] = useState<RequiredSupply[]>([])
  const [currentInsumo, setCurrentInsumo] = useState({ name: '', quantity: 1, unit: 'unidad' })

  const categorias: ServiceCategory[] = ['jardineria', 'piscinas', 'limpieza', 'otros']
  const unidades = ['unidad', 'kg', 'litros', 'metros', 'kits', 'botellas', 'unidades']

  const handleAddInsumo = () => {
    if (currentInsumo.name.trim()) {
      setInsumos([
        ...insumos,
        {
          id: 'ins-' + Date.now() + Math.random(),
          name: currentInsumo.name,
          quantity: currentInsumo.quantity,
          unit: currentInsumo.unit,
        },
      ])
      setCurrentInsumo({ name: '', quantity: 1, unit: 'unidad' })
    }
  }

  const handleRemoveInsumo = (id: string) => {
    setInsumos(insumos.filter((i) => i.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !direccion || !ciudad || !fechaPreferida) return

    onSubmit({
      title,
      description,
      categoria,
      direccion,
      ciudad,
      fechaPreferida: new Date(fechaPreferida).toISOString(),
      insumosRequeridos: insumos,
    })

    // Reset form
    setTitle('')
    setDescription('')
    setCategoria('otros')
    setDireccion('')
    setCiudad('')
    setFechaPreferida('')
    setInsumos([])
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <header className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Publicar Nuevo Servicio</h3>
        <p className="mt-0.5 text-xs text-slate-500">Completa los datos del servicio que necesitas</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700" htmlFor="title">
            Título del Servicio <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
            placeholder="Ej: Mantenimiento de jardín"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700" htmlFor="description">
            Descripción <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
            placeholder="Describe el servicio que necesitas..."
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="categoria">
              Categoría <span className="text-rose-500">*</span>
            </label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as ServiceCategory)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              required
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'jardineria' ? 'Jardinería' : cat === 'piscinas' ? 'Piscinas' : cat === 'limpieza' ? 'Limpieza' : 'Otros'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="fechaPreferida">
              Fecha Preferida <span className="text-rose-500">*</span>
            </label>
            <input
              id="fechaPreferida"
              type="date"
              value={fechaPreferida}
              onChange={(e) => setFechaPreferida(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="direccion">
              Dirección <span className="text-rose-500">*</span>
            </label>
            <input
              id="direccion"
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              placeholder="Ej: Av. 18 de Julio 1234"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="ciudad">
              Ciudad <span className="text-rose-500">*</span>
            </label>
            <input
              id="ciudad"
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              placeholder="Ej: Montevideo"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Insumos Requeridos</label>
          <div className="mt-1.5 space-y-2">
            {insumos.map((insumo) => (
              <div key={insumo.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                <span className="flex-1 text-xs font-semibold text-slate-900">
                  {insumo.name} - {insumo.quantity} {insumo.unit}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveInsumo(insumo.id)}
                  className="rounded-lg p-1 text-rose-500 hover:bg-rose-50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={currentInsumo.name}
                onChange={(e) => setCurrentInsumo({ ...currentInsumo, name: e.target.value })}
                placeholder="Nombre del insumo"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInsumo())}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={currentInsumo.quantity}
                  onChange={(e) => setCurrentInsumo({ ...currentInsumo, quantity: Number(e.target.value) || 1 })}
                  placeholder="Cant."
                  className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
                />
                <select
                  value={currentInsumo.unit}
                  onChange={(e) => setCurrentInsumo({ ...currentInsumo, unit: e.target.value })}
                  className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
                >
                  {unidades.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddInsumo}
                  className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-400 whitespace-nowrap"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="flex-1 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-dark-blue shadow-md shadow-brand-500/20 transition hover:bg-brand-400"
          >
            Publicar Servicio
          </button>
        </div>
      </form>
    </section>
  )
}

export default FormularioNuevoServicio

