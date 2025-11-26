import { useMemo, useState } from 'react'
import type { Quote } from '../data/initialData'
import { convertToUSD } from '../data/initialData'
import SkeletonList from './SkeletonList'

interface ComparadorCotizacionesProps {
  quotes: Quote[]
  selectedQuoteId?: string | null
  onSelectQuote: (quoteId: string) => void
  serviceTitle: string
  isLoading?: boolean
}

const formatCurrency = (value: number, currency: string = 'USD') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
  }
  return `${currency} ${value.toLocaleString('es-UY', { maximumFractionDigits: 2 })}`
}

const ComparadorCotizaciones = ({ quotes, selectedQuoteId, onSelectQuote, serviceTitle, isLoading = false }: ComparadorCotizacionesProps) => {
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null)

  const metrics = useMemo(() => {
    if (!quotes.length) {
      return { min: 0, max: 0, minUSD: 0, maxUSD: 0 }
    }
    // Convertir todos los precios a USD para comparación
    const totalsUSD = quotes.map((quote) => convertToUSD(quote.totalPrice, quote.currency || 'USD'))
    return {
      min: Math.min(...totalsUSD),
      max: Math.max(...totalsUSD),
      minUSD: Math.min(...totalsUSD),
      maxUSD: Math.max(...totalsUSD),
    }
  }, [quotes])

  if (isLoading) {
    return <SkeletonList rows={3} variant="comparator" />
  }

  if (!quotes.length) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 sm:p-8 text-center text-sm text-slate-500">
        Aún no hay cotizaciones disponibles para esta demanda.
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-card">
      <header className="mb-3 sm:mb-4 flex flex-col gap-1">
        <p className="text-xs uppercase text-slate-400">Comparación de cotizaciones</p>
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">{serviceTitle}</h2>
        <p className="text-xs text-slate-500">
          Rango de propuestas entre <strong>{formatCurrency(metrics.minUSD, 'USD')}</strong> y{' '}
          <strong>{formatCurrency(metrics.maxUSD, 'USD')}</strong> (convertido a USD)
        </p>
      </header>
      
      {/* Vista Desktop: Tabla */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-[20%]">Proveedor</th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-[18%]">Precio total</th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-[12%]">Plazo</th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-[10%]">Rating</th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-[18%]">Detalle</th>
                <th className="px-2 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 w-[22%]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {quotes.map((quote) => {
                const isSelected = quote.id === selectedQuoteId
                const isExpanded = expandedQuote === quote.id
                const actionClasses = isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'border border-slate-200 text-slate-700 hover:border-brand-400'

                return (
                  <tr key={quote.id} className="hover:bg-slate-50">
                    <td className="px-2 py-2.5">
                      <div className="font-semibold text-slate-900 text-xs">{quote.providerName}</div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{quote.message || '-'}</p>
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="text-xs font-semibold text-slate-900">
                        {formatCurrency(quote.totalPrice, quote.currency || 'USD')}
                      </div>
                      {quote.currency && quote.currency !== 'USD' && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          ≈ USD {convertToUSD(quote.totalPrice, quote.currency).toLocaleString('es-UY', { maximumFractionDigits: 0 })}
                        </p>
                      )}
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {quote.leadTimeDays} días
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-xs font-semibold text-amber-500">{quote.rating.toFixed(1)}</td>
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        onClick={() => setExpandedQuote(isExpanded ? null : quote.id)}
                        className="text-xs font-semibold text-brand-600 underline-offset-4 hover:underline"
                      >
                        {isExpanded ? 'Ocultar' : 'Ver insumos'}
                      </button>
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectQuote(quote.id)}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition whitespace-nowrap ${actionClasses}`}
                      >
                        {isSelected ? 'Seleccionada' : 'Seleccionar'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Mobile: Cards Verticales */}
      <div className="md:hidden space-y-3">
        {quotes.map((quote) => {
          const isSelected = quote.id === selectedQuoteId
          const isExpanded = expandedQuote === quote.id
          const actionClasses = isSelected
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
            : 'border border-slate-200 text-slate-700 hover:border-brand-400'

          return (
            <div key={quote.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              {/* Proveedor */}
              <div className="mb-2">
                <div className="text-sm font-semibold text-slate-900">{quote.providerName}</div>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{quote.message || '-'}</p>
              </div>

              {/* Métricas agrupadas */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-[9px] uppercase text-slate-400 mb-0.5">Precio Total</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(quote.totalPrice, quote.currency || 'USD')}
                  </p>
                  {quote.currency && quote.currency !== 'USD' && (
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      ≈ USD {convertToUSD(quote.totalPrice, quote.currency).toLocaleString('es-UY', { maximumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-[9px] uppercase text-slate-400 mb-0.5">Plazo</p>
                  <p className="text-sm font-semibold text-slate-900">{quote.leadTimeDays} días</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-[9px] uppercase text-slate-400 mb-0.5">Rating</p>
                  <p className="text-sm font-semibold text-amber-500">{quote.rating.toFixed(1)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-[9px] uppercase text-slate-400 mb-0.5">Estado</p>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {isSelected ? 'Seleccionada' : 'Disponible'}
                  </p>
                </div>
              </div>

              {/* Botón Ver Insumos */}
              <button
                type="button"
                onClick={() => setExpandedQuote(isExpanded ? null : quote.id)}
                className="mb-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-slate-50"
              >
                {isExpanded ? 'Ocultar insumos' : 'Ver insumos'}
              </button>

              {/* Botón Seleccionar - Ancho completo */}
              <button
                type="button"
                onClick={() => onSelectQuote(quote.id)}
                className={`w-full rounded-full px-3 py-2 text-xs font-semibold transition ${actionClasses}`}
              >
                {isSelected ? '✓ Seleccionada' : 'Seleccionar cotización'}
              </button>
            </div>
          )
        })}
      </div>
      {expandedQuote && (
        <div className="mt-3 sm:mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          {quotes
            .filter((quote) => quote.id === expandedQuote)
            .map((quote) => (
              <div key={quote.id}>
                <p className="text-xs font-semibold text-slate-700 mb-2">Insumos</p>
                <ul className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                  {quote.suppliesBreakdown.map((line) => {
                    const lineTotal = line.quantity * line.price
                    const lineCurrency = line.currency || quote.currency || 'USD'
                    return (
                      <li key={line.id} className="rounded-lg bg-white px-2 py-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="font-semibold text-slate-900 truncate text-xs">{line.name}</p>
                            <p className="text-[10px] text-slate-500">
                              {line.quantity} {line.unit}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-semibold text-slate-800">
                              {lineCurrency} {lineTotal.toLocaleString('es-UY', { maximumFractionDigits: 2 })}
                            </span>
                            {lineCurrency !== 'USD' && (
                              <p className="text-[10px] text-slate-500">
                                ≈ USD {convertToUSD(lineTotal, lineCurrency).toLocaleString('es-UY', { maximumFractionDigits: 2 })}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
        </div>
      )}
    </section>
  )
}

export default ComparadorCotizaciones
