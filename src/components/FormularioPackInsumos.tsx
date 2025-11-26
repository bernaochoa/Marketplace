import { useMemo, useState } from 'react'
import type { Supply } from '../data/initialData'

interface FormularioPackInsumosProps {
  supplies: Supply[]
  onCreatePack: (payload: { name: string; supplyIds: string[]; totalPrice: number; basePrice: number }) => void
}

// Tasas de cambio promedio a USD
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  UYU: 40, // 40 UYU = 1 USD
  EUR: 0.92, // 0.92 EUR = 1 USD
  ARS: 900, // 900 ARS = 1 USD
  BRL: 5, // 5 BRL = 1 USD
}

// Convierte un precio de cualquier moneda a USD
const convertToUSD = (price: number, currency: string): number => {
  const rate = EXCHANGE_RATES[currency] || 1
  if (currency === 'USD') return price
  // Si la moneda no es USD, dividimos por la tasa (ej: 40 UYU / 40 = 1 USD)
  return price / rate
}

const FormularioPackInsumos = ({ supplies, onCreatePack }: FormularioPackInsumosProps) => {
  const [packName, setPackName] = useState('Pack preventivo regional')
  const [selectedSupplies, setSelectedSupplies] = useState<string[]>([])
  const [discount, setDiscount] = useState(10)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const selectedSuppliesData = useMemo(
    () => supplies.filter((supply) => selectedSupplies.includes(supply.id)),
    [selectedSupplies, supplies],
  )

  const currencies = useMemo(() => {
    const uniqueCurrencies = new Set(selectedSuppliesData.map((s) => s.currency))
    return Array.from(uniqueCurrencies)
  }, [selectedSuppliesData])

  // Calcula el precio base convirtiendo todas las monedas a USD
  const basePrice = useMemo(() => {
    const total = selectedSuppliesData.reduce((acc, item) => {
      const priceInUSD = convertToUSD(item.price, item.currency)
      const quantity = quantities[item.id] || 1
      return acc + priceInUSD * quantity
    }, 0)
    // Redondear a 2 decimales
    return Math.round(total * 100) / 100
  }, [selectedSuppliesData, quantities])

  const customPrice = useMemo(() => {
    if (basePrice > 0) {
      const priceWithDiscount = basePrice * (1 - discount / 100)
      // Redondear a 2 decimales
      return Math.round(priceWithDiscount * 100) / 100
    }
    return 0
  }, [basePrice, discount])

  const hasMultipleCurrencies = currencies.length > 1

  const toggleSupply = (supplyId: string) => {
    setSelectedSupplies((prev) =>
      prev.includes(supplyId) ? prev.filter((id) => id !== supplyId) : [...prev, supplyId],
    )
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedSupplies.length) return
    onCreatePack({ name: packName, supplyIds: selectedSupplies, totalPrice: customPrice, basePrice })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <header className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">Crear Nuevo Pack</h3>
          <p className="mt-0.5 text-xs text-slate-500">Agrupa insumos para servicios específicos</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="packName">
              Nombre del Pack <span className="text-rose-500">*</span>
            </label>
            <input
              id="packName"
              value={packName}
              onChange={(event) => setPackName(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              placeholder="Ej: Pack Construcción Básico"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="serviceType">
              Tipo de Servicio <span className="text-rose-500">*</span>
            </label>
            <select
              id="serviceType"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
            >
              <option value="">Selecciona tipo</option>
              <option value="construccion">Construcción</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="electricidad">Electricidad</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="packDescription">
              Descripción
            </label>
            <textarea
              id="packDescription"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              placeholder="Describe el pack..."
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="discount">
              Descuento (%)
            </label>
            <input
              id="discount"
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => {
                const newDiscount = Math.max(0, Math.min(100, Number(e.target.value)))
                setDiscount(newDiscount)
              }}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="grid gap-2">
            {hasMultipleCurrencies && (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-2">
                <p className="text-[10px] font-semibold text-blue-700">
                  💱 Conversión automática: Los precios se han convertido a USD
                </p>
                <p className="text-[9px] text-blue-600 mt-1">
                  Tasas: {currencies.filter(c => c !== 'USD').map(c => `1 USD = ${EXCHANGE_RATES[c]} ${c}`).join(', ')}
                </p>
              </div>
            )}
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-semibold uppercase text-slate-500">Precio sin descuento:</p>
              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                USD {basePrice.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl bg-brand-50 p-3">
              <p className="text-[10px] font-semibold uppercase text-brand-600">Precio con descuento:</p>
              <p className="mt-0.5 text-lg font-semibold text-brand-600">
                USD {customPrice.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={!selectedSupplies.length}
            className="w-full rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-dark-blue shadow-md shadow-brand-500/20 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Crear Pack
          </button>
        </form>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <header className="mb-3">
          <h3 className="text-base font-semibold text-slate-900">Catálogo de Insumos</h3>
          <p className="mt-0.5 text-xs text-slate-500">Selecciona insumos para agregar al pack</p>
        </header>
        <div className="max-h-[400px] sm:max-h-[500px] space-y-2 overflow-y-auto">
          {supplies.map((supply) => {
              const isSelected = selectedSupplies.includes(supply.id)
              const quantity = quantities[supply.id] || 1

              return (
                <div
                  key={supply.id}
                  className={`rounded-xl border p-3 transition ${
                    isSelected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900">{supply.name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-600">
                        {supply.currency} {supply.price.toFixed(2)} / {supply.unit}
                        {hasMultipleCurrencies && supply.currency !== 'USD' && (
                          <span className="ml-1.5 text-[9px] text-slate-400">
                            (≈ USD {convertToUSD(supply.price, supply.currency).toFixed(2)})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-semibold text-slate-600">Cantidad</span>
                        <button
                          type="button"
                          onClick={() => setQuantities((prev) => ({ ...prev, [supply.id]: Math.max(1, (prev[supply.id] || 1) - 1) }))}
                          className="rounded-lg border border-slate-200 p-0.5 text-slate-600 hover:bg-slate-50"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantities((prev) => ({ ...prev, [supply.id]: Math.max(1, Number(e.target.value)) }))}
                          className="w-12 rounded-lg border border-slate-200 px-1.5 py-0.5 text-center text-xs font-semibold text-slate-900 focus:border-brand-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantities((prev) => ({ ...prev, [supply.id]: (prev[supply.id] || 1) + 1 }))}
                          className="rounded-lg border border-slate-200 p-0.5 text-slate-600 hover:bg-slate-50"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSupply(supply.id)}
                        className={`rounded-full p-1.5 transition ${
                          isSelected
                            ? 'bg-brand-500 text-dark-blue'
                            : 'border border-slate-200 text-slate-600 hover:border-brand-400'
                        }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </section>
    </div>
  )
}

export default FormularioPackInsumos
