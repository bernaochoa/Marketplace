import { useState, useMemo } from 'react'
import type { ServiceDemand, QuoteLine } from '../data/initialData'
import { CURRENCY_RATES, convertToUSD } from '../data/initialData'

interface FormularioCotizacionProps {
  service: ServiceDemand
  onSubmit: (quote: {
    serviceId: string
    providerId: string
    providerName: string
    totalPrice: number
    currency: string
    leadTimeDays: number
    message: string
    suppliesBreakdown: QuoteLine[]
  }) => void
  onCancel?: () => void
  editingQuote?: { id: string; totalPrice: number; currency: string; leadTimeDays: number; message: string; suppliesBreakdown: QuoteLine[] }
}

const FormularioCotizacion = ({ service, onSubmit, onCancel, editingQuote }: FormularioCotizacionProps) => {
  const [totalPrice, setTotalPrice] = useState(editingQuote?.totalPrice || 0)
  const [currency, setCurrency] = useState(editingQuote?.currency || 'USD')
  const [leadTimeDays, setLeadTimeDays] = useState(editingQuote?.leadTimeDays || 1)
  const [message, setMessage] = useState(editingQuote?.message || '')
  const [breakdown, setBreakdown] = useState<QuoteLine[]>(editingQuote?.suppliesBreakdown || [])
  const [currentLine, setCurrentLine] = useState({ name: '', quantity: 1, unit: 'unidad', price: 0, currency: 'USD' })

  const unidades = ['unidad', 'kg', 'litros', 'metros', 'kits', 'botellas', 'unidades', 'horas', 'visitas']
  const currencies = Object.keys(CURRENCY_RATES)

  const totalBreakdown = useMemo(() => {
    return breakdown.reduce((sum, line) => {
      const priceInUSD = convertToUSD(line.price, line.currency || currency)
      return sum + priceInUSD * line.quantity
    }, 0)
  }, [breakdown, currency])

  const totalBreakdownInSelectedCurrency = useMemo(() => {
    if (currency === 'USD') return totalBreakdown
    const rate = CURRENCY_RATES[currency] || 1
    return totalBreakdown * rate
  }, [totalBreakdown, currency])

  const handleAddLine = () => {
    if (currentLine.name.trim() && currentLine.price > 0) {
      setBreakdown([
        ...breakdown,
        {
          id: 'line-' + Date.now() + Math.random(),
          name: currentLine.name,
          quantity: currentLine.quantity,
          unit: currentLine.unit,
          price: currentLine.price,
          currency: currentLine.currency,
        },
      ])
      setCurrentLine({ name: '', quantity: 1, unit: 'unidad', price: 0, currency: currency })
    }
  }

  const handleRemoveLine = (id: string) => {
    setBreakdown(breakdown.filter((l) => l.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (totalPrice <= 0 || leadTimeDays <= 0) return

    onSubmit({
      serviceId: service.id,
      providerId: '', // Se llenará en el componente padre
      providerName: '', // Se llenará en el componente padre
      totalPrice,
      currency,
      leadTimeDays,
      message,
      suppliesBreakdown: breakdown,
    })
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <header className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          {editingQuote ? 'Editar Cotización' : 'Enviar Cotización'}
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">Servicio: {service.title}</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <label className="text-xs font-semibold text-slate-700" htmlFor="totalPrice">
              Precio Total ({currency}) <span className="text-rose-500">*</span>
            </label>
            <input
              id="totalPrice"
              type="number"
              min="0.01"
              step="0.01"
              value={totalPrice || ''}
              onChange={(e) => setTotalPrice(Number(e.target.value) || 0)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              required
            />
            {currency !== 'USD' && (
              <p className="mt-1 text-[10px] text-slate-500">
                ≈ USD {convertToUSD(totalPrice, currency).toFixed(2)}
              </p>
            )}
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-slate-700" htmlFor="leadTimeDays">
              Plazo (días) <span className="text-rose-500">*</span>
            </label>
            <input
              id="leadTimeDays"
              type="number"
              min="1"
              value={leadTimeDays}
              onChange={(e) => setLeadTimeDays(Number(e.target.value) || 1)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700" htmlFor="message">
            Mensaje / Notas
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
            placeholder="Incluye detalles adicionales, garantías, etc."
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Desglose de Ítems (opcional)</label>
          <div className="mt-1.5 space-y-2">
            {breakdown.map((line) => {
              const lineTotal = line.quantity * line.price
              const lineTotalUSD = convertToUSD(lineTotal, line.currency || currency)
              return (
                <div key={line.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <span className="flex-1 text-xs font-semibold text-slate-900">
                    {line.name} - {line.quantity} {line.unit} × {line.currency || currency} {line.price.toFixed(2)} ={' '}
                    {line.currency || currency} {lineTotal.toFixed(2)}
                    {line.currency !== currency && line.currency && (
                      <span className="ml-1 text-slate-500">(≈ USD {lineTotalUSD.toFixed(2)})</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(line.id)}
                    className="rounded-lg p-1 text-rose-500 hover:bg-rose-50"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )
            })}
            {breakdown.length > 0 && (
              <div className="rounded-lg border border-brand-200 bg-brand-50 p-2 text-xs font-semibold text-brand-700">
                Subtotal desglose: {currency} {totalBreakdownInSelectedCurrency.toFixed(2)} (≈ USD{' '}
                {totalBreakdown.toFixed(2)})
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={currentLine.name}
                onChange={(e) => setCurrentLine({ ...currentLine, name: e.target.value })}
                placeholder="Nombre del ítem"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
              />
              <div className="flex gap-2 flex-wrap">
                <input
                  type="number"
                  min="1"
                  value={currentLine.quantity}
                  onChange={(e) => setCurrentLine({ ...currentLine, quantity: Number(e.target.value) || 1 })}
                  placeholder="Cant."
                  className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
                />
                <select
                  value={currentLine.unit}
                  onChange={(e) => setCurrentLine({ ...currentLine, unit: e.target.value })}
                  className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
                >
                  {unidades.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <select
                  value={currentLine.currency}
                  onChange={(e) => setCurrentLine({ ...currentLine, currency: e.target.value })}
                  className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={currentLine.price || ''}
                  onChange={(e) => setCurrentLine({ ...currentLine, price: Number(e.target.value) || 0 })}
                  placeholder="Precio"
                  className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLine}
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
            {editingQuote ? 'Actualizar' : 'Enviar'} Cotización
          </button>
        </div>
      </form>
    </section>
  )
}

export default FormularioCotizacion
