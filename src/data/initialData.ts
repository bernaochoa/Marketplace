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
    // Legacy
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
    // Legacy
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
    // Legacy
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
  {
    id: 'srv-06',
    solicitanteId: 'usr-01',
    title: 'Limpieza profunda de oficinas administrativas',
    description: 'Limpieza profunda mensual de 8 pisos de oficinas, incluyendo alfombras, ventanas y sanitarios.',
    categoria: 'limpieza',
    direccion: 'Av. Libertador 567',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-16', name: 'Detergente industrial', quantity: 100, unit: 'litros' },
      { id: 'sup-17', name: 'Aspiradoras industriales', quantity: 4, unit: 'unidades' },
      { id: 'sup-18', name: 'Paños de microfibra', quantity: 200, unit: 'unidades' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-07',
    solicitanteId: 'usr-01',
    title: 'Instalación de sistema de seguridad perimetral',
    description: 'Instalación de cámaras, sensores y sistema de alarmas para perímetro de edificio gubernamental.',
    categoria: 'otros',
    direccion: 'Ruta 1 km 25',
    ciudad: 'San José',
    fechaPreferida: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-19', name: 'Cámaras IP', quantity: 12, unit: 'unidades' },
      { id: 'sup-20', name: 'Cable de red', quantity: 500, unit: 'metros' },
      { id: 'sup-21', name: 'Sensores de movimiento', quantity: 8, unit: 'unidades' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-08',
    solicitanteId: 'usr-01',
    title: 'Limpieza y mantenimiento de áreas verdes',
    description: 'Mantenimiento semanal de áreas verdes, poda de árboles y arbustos, y limpieza de senderos en parque público.',
    categoria: 'jardineria',
    direccion: 'Parque Rodó',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-13', name: 'Fertilizante orgánico', quantity: 150, unit: 'kg' },
      { id: 'sup-14', name: 'Plantas ornamentales', quantity: 80, unit: 'unidades' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-09',
    solicitanteId: 'usr-01',
    title: 'Renovación de piscina olímpica',
    description: 'Renovación completa de piscina olímpica: limpieza, reparación de azulejos, instalación de nuevo sistema de filtración y tratamiento de agua.',
    categoria: 'piscinas',
    direccion: 'Complejo Deportivo Municipal',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-10', name: 'Cloro granulado', quantity: 200, unit: 'kg' },
      { id: 'sup-11', name: 'Filtros de arena', quantity: 12, unit: 'unidades' },
      { id: 'sup-12', name: 'Químicos balanceadores', quantity: 100, unit: 'litros' },
      { id: 'sup-24', name: 'Pintura Epoxi', quantity: 80, unit: 'litros' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-10',
    solicitanteId: 'usr-01',
    title: 'Limpieza post-obra de edificio nuevo',
    description: 'Limpieza exhaustiva post-construcción de edificio de 10 pisos, incluyendo eliminación de residuos, limpieza de ventanas y preparación para ocupación.',
    categoria: 'limpieza',
    direccion: 'Av. Italia 3456',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-16', name: 'Detergente industrial', quantity: 300, unit: 'litros' },
      { id: 'sup-17', name: 'Aspiradoras industriales', quantity: 8, unit: 'unidades' },
      { id: 'sup-18', name: 'Paños de microfibra', quantity: 500, unit: 'unidades' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-11',
    solicitanteId: 'usr-01',
    title: 'Instalación de sistema de riego automatizado',
    description: 'Instalación de sistema completo de riego automatizado con sensores de humedad para campo deportivo de 5000 m².',
    categoria: 'jardineria',
    direccion: 'Estadio Municipal',
    ciudad: 'Canelones',
    fechaPreferida: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-15', name: 'Sistema de riego por goteo', quantity: 2, unit: 'sistemas' },
      { id: 'sup-13', name: 'Fertilizante orgánico', quantity: 300, unit: 'kg' },
    ],
    estado: 'EN_EVALUACION',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-12',
    solicitanteId: 'usr-01',
    title: 'Mantenimiento preventivo de piscinas comunitarias',
    description: 'Servicio trimestral de mantenimiento preventivo para 5 piscinas comunitarias, incluyendo análisis de agua y ajuste de químicos.',
    categoria: 'piscinas',
    direccion: 'Complejo Habitacional',
    ciudad: 'Maldonado',
    fechaPreferida: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-10', name: 'Cloro granulado', quantity: 100, unit: 'kg' },
      { id: 'sup-12', name: 'Químicos balanceadores', quantity: 60, unit: 'litros' },
    ],
    estado: 'EN_EVALUACION',
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-13',
    solicitanteId: 'usr-01',
    title: 'Limpieza y desinfección de espacios comunes',
    description: 'Limpieza profunda y desinfección de espacios comunes en edificio de oficinas: pasillos, ascensores, recepción y baños.',
    categoria: 'limpieza',
    direccion: 'Torre Empresarial',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-05', name: 'Kit de limpieza avanzada', quantity: 20, unit: 'kits' },
      { id: 'sup-06', name: 'Filtros HEPA', quantity: 30, unit: 'unidades' },
      { id: 'sup-16', name: 'Detergente industrial', quantity: 150, unit: 'litros' },
    ],
    estado: 'ASIGNADO',
    cotizacionSeleccionadaId: 'qte-07',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-14',
    solicitanteId: 'usr-01',
    title: 'Diseño paisajístico de plaza pública',
    description: 'Diseño completo y ejecución de proyecto paisajístico para plaza pública, incluyendo plantación de árboles, arbustos y sistema de iluminación.',
    categoria: 'jardineria',
    direccion: 'Plaza Independencia',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-14', name: 'Plantas ornamentales', quantity: 300, unit: 'unidades' },
      { id: 'sup-13', name: 'Fertilizante orgánico', quantity: 400, unit: 'kg' },
      { id: 'sup-15', name: 'Sistema de riego por goteo', quantity: 1, unit: 'sistema' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-15',
    solicitanteId: 'usr-01',
    title: 'Reparación y mantenimiento de sistema eléctrico',
    description: 'Reparación de instalación eléctrica y actualización de tableros en edificio administrativo de 6 pisos.',
    categoria: 'otros',
    direccion: 'Av. 8 de Octubre 2345',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-03', name: 'Cable Eléctrico THW calibre 12', quantity: 2000, unit: 'metros' },
      { id: 'sup-27', name: 'Cable THW calibre 10', quantity: 500, unit: 'metros' },
      { id: 'sup-04', name: 'Luminarias LED 18W', quantity: 200, unit: 'unidad' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-16',
    solicitanteId: 'usr-01',
    title: 'Limpieza de tanques de agua potable',
    description: 'Limpieza y desinfección de tanques de agua potable en 3 edificios públicos, incluyendo certificación sanitaria.',
    categoria: 'limpieza',
    direccion: 'Complejo Gubernamental',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-05', name: 'Kit de limpieza avanzada', quantity: 15, unit: 'kits' },
      { id: 'sup-22', name: 'Contenedores bioseguridad 30L', quantity: 20, unit: 'unidades' },
    ],
    estado: 'COMPLETADO',
    cotizacionSeleccionadaId: 'qte-01',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-17',
    solicitanteId: 'usr-01',
    title: 'Mantenimiento de jardines verticales',
    description: 'Mantenimiento mensual de jardines verticales en fachada de edificio, incluyendo poda, riego y fertilización.',
    categoria: 'jardineria',
    direccion: 'Edificio Corporativo',
    ciudad: 'Montevideo',
    fechaPreferida: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-13', name: 'Fertilizante orgánico', quantity: 100, unit: 'kg' },
      { id: 'sup-14', name: 'Plantas ornamentales', quantity: 50, unit: 'unidades' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'srv-18',
    solicitanteId: 'usr-01',
    title: 'Instalación de sistema de monitoreo de calidad de agua',
    description: 'Instalación de sistema automatizado de monitoreo de calidad de agua en piscinas públicas con alertas en tiempo real.',
    categoria: 'piscinas',
    direccion: 'Centro Deportivo',
    ciudad: 'Punta del Este',
    fechaPreferida: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    insumosRequeridos: [
      { id: 'sup-19', name: 'Cámaras IP', quantity: 4, unit: 'unidades' },
      { id: 'sup-20', name: 'Cable de red', quantity: 200, unit: 'metros' },
      { id: 'sup-12', name: 'Químicos balanceadores', quantity: 50, unit: 'litros' },
    ],
    estado: 'PUBLICADO',
    createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
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
  {
    id: 'qte-03',
    serviceId: 'srv-01',
    providerId: 'prov-03',
    providerName: 'ProMedical',
    totalPrice: 37720,
    currency: 'EUR',
    leadTimeDays: 12,
    rating: 4.9,
    message: 'Mayor cobertura de garantías a 12 meses.',
    suppliesBreakdown: [
      { id: 'sup-01', name: 'Kit de limpieza avanzada', quantity: 12, unit: 'kits', price: 9108, currency: 'EUR' },
      { id: 'sup-02', name: 'Filtros HEPA', quantity: 24, unit: 'unidades', price: 10396, currency: 'EUR' },
      { id: 'sup-05', name: 'Lubricante médico', quantity: 18, unit: 'botellas', price: 2944, currency: 'EUR' },
      { id: 'man-03', name: 'Equipo onsite', quantity: 175, unit: 'horas', price: 15172, currency: 'EUR' },
    ],
  },
  {
    id: 'qte-04',
    serviceId: 'srv-02',
    providerId: 'usr-02',
    providerName: 'InfraWorks',
    totalPrice: 21500,
    currency: 'USD',
    leadTimeDays: 28,
    rating: 4.2,
    message: 'Incluye certificación Fluke y pruebas de estrés.',
    suppliesBreakdown: [
      { id: 'sup-07', name: 'Cable categoría 6A', quantity: 1200, unit: 'metros', price: 13800, currency: 'USD' },
      { id: 'sup-09', name: 'Bandejas portacable', quantity: 80, unit: 'unidades', price: 4300, currency: 'USD' },
      { id: 'man-05', name: 'Equipo de instalación', quantity: 120, unit: 'horas', price: 3400, currency: 'USD' },
    ],
  },
  {
    id: 'qte-05',
    serviceId: 'srv-04',
    providerId: 'usr-02',
    providerName: 'InfraWorks',
    totalPrice: 12500,
    currency: 'USD',
    leadTimeDays: 7,
    rating: 4.6,
    message: 'Incluimos análisis de agua semanal y reportes mensuales.',
    suppliesBreakdown: [
      { id: 'sup-10', name: 'Cloro granulado', quantity: 50, unit: 'kg', price: 2500, currency: 'USD' },
      { id: 'sup-11', name: 'Filtros de arena', quantity: 6, unit: 'unidades', price: 4800, currency: 'USD' },
      { id: 'sup-12', name: 'Químicos balanceadores', quantity: 30, unit: 'litros', price: 1200, currency: 'USD' },
      { id: 'man-06', name: 'Mantenimiento mensual', quantity: 6, unit: 'visitas', price: 4000, currency: 'USD' },
    ],
  },
  {
    id: 'qte-06',
    serviceId: 'srv-05',
    providerId: 'usr-02',
    providerName: 'InfraWorks',
    totalPrice: 8500,
    currency: 'USD',
    leadTimeDays: 20,
    rating: 4.7,
    message: 'Diseño personalizado con plantas nativas y sistema de riego automatizado.',
    suppliesBreakdown: [
      { id: 'sup-13', name: 'Fertilizante orgánico', quantity: 200, unit: 'kg', price: 1800, currency: 'USD' },
      { id: 'sup-14', name: 'Plantas ornamentales', quantity: 150, unit: 'unidades', price: 4500, currency: 'USD' },
      { id: 'sup-15', name: 'Sistema de riego por goteo', quantity: 1, unit: 'sistema', price: 2200, currency: 'USD' },
    ],
  },
  {
    id: 'qte-07',
    serviceId: 'srv-06',
    providerId: 'usr-02',
    providerName: 'InfraWorks',
    totalPrice: 6800,
    currency: 'USD',
    leadTimeDays: 5,
    rating: 4.4,
    message: 'Equipo especializado con productos ecológicos y certificación de calidad.',
    suppliesBreakdown: [
      { id: 'sup-16', name: 'Detergente industrial', quantity: 100, unit: 'litros', price: 800, currency: 'USD' },
      { id: 'sup-17', name: 'Aspiradoras industriales', quantity: 4, unit: 'unidades', price: 3200, currency: 'USD' },
      { id: 'sup-18', name: 'Paños de microfibra', quantity: 200, unit: 'unidades', price: 400, currency: 'USD' },
      { id: 'man-07', name: 'Personal de limpieza', quantity: 240, unit: 'horas', price: 2400, currency: 'USD' },
    ],
  },
  {
    id: 'qte-08',
    serviceId: 'srv-04',
    providerId: 'prov-05',
    providerName: 'AquaClean',
    totalPrice: 11800,
    currency: 'USD',
    leadTimeDays: 10,
    rating: 4.3,
    message: 'Servicio completo con análisis de agua incluido y garantía de calidad.',
    suppliesBreakdown: [
      { id: 'sup-10', name: 'Cloro granulado', quantity: 50, unit: 'kg', price: 2400, currency: 'USD' },
      { id: 'sup-11', name: 'Filtros de arena', quantity: 6, unit: 'unidades', price: 4600, currency: 'USD' },
      { id: 'sup-12', name: 'Químicos balanceadores', quantity: 30, unit: 'litros', price: 1100, currency: 'USD' },
      { id: 'man-08', name: 'Mantenimiento y análisis', quantity: 6, unit: 'visitas', price: 3700, currency: 'USD' },
    ],
  },
  {
    id: 'qte-09',
    serviceId: 'srv-05',
    providerId: 'prov-06',
    providerName: 'GreenSpace',
    totalPrice: 9200,
    currency: 'USD',
    leadTimeDays: 25,
    rating: 4.6,
    message: 'Diseño sostenible con plantas autóctonas y sistema de riego inteligente.',
    suppliesBreakdown: [
      { id: 'sup-13', name: 'Fertilizante orgánico', quantity: 200, unit: 'kg', price: 2000, currency: 'USD' },
      { id: 'sup-14', name: 'Plantas ornamentales', quantity: 150, unit: 'unidades', price: 4800, currency: 'USD' },
      { id: 'sup-15', name: 'Sistema de riego por goteo', quantity: 1, unit: 'sistema', price: 2400, currency: 'USD' },
    ],
  },
  {
    id: 'qte-10',
    serviceId: 'srv-06',
    providerId: 'prov-07',
    providerName: 'CleanPro',
    totalPrice: 7200,
    currency: 'USD',
    leadTimeDays: 6,
    rating: 4.5,
    message: 'Limpieza profunda con productos certificados y personal capacitado.',
    suppliesBreakdown: [
      { id: 'sup-16', name: 'Detergente industrial', quantity: 100, unit: 'litros', price: 850, currency: 'USD' },
      { id: 'sup-17', name: 'Aspiradoras industriales', quantity: 4, unit: 'unidades', price: 3400, currency: 'USD' },
      { id: 'sup-18', name: 'Paños de microfibra', quantity: 200, unit: 'unidades', price: 450, currency: 'USD' },
      { id: 'man-09', name: 'Personal especializado', quantity: 240, unit: 'horas', price: 2500, currency: 'USD' },
    ],
  },
  {
    id: 'qte-11',
    serviceId: 'srv-07',
    providerId: 'usr-02',
    providerName: 'InfraWorks',
    totalPrice: 18500,
    currency: 'USD',
    leadTimeDays: 30,
    rating: 4.7,
    message: 'Sistema completo con monitoreo remoto y app móvil incluida.',
    suppliesBreakdown: [
      { id: 'sup-19', name: 'Cámaras IP', quantity: 12, unit: 'unidades', price: 4200, currency: 'USD' },
      { id: 'sup-20', name: 'Cable de red', quantity: 500, unit: 'metros', price: 750, currency: 'USD' },
      { id: 'sup-21', name: 'Sensores de movimiento', quantity: 8, unit: 'unidades', price: 960, currency: 'USD' },
      { id: 'man-10', name: 'Instalación y configuración', quantity: 80, unit: 'horas', price: 8600, currency: 'USD' },
    ],
  },
  {
    id: 'qte-12',
    serviceId: 'srv-07',
    providerId: 'prov-08',
    providerName: 'SecureTech',
    totalPrice: 17200,
    currency: 'USD',
    leadTimeDays: 28,
    rating: 4.4,
    message: 'Instalación profesional con garantía extendida de 2 años.',
    suppliesBreakdown: [
      { id: 'sup-19', name: 'Cámaras IP', quantity: 12, unit: 'unidades', price: 3960, currency: 'USD' },
      { id: 'sup-20', name: 'Cable de red', quantity: 500, unit: 'metros', price: 700, currency: 'USD' },
      { id: 'sup-21', name: 'Sensores de movimiento', quantity: 8, unit: 'unidades', price: 920, currency: 'USD' },
      { id: 'man-11', name: 'Instalación certificada', quantity: 80, unit: 'horas', price: 8620, currency: 'USD' },
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
  { id: 'sup-16', name: 'Detergente industrial', unit: 'litros', stock: 200, price: 8, currency: 'USD', category: 'Limpieza', description: 'Detergente concentrado para limpieza profesional' },
  { id: 'sup-17', name: 'Aspiradoras industriales', unit: 'unidades', stock: 15, price: 800, currency: 'USD', category: 'Limpieza', description: 'Aspiradoras de alto rendimiento para uso profesional' },
  { id: 'sup-18', name: 'Paños de microfibra', unit: 'unidades', stock: 500, price: 2, currency: 'USD', category: 'Limpieza', description: 'Paños de microfibra reutilizables' },
  { id: 'sup-19', name: 'Cámaras IP', unit: 'unidades', stock: 50, price: 350, currency: 'USD', category: 'Seguridad', description: 'Cámaras de seguridad IP con visión nocturna' },
  { id: 'sup-20', name: 'Cable de red', unit: 'metros', stock: 1000, price: 1.5, currency: 'USD', category: 'Tecnología', description: 'Cable de red categoría 5e' },
  { id: 'sup-21', name: 'Sensores de movimiento', unit: 'unidades', stock: 60, price: 120, currency: 'USD', category: 'Seguridad', description: 'Sensores PIR para detección de movimiento' },
  { id: 'sup-22', name: 'Contenedores bioseguridad 30L', unit: 'unidades', stock: 100, price: 45, currency: 'USD', category: 'Limpieza', description: 'Contenedores para residuos peligrosos' },
  { id: 'sup-23', name: 'Bolsas rojas reforzadas', unit: 'unidades', stock: 500, price: 3.5, currency: 'USD', category: 'Limpieza', description: 'Bolsas para residuos biológicos' },
  { id: 'sup-24', name: 'Pintura Epoxi', unit: 'litros', stock: 150, price: 45, currency: 'USD', category: 'Pintura', description: 'Pintura epoxi para superficies industriales' },
  { id: 'sup-25', name: 'Cemento rápido', unit: 'kg', stock: 300, price: 22, currency: 'USD', category: 'Construcción', description: 'Cemento de fraguado rápido' },
  { id: 'sup-26', name: 'Lámparas LED 36W', unit: 'unidad', stock: 200, price: 85, currency: 'USD', category: 'Electricidad', description: 'Lámparas LED de mayor potencia' },
  { id: 'sup-27', name: 'Cable THW calibre 10', unit: 'metros', stock: 800, price: 28, currency: 'USD', category: 'Electricidad', description: 'Cable eléctrico de mayor calibre' },
]
