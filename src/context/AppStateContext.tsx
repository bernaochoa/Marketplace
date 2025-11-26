/**
 * AppStateContext - Context API para gestionar el estado global de la aplicación
 * 
 * Este Context maneja:
 * - Servicios (ServiceDemand): Demandas de servicios publicadas por solicitantes
 * - Cotizaciones (Quote): Cotizaciones enviadas por proveedores de servicio
 * - Insumos (Supply): Catálogo de insumos de proveedores de insumos
 * - Packs (SupplyPack): Packs de insumos creados por proveedores
 * - Cotizaciones seleccionadas: Mapeo de servicioId -> quoteId seleccionada
 * 
 * También persiste todos los datos en localStorage para que persistan al recargar la página.
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  INITIAL_QUOTES,
  INITIAL_SERVICES,
  INITIAL_SUPPLIES,
  type Quote,
  type ServiceDemand,
  type Supply,
  type SupplyPack,
} from '../data/initialData'

// Interfaz que define qué valores y funciones expone el Context
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

// Crear el Context. El valor inicial es undefined porque se proveerá desde el Provider
const AppStateContext = createContext<AppStateValue | undefined>(undefined)

// Claves para localStorage - usadas para persistir los datos del estado global
const STORAGE_KEYS = {
  SUPPLIES: 'servicios-market-supplies',
  PACKS: 'servicios-market-packs',
  SELECTED_QUOTES: 'servicios-market-selected-quotes',
  SERVICES: 'servicios-market-services',
  QUOTES: 'servicios-market-quotes',
}

/**
 * Carga los insumos desde localStorage o devuelve los datos iniciales
 * Se ejecuta al montar el Provider (una sola vez)
 * 
 * @returns Array de insumos (Supply[])
 */
const loadSupplies = (): Supply[] => {
  // Verificar que estamos en el navegador (no en SSR)
  if (typeof window === 'undefined') return INITIAL_SUPPLIES
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.SUPPLIES)
    if (stored) {
      const parsed = JSON.parse(stored) as Supply[]
      // Validar que tenga la estructura correcta (array no vacío)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar supplies desde localStorage:', error)
  }
  // Si no hay datos guardados o hay error, usar datos iniciales
  return INITIAL_SUPPLIES
}

/**
 * Carga los packs desde localStorage
 * Los packs pueden estar vacíos (no hay datos iniciales de packs)
 * 
 * @returns Array de packs (SupplyPack[])
 */
const loadPacks = (): SupplyPack[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.PACKS)
    if (stored) {
      const parsed = JSON.parse(stored) as SupplyPack[]
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar packs desde localStorage:', error)
  }
  // Si no hay packs guardados, devolver array vacío
  return []
}

/**
 * Carga los servicios desde localStorage o devuelve los datos iniciales
 * 
 * @returns Array de servicios (ServiceDemand[])
 */
const loadServices = (): ServiceDemand[] => {
  if (typeof window === 'undefined') return INITIAL_SERVICES
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.SERVICES)
    if (stored) {
      const parsed = JSON.parse(stored) as ServiceDemand[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar services desde localStorage:', error)
  }
  return INITIAL_SERVICES
}

/**
 * Carga las cotizaciones desde localStorage o devuelve los datos iniciales
 * 
 * @returns Array de cotizaciones (Quote[])
 */
const loadQuotes = (): Quote[] => {
  if (typeof window === 'undefined') return INITIAL_QUOTES
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.QUOTES)
    if (stored) {
      const parsed = JSON.parse(stored) as Quote[]
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar quotes desde localStorage:', error)
  }
  return INITIAL_QUOTES
}

/**
 * Carga las cotizaciones seleccionadas desde localStorage
 * Si no hay datos guardados, construye la selección inicial basada en los servicios y cotizaciones
 * 
 * @returns Objeto que mapea serviceId -> quoteId seleccionada
 */
const loadSelectedQuotes = (): Record<string, string | null> => {
  if (typeof window === 'undefined') return buildInitialSelection(INITIAL_SERVICES, INITIAL_QUOTES)
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.SELECTED_QUOTES)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, string | null>
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error al cargar selectedQuotes desde localStorage:', error)
  }
  // Si no hay datos guardados, construir selección inicial desde servicios y cotizaciones cargados
  return buildInitialSelection(loadServices(), loadQuotes())
}

/**
 * Construye el mapeo inicial de cotizaciones seleccionadas
 * Para cada servicio, selecciona automáticamente la cotización más barata
 * 
 * @param services - Array de servicios
 * @param quotes - Array de cotizaciones
 * @returns Objeto que mapea serviceId -> quoteId (la más barata) o null
 */
const buildInitialSelection = (services: ServiceDemand[], quotes: Quote[]) => {
  return services.reduce<Record<string, string | null>>((acc, service) => {
    // Buscar todas las cotizaciones para este servicio
    const serviceQuotes = quotes.filter((quote) => quote.serviceId === service.id)
    // Ordenar por precio (más barata primero) y tomar la primera
    const bestQuote = serviceQuotes.sort((a, b) => a.totalPrice - b.totalPrice)[0]
    // Guardar el ID de la cotización más barata, o null si no hay cotizaciones
    acc[service.id] = bestQuote ? bestQuote.id : null
    return acc
  }, {})
}

/**
 * Genera un ID único para nuevas entidades
 * Usa crypto.randomUUID() si está disponible (navegadores modernos)
 * Si no, genera un ID aleatorio con Math.random()
 * 
 * @returns String con ID único
 */
const makeId = () =>
  typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10)

/**
 * Provider del AppStateContext
 * 
 * Este componente:
 * 1. Inicializa el estado desde localStorage (o datos iniciales)
 * 2. Proporciona funciones para modificar el estado
 * 3. Persiste automáticamente los cambios en localStorage mediante useEffect
 * 
 * @param children - Componentes hijos que tendrán acceso al Context
 */
export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  // Estados inicializados desde localStorage (o datos iniciales si no hay nada guardado)
  // Se ejecutan solo una vez al montar el componente (lazy initialization)
  const [services, setServices] = useState<ServiceDemand[]>(loadServices)
  const [quotes, setQuotes] = useState<Quote[]>(loadQuotes)
  const [supplies, setSupplies] = useState<Supply[]>(loadSupplies)
  const [packs, setPacks] = useState<SupplyPack[]>(loadPacks)
  const [selectedQuotes, setSelectedQuotes] = useState<Record<string, string | null>>(loadSelectedQuotes)

  /**
   * Selecciona una cotización para un servicio
   * Actualiza tanto el mapeo de cotizaciones seleccionadas como el estado del servicio
   * 
   * @param serviceId - ID del servicio
   * @param quoteId - ID de la cotización seleccionada
   */
  const selectQuote = (serviceId: string, quoteId: string) => {
    // Actualizar el mapeo de cotizaciones seleccionadas
    setSelectedQuotes((prev) => ({ ...prev, [serviceId]: quoteId }))
    // Actualizar el estado del servicio a ASIGNADO y guardar la cotización seleccionada
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? { ...s, estado: 'ASIGNADO' as const, cotizacionSeleccionadaId: quoteId }
          : s
      )
    )
  }

  /**
   * Agrega un nuevo servicio
   * Genera automáticamente el ID y la fecha de creación
   * El estado inicial siempre es 'PUBLICADO'
   * 
   * @param service - Datos del servicio (sin id ni createdAt)
   */
  const addService = (service: Omit<ServiceDemand, 'id' | 'createdAt'>) => {
    const newService: ServiceDemand = {
      id: 'srv-' + makeId(), // Generar ID único con prefijo 'srv-'
      ...service,
      estado: 'PUBLICADO', // Estado inicial siempre es PUBLICADO
      createdAt: new Date().toISOString(), // Fecha actual en formato ISO
    }
    // Agregar al inicio del array (los más recientes primero)
    setServices((prev) => [newService, ...prev])
  }

  /**
   * Actualiza un servicio existente
   * Solo actualiza los campos proporcionados (Partial permite actualizar solo algunos campos)
   * 
   * @param id - ID del servicio a actualizar
   * @param service - Campos a actualizar (parcial)
   */
  const updateService = (id: string, service: Partial<ServiceDemand>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...service } : s)))
  }

  /**
   * Agrega una nueva cotización
   * Genera automáticamente el ID
   * 
   * @param quote - Datos de la cotización (sin id)
   */
  const addQuote = (quote: Omit<Quote, 'id'>) => {
    const newQuote: Quote = {
      id: 'qte-' + makeId(), // Generar ID único con prefijo 'qte-'
      ...quote,
    }
    // Agregar al inicio del array (las más recientes primero)
    setQuotes((prev) => [newQuote, ...prev])
  }

  /**
   * Actualiza una cotización existente
   * 
   * @param id - ID de la cotización a actualizar
   * @param quote - Campos a actualizar (parcial)
   */
  const updateQuote = (id: string, quote: Partial<Quote>) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, ...quote } : q)))
  }

  /**
   * Elimina una cotización
   * 
   * @param id - ID de la cotización a eliminar
   */
  const removeQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id))
  }

  /**
   * Agrega un nuevo pack de insumos
   * Genera automáticamente el ID y la fecha de creación
   * 
   * @param payload - Datos del pack (name, supplyIds, totalPrice, basePrice, createdBy)
   */
  const addPack = (payload: { name: string; supplyIds: string[]; totalPrice: number; basePrice: number; createdBy: string }) => {
    const newPack: SupplyPack = {
      id: 'pack-' + makeId(), // Generar ID único con prefijo 'pack-'
      name: payload.name,
      supplyIds: payload.supplyIds,
      totalPrice: payload.totalPrice,
      basePrice: payload.basePrice,
      createdBy: payload.createdBy,
      createdAt: new Date().toISOString(), // Fecha actual en formato ISO
    }
    // Agregar al inicio del array (los más recientes primero)
    setPacks((prev) => [newPack, ...prev])
  }

  /**
   * Agrega un nuevo insumo al catálogo
   * Genera automáticamente el ID
   * 
   * @param supply - Datos del insumo (sin id)
   */
  const addSupply = (supply: Omit<Supply, 'id'>) => {
    const newSupply: Supply = {
      id: 'sup-' + makeId(), // Generar ID único con prefijo 'sup-'
      ...supply,
    }
    // Agregar al final del array
    setSupplies((prev) => [...prev, newSupply])
  }

  /**
   * Actualiza un insumo existente
   * 
   * @param id - ID del insumo a actualizar
   * @param supply - Campos a actualizar (parcial)
   */
  const updateSupply = (id: string, supply: Partial<Supply>) => {
    setSupplies((prev) => prev.map((s) => (s.id === id ? { ...s, ...supply } : s)))
  }

  /**
   * Elimina un insumo del catálogo
   * 
   * @param id - ID del insumo a eliminar
   */
  const removeSupply = (id: string) => {
    setSupplies((prev) => prev.filter((s) => s.id !== id))
  }

  /**
   * useEffect: UPDATE - Persistir supplies en localStorage
   * Se ejecuta cada vez que el array 'supplies' cambia
   * Esto asegura que los datos persistan al recargar la página
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(supplies))
      } catch (error) {
        console.error('Error al guardar supplies en localStorage:', error)
      }
    }
  }, [supplies])

  /**
   * useEffect: UPDATE - Persistir packs en localStorage
   * Se ejecuta cada vez que el array 'packs' cambia
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEYS.PACKS, JSON.stringify(packs))
      } catch (error) {
        console.error('Error al guardar packs en localStorage:', error)
      }
    }
  }, [packs])

  /**
   * useEffect: UPDATE - Persistir selectedQuotes en localStorage
   * Se ejecuta cada vez que el objeto 'selectedQuotes' cambia
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEYS.SELECTED_QUOTES, JSON.stringify(selectedQuotes))
      } catch (error) {
        console.error('Error al guardar selectedQuotes en localStorage:', error)
      }
    }
  }, [selectedQuotes])

  /**
   * useEffect: UPDATE - Persistir services en localStorage
   * Se ejecuta cada vez que el array 'services' cambia
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))
      } catch (error) {
        console.error('Error al guardar services en localStorage:', error)
      }
    }
  }, [services])

  /**
   * useEffect: UPDATE - Persistir quotes en localStorage
   * Se ejecuta cada vez que el array 'quotes' cambia
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes))
      } catch (error) {
        console.error('Error al guardar quotes en localStorage:', error)
      }
    }
  }, [quotes])

  /**
   * useMemo: Memoizar el valor del Context para evitar re-renders innecesarios
   * Solo se recalcula cuando cambian las dependencias (services, quotes, supplies, packs, selectedQuotes)
   * Las funciones (selectQuote, addService, etc.) son estables y no necesitan estar en dependencias
   */
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
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

/**
 * Hook personalizado para usar el AppStateContext
 * 
 * Este hook:
 * 1. Obtiene el contexto usando useContext
 * 2. Valida que el componente esté dentro del AppStateProvider
 * 3. Devuelve el valor del contexto (estado y funciones)
 * 
 * @returns AppStateValue con todos los datos y funciones del estado global
 * @throws Error si se usa fuera del AppStateProvider
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { services, addService } = useAppState()
 *   // Usar services y addService...
 * }
 * ```
 */
export const useAppState = () => {
  const context = useContext(AppStateContext)
  // Validar que el componente esté dentro del Provider
  if (!context) {
    throw new Error('useAppState debe usarse dentro de AppStateProvider')
  }
  return context
}
