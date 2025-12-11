export type UserRole = 'SOLICITANTE' | 'PROVEEDOR_SERVICIO' | 'PROVEEDOR_INSUMOS'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organization: string
  avatarColor: string
  password: string
}

export interface RequiredSupply {
  id: string
  name: string
  quantity: number
  unit: string
}

export type ServiceStatus = 'PUBLICADO' | 'EN_EVALUACION' | 'ASIGNADO' | 'COMPLETADO'
export type ServiceCategory = 'jardineria' | 'piscinas' | 'limpieza' | 'otros'

export interface ServiceDemand {
  id: string
  solicitanteId: string
  title: string
  description: string
  categoria: ServiceCategory
  direccion: string
  ciudad: string
  fechaPreferida: string // ISO date
  insumosRequeridos: RequiredSupply[]
  estado: ServiceStatus
  cotizacionSeleccionadaId?: string
  createdAt: string // ISO date
  // Campos legacy para compatibilidad
  budgetRange?: string
  deadline?: string
  createdBy?: string
  location?: string
  requiredSupplies?: RequiredSupply[]
  status?: string
}

// Tasas de cambio promedio a USD
export const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  UYU: 40, // 40 UYU = 1 USD
  EUR: 0.92, // 0.92 EUR = 1 USD
  ARS: 900, // 900 ARS = 1 USD
  BRL: 5, // 5 BRL = 1 USD
}

export const convertToUSD = (price: number, currency: string): number => {
  const rate = CURRENCY_RATES[currency] || 1
  if (currency === 'USD') return price
  return price / rate
}

export const convertFromUSD = (priceUSD: number, toCurrency: string): number => {
  const rate = CURRENCY_RATES[toCurrency] || 1
  if (toCurrency === 'USD') return priceUSD
  return priceUSD * rate
}

export interface Quote {
  id: string
  serviceId: string
  providerId: string
  providerName: string
  totalPrice: number
  currency: string // Moneda de la cotización
  leadTimeDays: number
  rating: number
  message: string
  suppliesBreakdown: QuoteLine[]
}

export interface QuoteLine {
  id: string
  name: string
  quantity: number
  unit: string
  price: number
  currency?: string // Moneda opcional para cada línea
}

export interface Supply {
  id: string
  name: string
  unit: string
  stock: number
  price: number
  currency: string
  category: string
  description?: string
}

export interface SupplyPack {
  id: string
  name: string
  supplyIds: string[]
  basePrice: number
  totalPrice: number
  createdBy: string
  createdAt: string
}

export interface SupplyOffer {
  id: string
  serviceId: string
  vendedorId: string
  items: { supplyId: string; cantidad: number }[]
  precioTotal: number
  notas?: string
  createdAt: string
}

export const USERS: User[] = [
  {
    id: 'usr-01',
    name: 'María González',
    email: 'maria@cliente.com',
    role: 'SOLICITANTE',
    organization: 'Ministerio de Salud',
    avatarColor: '#2563eb',
    password: 'solicitante123',
  },
  {
    id: 'usr-02',
    name: 'Luis Fernández',
    email: 'luis@infra.com',
    role: 'PROVEEDOR_SERVICIO',
    organization: 'InfraWorks',
    avatarColor: '#16a34a',
    password: 'proveedor123',
  },
  {
    id: 'usr-03',
    name: 'Ana Ribeiro',
    email: 'ana@insumos.co',
    role: 'PROVEEDOR_INSUMOS',
    organization: 'Insumos del Sur',
    avatarColor: '#f97316',
    password: 'insumos123',
  },
]

export const INITIAL_SERVICES: ServiceDemand[] = [
  {
    id: 'srv-01',
    solicitanteId: 'usr-01',
    title: 'Mantenimiento integral de centros de salud',
    description:
      'Servicio de mantenimiento preventivo y correctivo para 5 centros de salud regionales, incluyendo calibración de equipos básicos.',
    categoria: 'limpieza',
    direccion: 'Av. 18 de Julio 1234',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-01', name: 'Kit de limpieza avanzada', quantity: 12, unit: 'kits' },
      { id: 'sup-02', name: 'Filtros HEPA', quantity: 24, unit: 'unidades' },
      { id: 'sup-05', name: 'Lubricante médico', quantity: 18, unit: 'botellas' },
    ],
    estado: 'EN_EVALUACION',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    budgetRange: 'USD 35k - 45k',
    deadline: '15 días',
    createdBy: 'María González',
    location: 'Montevideo',
  },
  {
    id: 'srv-02',
    solicitanteId: 'usr-01',
    title: 'Actualización de cableado estructurado',
    description: 'Reemplazo de cableado categoría 5e por categoría 6A en oficinas administrativas.',
    categoria: 'otros',
    direccion: 'Ruta 5 km 45',
    ciudad: 'Canelones',
    fechaPreferida: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-07', name: 'Cable categoría 6A', quantity: 1200, unit: 'metros' },
      { id: 'sup-09', name: 'Bandejas portacable', quantity: 80, unit: 'unidades' },
    ],
    estado: 'EN_EVALUACION',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    budgetRange: 'USD 18k - 24k',
    deadline: '30 días',
    createdBy: 'María González',
    location: 'Canelones',
  },
  {
    id: 'srv-03',
    solicitanteId: 'usr-01',
    title: 'Programa de gestión de residuos clínicos',
    description: 'Implementación de protocolos y recolección semanal de residuos peligrosos.',
    categoria: 'limpieza',
    direccion: 'Calle Real 567',
    ciudad: 'Colonia',
    fechaPreferida: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-03', name: 'Contenedores bioseguridad 30L', quantity: 60, unit: 'unidades' },
      { id: 'sup-04', name: 'Bolsas rojas reforzadas', quantity: 300, unit: 'unidades' },
    ],
    estado: 'ASIGNADO',
    cotizacionSeleccionadaId: 'qte-01',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    budgetRange: 'USD 22k - 30k',
    deadline: '20 días',
    createdBy: 'María González',
    location: 'Colonia',
  },
  {
    id: 'srv-04',
    solicitanteId: 'usr-01',
    title: 'Mantenimiento y limpieza de piscinas comunitarias',
    description: 'Servicio mensual de limpieza, tratamiento químico y mantenimiento de 3 piscinas comunitarias durante temporada estival.',
    categoria: 'piscinas',
    direccion: 'Av. Rivera 890',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-10', name: 'Cloro granulado', quantity: 50, unit: 'kg' },
      { id: 'sup-11', name: 'Filtros de arena', quantity: 6, unit: 'unidades' },
      { id: 'sup-12', name: 'Químicos balanceadores', quantity: 30, unit: 'litros' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-05',
    solicitanteId: 'usr-01',
    title: 'Diseño y mantenimiento de jardines institucionales',
    description: 'Diseño paisajístico y mantenimiento mensual de jardines en edificio gubernamental, incluyendo poda, riego y fertilización.',
    categoria: 'jardineria',
    direccion: 'Bvar. Artigas 1234',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-13', name: 'Fertilizante orgánico', quantity: 200, unit: 'kg' },
      { id: 'sup-14', name: 'Plantas ornamentales', quantity: 150, unit: 'unidades' },
      { id: 'sup-15', name: 'Sistema de riego por goteo', quantity: 1, unit: 'sistema' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'qte-01',
    serviceId: 'srv-01',
    providerId: 'usr-02',
    providerName: 'InfraWorks',
    totalPrice: 39800,
    currency: 'USD',
    leadTimeDays: 14,
    rating: 4.8,
    message: 'Incluimos supervisión onsite y reporte semanal.',
    suppliesBreakdown: [
      { id: 'sup-01', name: 'Kit de limpieza avanzada', quantity: 12, unit: 'kits', price: 9600, currency: 'USD' },
      { id: 'sup-02', name: 'Filtros HEPA', quantity: 24, unit: 'unidades', price: 11200, currency: 'USD' },
      { id: 'man-01', name: 'Mano de obra especializada', quantity: 160, unit: 'horas', price: 19000, currency: 'USD' },
    ],
  },
  {
    id: 'qte-02',
    serviceId: 'srv-01',
    providerId: 'prov-02',
    providerName: 'TecnoCare',
    totalPrice: 1490000,
    currency: 'UYU',
    leadTimeDays: 16,
    rating: 4.5,
    message: 'Propuesta optimizada con calibración digital incluida.',
    suppliesBreakdown: [
      { id: 'sup-01', name: 'Kit de limpieza avanzada', quantity: 12, unit: 'kits', price: 372000, currency: 'UYU' },
      { id: 'sup-02', name: 'Filtros HEPA', quantity: 24, unit: 'unidades', price: 440000, currency: 'UYU' },
      { id: 'ops-01', name: 'Supervisión senior', quantity: 5, unit: 'visitas', price: 212000, currency: 'UYU' },
      { id: 'man-02', name: 'Técnicos certificados', quantity: 150, unit: 'horas', price: 466000, currency: 'UYU' },
    ],
  },
]

export const INITIAL_SUPPLIES: Supply[] = [
  { id: 'sup-01', name: 'Cemento Portland', unit: 'kg', stock: 500, price: 15.5, currency: 'USD', category: 'Construcción', description: 'Cemento de alta calidad para construcción' },
  { id: 'sup-02', name: 'Pintura Látex Blanca', unit: 'litros', stock: 200, price: 25, currency: 'USD', category: 'Pintura', description: 'Pintura interior de alta cobertura' },
  { id: 'sup-03', name: 'Cable Eléctrico THW calibre 12', unit: 'metros', stock: 1000, price: 20, currency: 'USD', category: 'Electricidad', description: 'Cable para instalaciones eléctricas residenciales' },
  { id: 'sup-04', name: 'Luminarias LED 18W', unit: 'unidad', stock: 150, price: 150, currency: 'USD', category: 'Electricidad', description: 'Lámparas de bajo consumo con luz blanca' },
  { id: 'sup-05', name: 'Kit de limpieza avanzada', unit: 'kits', stock: 50, price: 800, currency: 'USD', category: 'Limpieza', description: 'Kit completo con productos profesionales' },
  { id: 'sup-06', name: 'Filtros HEPA', unit: 'unidades', stock: 100, price: 450, currency: 'USD', category: 'Limpieza', description: 'Filtros de alta eficiencia para sistemas de aire' },
  { id: 'sup-07', name: 'Cable categoría 6A', unit: 'metros', stock: 2000, price: 11.5, currency: 'USD', category: 'Tecnología', description: 'Cable de red de alta velocidad' },
  { id: 'sup-08', name: 'Lubricante médico', unit: 'botellas', stock: 80, price: 165, currency: 'USD', category: 'Mantenimiento', description: 'Lubricante especializado para equipos médicos' },
  { id: 'sup-09', name: 'Bandejas portacable', unit: 'unidades', stock: 200, price: 54, currency: 'USD', category: 'Tecnología', description: 'Bandejas metálicas para organización de cables' },
  { id: 'sup-10', name: 'Cloro granulado', unit: 'kg', stock: 300, price: 50, currency: 'USD', category: 'Piscinas', description: 'Cloro estabilizado para piscinas' },
  { id: 'sup-11', name: 'Filtros de arena', unit: 'unidades', stock: 40, price: 800, currency: 'USD', category: 'Piscinas', description: 'Filtros de arena para sistemas de piscina' },
  { id: 'sup-12', name: 'Químicos balanceadores', unit: 'litros', stock: 150, price: 40, currency: 'USD', category: 'Piscinas', description: 'Kit de químicos para balance de pH y alcalinidad' },
  { id: 'sup-13', name: 'Fertilizante orgánico', unit: 'kg', stock: 500, price: 9, currency: 'USD', category: 'Jardinería', description: 'Fertilizante orgánico de liberación lenta' },
  { id: 'sup-14', name: 'Plantas ornamentales', unit: 'unidades', stock: 300, price: 30, currency: 'USD', category: 'Jardinería', description: 'Plantas ornamentales variadas para jardín' },
  { id: 'sup-15', name: 'Sistema de riego por goteo', unit: 'sistema', stock: 20, price: 2200, currency: 'USD', category: 'Jardinería', description: 'Sistema completo de riego automatizado' },
]

