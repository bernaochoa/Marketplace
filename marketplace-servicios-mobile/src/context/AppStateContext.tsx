import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  INITIAL_QUOTES,
  INITIAL_SERVICES,
  INITIAL_SUPPLIES,
  type Quote,
  type ServiceDemand,
  type Supply,
  type SupplyPack,
} from '../data/initialData'

interface AppStateValue {
  services: ServiceDemand[]
  quotes: Quote[]
  supplies: Supply[]
  packs: SupplyPack[]
  selectedQuotes: Record<string, string | null>
  selectQuote: (serviceId: string, quoteId: string) => void
  addService: (service: Omit<ServiceDemand, 'id' | 'createdAt'>) => void
  updateService: (id: string, service: Partial<ServiceDemand>) => void
  addQuote: (quote: Omit<Quote, 'id'>) => void
  updateQuote: (id: string, quote: Partial<Quote>) => void
  removeQuote: (id: string) => void
  addPack: (payload: { name: string; supplyIds: string[]; totalPrice: number; basePrice: number; createdBy: string }) => void
  addSupply: (supply: Omit<Supply, 'id'>) => void
  updateSupply: (id: string, supply: Partial<Supply>) => void
  removeSupply: (id: string) => void
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined)

const STORAGE_KEYS = {
  SUPPLIES: 'servicios-market-supplies',
  PACKS: 'servicios-market-packs',
  SELECTED_QUOTES: 'servicios-market-selected-quotes',
  SERVICES: 'servicios-market-services',
  QUOTES: 'servicios-market-quotes',
}

const loadSupplies = async (): Promise<Supply[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SUPPLIES)
    if (stored) {
      const parsed = JSON.parse(stored) as Supply[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar supplies desde AsyncStorage:', error)
  }
  return INITIAL_SUPPLIES
}

const loadPacks = async (): Promise<SupplyPack[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.PACKS)
    if (stored) {
      const parsed = JSON.parse(stored) as SupplyPack[]
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar packs desde AsyncStorage:', error)
  }
  return []
}

const loadServices = async (): Promise<ServiceDemand[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SERVICES)
    if (stored) {
      const parsed = JSON.parse(stored) as ServiceDemand[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar services desde AsyncStorage:', error)
  }
  return INITIAL_SERVICES
}

const loadQuotes = async (): Promise<Quote[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.QUOTES)
    if (stored) {
      const parsed = JSON.parse(stored) as Quote[]
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar quotes desde AsyncStorage:', error)
  }
  return INITIAL_QUOTES
}

const buildInitialSelection = (services: ServiceDemand[], quotes: Quote[]) => {
  return services.reduce<Record<string, string | null>>((acc, service) => {
    const serviceQuotes = quotes.filter((quote) => quote.serviceId === service.id)
    const bestQuote = serviceQuotes.sort((a, b) => a.totalPrice - b.totalPrice)[0]
    acc[service.id] = bestQuote ? bestQuote.id : null
    return acc
  }, {})
}

const loadSelectedQuotes = async (): Promise<Record<string, string | null>> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_QUOTES)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, string | null>
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar selectedQuotes desde AsyncStorage:', error)
  }
  const services = await loadServices()
  const quotes = await loadQuotes()
  return buildInitialSelection(services, quotes)
}

const makeId = () => {
  if (typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 10)
}

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<ServiceDemand[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [packs, setPacks] = useState<SupplyPack[]>([])
  const [selectedQuotes, setSelectedQuotes] = useState<Record<string, string | null>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Cargar datos al montar
  useEffect(() => {
    const loadData = async () => {
      const [loadedServices, loadedQuotes, loadedSupplies, loadedPacks, loadedSelectedQuotes] = await Promise.all([
        loadServices(),
        loadQuotes(),
        loadSupplies(),
        loadPacks(),
        loadSelectedQuotes(),
      ])
      setServices(loadedServices)
      setQuotes(loadedQuotes)
      setSupplies(loadedSupplies)
      setPacks(loadedPacks)
      setSelectedQuotes(loadedSelectedQuotes)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const selectQuote = (serviceId: string, quoteId: string) => {
    setSelectedQuotes((prev) => ({ ...prev, [serviceId]: quoteId }))
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? { ...s, estado: 'ASIGNADO' as const, cotizacionSeleccionadaId: quoteId }
          : s
      )
    )
  }

  const addService = (service: Omit<ServiceDemand, 'id' | 'createdAt'>) => {
    const newService: ServiceDemand = {
      id: 'srv-' + makeId(),
      ...service,
      estado: 'PUBLICADO',
      createdAt: new Date().toISOString(),
    }
    setServices((prev) => [newService, ...prev])
  }

  const updateService = (id: string, service: Partial<ServiceDemand>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...service } : s)))
  }

  const addQuote = (quote: Omit<Quote, 'id'>) => {
    const newQuote: Quote = {
      id: 'qte-' + makeId(),
      ...quote,
    }
    setQuotes((prev) => [newQuote, ...prev])
  }

  const updateQuote = (id: string, quote: Partial<Quote>) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, ...quote } : q)))
  }

  const removeQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id))
  }

  const addPack = (payload: { name: string; supplyIds: string[]; totalPrice: number; basePrice: number; createdBy: string }) => {
    const newPack: SupplyPack = {
      id: 'pack-' + makeId(),
      name: payload.name,
      supplyIds: payload.supplyIds,
      totalPrice: payload.totalPrice,
      basePrice: payload.basePrice,
      createdBy: payload.createdBy,
      createdAt: new Date().toISOString(),
    }
    setPacks((prev) => [newPack, ...prev])
  }

  const addSupply = (supply: Omit<Supply, 'id'>) => {
    const newSupply: Supply = {
      id: 'sup-' + makeId(),
      ...supply,
    }
    setSupplies((prev) => [...prev, newSupply])
  }

  const updateSupply = (id: string, supply: Partial<Supply>) => {
    setSupplies((prev) => prev.map((s) => (s.id === id ? { ...s, ...supply } : s)))
  }

  const removeSupply = (id: string) => {
    setSupplies((prev) => prev.filter((s) => s.id !== id))
  }

  // Persistir en AsyncStorage
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(supplies)).catch(console.error)
    }
  }, [supplies, isLoading])

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.PACKS, JSON.stringify(packs)).catch(console.error)
    }
  }, [packs, isLoading])

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.SELECTED_QUOTES, JSON.stringify(selectedQuotes)).catch(console.error)
    }
  }, [selectedQuotes, isLoading])

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services)).catch(console.error)
    }
  }, [services, isLoading])

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes)).catch(console.error)
    }
  }, [quotes, isLoading])

  const value = useMemo(
    () => ({
      services,
      quotes,
      supplies,
      packs,
      selectedQuotes,
      selectQuote,
      addService,
      updateService,
      addQuote,
      updateQuote,
      removeQuote,
      addPack,
      addSupply,
      updateSupply,
      removeSupply,
    }),
    [services, quotes, supplies, packs, selectedQuotes],
  )

  // Proporcionar el valor del Context a todos los componentes hijos
  // No retornamos null, siempre proporcionamos el contexto aunque esté cargando
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState debe usarse dentro de AppStateProvider')
  }
  return context
}

