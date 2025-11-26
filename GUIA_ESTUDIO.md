# 📚 GUÍA COMPLETA DE ESTUDIO - Marketplace de Servicios

Esta guía está diseñada para entender profundamente cómo funciona el código, los conceptos de React, y cómo resolver problemas comunes.

---

## 🗂️ Estructura del Proyecto - Dónde está cada cosa

```
src/
├── components/          # Componentes reutilizables (UI)
│   ├── ComparadorCotizaciones.tsx    # Tabla comparativa de cotizaciones
│   ├── DemandaList.tsx                # Lista de servicios/demandas
│   ├── FormularioCotizacion.tsx      # Formulario para crear/editar cotizaciones
│   ├── FormularioNuevoInsumo.tsx     # Formulario para crear/editar insumos
│   ├── FormularioNuevoServicio.tsx   # Formulario para publicar servicios
│   ├── FormularioPackInsumos.tsx     # Formulario para crear packs
│   ├── Header.tsx                     # Header con logo, navegación y perfil
│   ├── Login.tsx                      # Formulario de login
│   ├── LoginModal.tsx                 # Modal de login (usado en RoleSelection)
│   ├── SkeletonList.tsx               # Componente de carga (skeleton loading)
│   ├── SupplyCard.tsx                 # Tarjeta individual de insumo
│   └── DeleteConfirmModal.tsx         # Modal de confirmación para eliminar
│
├── context/             # Context API - Estado global de la aplicación
│   ├── AppStateContext.tsx    # Estado de servicios, cotizaciones, insumos, packs
│   └── AuthContext.tsx        # Estado de autenticación y usuario actual
│
├── data/                # Datos iniciales y tipos TypeScript
│   └── initialData.ts   # Datos mock, interfaces, funciones de conversión
│
├── hooks/               # Custom hooks (lógica reutilizable)
│   └── useSkeletonDelay.ts    # Hook para controlar tiempos de skeleton loading
│
├── pages/               # Páginas principales (rutas)
│   ├── DashboardShell.tsx     # Layout principal con Header y rutas anidadas
│   ├── Home.tsx                # Página de inicio
│   ├── RoleSelection.tsx      # Selección de rol antes de login
│   ├── ServiceDetail.tsx      # Detalle de servicio con cotizaciones
│   ├── InsumosPage.tsx        # Página del catálogo de insumos
│   └── CotizacionesPage.tsx   # Página de mis cotizaciones (proveedor)
│
├── screens/             # Dashboards específicos por rol
│   ├── SolicitanteDashboard.tsx           # Dashboard del solicitante
│   ├── ProveedorServicioDashboard.tsx    # Dashboard del proveedor de servicio
│   └── ProveedorInsumosDashboard.tsx     # Dashboard del proveedor de insumos
│
├── App.tsx              # Router principal - Define todas las rutas
├── main.tsx             # Punto de entrada - Renderiza la app
└── index.css            # Estilos globales (Tailwind)
```

### 📍 Ubicaciones Clave

**¿Dónde está el estado global?**
- `src/context/AppStateContext.tsx` - Estado de servicios, cotizaciones, insumos
- `src/context/AuthContext.tsx` - Estado de autenticación

**¿Dónde están los datos iniciales?**
- `src/data/initialData.ts` - Todos los datos mock (servicios, cotizaciones, insumos, usuarios)

**¿Dónde se definen las rutas?**
- `src/App.tsx` - Rutas principales (`/`, `/seleccionar-rol`, `/app`)
- `src/pages/DashboardShell.tsx` - Rutas anidadas (`/app/servicios/:id`, `/app/insumos`, `/app/cotizaciones`)

**¿Dónde se persisten los datos?**
- `src/context/AppStateContext.tsx` - Funciones `useEffect` que guardan en `localStorage`

**¿Dónde se cargan los datos al iniciar?**
- `src/context/AppStateContext.tsx` - Funciones `loadServices()`, `loadQuotes()`, `loadSupplies()`, etc.

---

## 🎯 Context API - Concepto y Uso

### ¿Qué es Context API?

**Context API** es una característica de React que permite compartir datos entre componentes sin tener que pasar props manualmente a través de cada nivel del árbol de componentes (prop drilling).

### ¿Para qué sirve?

1. **Estado Global**: Mantener datos que múltiples componentes necesitan acceder
2. **Evitar Prop Drilling**: No pasar props por 5 niveles de componentes
3. **Centralización**: Un solo lugar donde se gestiona el estado

### ¿Dónde lo usamos en este proyecto?

#### 1. **AppStateContext** (`src/context/AppStateContext.tsx`)

**¿Qué gestiona?**
- Servicios (ServiceDemand[])
- Cotizaciones (Quote[])
- Insumos (Supply[])
- Packs (SupplyPack[])
- Cotizaciones seleccionadas (Record<string, string>)

**¿Dónde se usa?**
- En TODOS los dashboards para leer servicios y cotizaciones
- En formularios para agregar/editar datos
- En componentes de lista para mostrar datos

**Ejemplo de uso:**
```typescript
// En cualquier componente
import { useAppState } from '../context/AppStateContext'

const MiComponente = () => {
  const { services, quotes, addService } = useAppState()
  
  // Ahora puedo usar services, quotes, addService sin pasar props
  return <div>{services.length} servicios</div>
}
```

**¿Por qué lo usamos?**
- Sin Context: Tendríamos que pasar `services`, `quotes`, `addService` como props desde `App.tsx` → `DashboardShell` → `SolicitanteDashboard` → `DemandaList` → etc.
- Con Context: Cualquier componente puede acceder directamente con `useAppState()`

#### 2. **AuthContext** (`src/context/AuthContext.tsx`)

**¿Qué gestiona?**
- Usuario actual (currentUser)
- Estado de autenticación (isAuthenticated)
- Funciones de login/logout

**¿Dónde se usa?**
- En `Header.tsx` para mostrar el usuario actual
- En `DashboardShell.tsx` para verificar autenticación
- En formularios para obtener el `userId` al crear servicios/cotizaciones

**Ejemplo de uso:**
```typescript
import { useAuth } from '../context/AuthContext'

const MiComponente = () => {
  const { currentUser, isAuthenticated, login } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }
  
  return <div>Hola {currentUser?.name}</div>
}
```

### Estructura de un Context

```typescript
// 1. Crear el Context
const AppStateContext = createContext<AppStateValue | undefined>(undefined)

// 2. Crear el Provider (componente que envuelve la app)
export const AppStateProvider = ({ children }) => {
  const [services, setServices] = useState([])
  // ... más estado
  
  const value = {
    services,
    addService: (service) => setServices([...services, service]),
    // ... más funciones
  }
  
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

// 3. Crear el Hook personalizado para usar el Context
export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState debe usarse dentro de AppStateProvider')
  }
  return context
}
```

### ¿Cuándo usar Context vs Props?

**Usa Context cuando:**
- ✅ Múltiples componentes en diferentes niveles necesitan los mismos datos
- ✅ El estado es global (autenticación, tema, carrito de compras)
- ✅ Evitarías pasar props por 3+ niveles

**Usa Props cuando:**
- ✅ Solo 1-2 niveles de componentes
- ✅ Los datos son específicos de un componente padre-hijo
- ✅ Quieres mantener componentes más simples y testeables

---

## 🔄 Ciclo de Vida de un Componente React

### ¿Qué es el ciclo de vida?

El **ciclo de vida** de un componente React son las diferentes fases por las que pasa un componente desde que se crea hasta que se destruye.

### Fases del Ciclo de Vida

#### 1. **Mount (Montaje)** - El componente se crea y se inserta en el DOM
#### 2. **Update (Actualización)** - El componente se actualiza cuando cambian props o estado
#### 3. **Unmount (Desmontaje)** - El componente se elimina del DOM

### En React con Hooks (useEffect)

En React moderno (con hooks), el ciclo de vida se maneja con **`useEffect`**:

```typescript
import { useEffect, useState } from 'react'

const MiComponente = () => {
  const [data, setData] = useState(null)
  
  // MOUNT: Se ejecuta cuando el componente se monta (aparece en pantalla)
  useEffect(() => {
    console.log('Componente montado')
    // Aquí harías llamadas a API, suscripciones, etc.
    
    // CLEANUP: Se ejecuta cuando el componente se desmonta
    return () => {
      console.log('Componente desmontado - limpiar recursos')
      // Aquí cancelas suscripciones, timers, etc.
    }
  }, []) // Array vacío = solo en mount/unmount
  
  // UPDATE: Se ejecuta cuando 'data' cambia
  useEffect(() => {
    console.log('Data cambió:', data)
  }, [data]) // Dependencias = se ejecuta cuando cambian
  
  return <div>{data}</div>
}
```

### Ejemplos en nuestro código

#### Ejemplo 1: Cargar datos al montar (`ServiceDetail.tsx`)

```typescript
const ServiceDetail = () => {
  const { id } = useParams()
  const { services } = useAppState()
  const [service, setService] = useState(null)
  
  // MOUNT: Cuando el componente se monta, busca el servicio
  useEffect(() => {
    const found = services.find(s => s.id === id)
    setService(found)
  }, [id, services]) // Se ejecuta cuando cambia 'id' o 'services'
  
  return <div>{service?.title}</div>
}
```

#### Ejemplo 2: Persistir datos al actualizar (`AppStateContext.tsx`)

```typescript
export const AppStateProvider = ({ children }) => {
  const [services, setServices] = useState(loadServices())
  
  // UPDATE: Cada vez que 'services' cambia, guarda en localStorage
  useEffect(() => {
    window.localStorage.setItem('services', JSON.stringify(services))
  }, [services]) // Se ejecuta cada vez que services cambia
  
  return <AppStateContext.Provider value={{ services }}>{children}</AppStateContext.Provider>
}
```

#### Ejemplo 3: Limpiar recursos al desmontar (`useSkeletonDelay.ts`)

```typescript
export const useSkeletonDelay = (deps = []) => {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    
    // CLEANUP: Cancela el timer si el componente se desmonta antes
    return () => clearTimeout(timer)
  }, deps)
  
  return isLoading
}
```

---

## 📡 useEffect: Mount, Update, Unmount

### Sintaxis de useEffect

```typescript
useEffect(() => {
  // Código que se ejecuta
  return () => {
    // Función de limpieza (cleanup)
  }
}, [dependencias]) // Array de dependencias
```

### 1. MOUNT (Montaje)

**¿Cuándo se ejecuta?**
- Cuando el componente aparece por primera vez en pantalla
- Solo UNA vez al inicio

**Sintaxis:**
```typescript
useEffect(() => {
  // Código que se ejecuta al montar
  console.log('Componente montado')
  
  // Ejemplos comunes:
  // - Cargar datos de API
  // - Suscribirse a eventos
  // - Inicializar timers
}, []) // Array VACÍO = solo en mount
```

**Ejemplo real en nuestro código:**
```typescript
// src/screens/SolicitanteDashboard.tsx
useEffect(() => {
  // Al montar, si no hay servicio activo, selecciona el primero
  if (!activeServiceId && services.length) {
    setActiveServiceId(services[0].id)
  }
}, [activeServiceId, services])
```

### 2. UPDATE (Actualización)

**¿Cuándo se ejecuta?**
- Cuando cambian las dependencias (props, estado)
- Cada vez que el componente se re-renderiza con nuevos datos

**Sintaxis:**
```typescript
useEffect(() => {
  // Código que se ejecuta cuando cambian las dependencias
  console.log('Dependencias cambiaron:', dep1, dep2)
}, [dep1, dep2]) // Lista de dependencias
```

**Ejemplo real en nuestro código:**
```typescript
// src/context/AppStateContext.tsx
// Cada vez que 'services' cambia, guarda en localStorage
useEffect(() => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('services', JSON.stringify(services))
  }
}, [services]) // Se ejecuta cada vez que services cambia
```

### 3. UNMOUNT (Desmontaje)

**¿Cuándo se ejecuta?**
- Cuando el componente se elimina del DOM
- Antes de que el componente desaparezca

**Sintaxis:**
```typescript
useEffect(() => {
  // Código que se ejecuta al montar/actualizar
  
  return () => {
    // CLEANUP: Código que se ejecuta al desmontar
    console.log('Componente desmontado')
    // Ejemplos:
    // - Cancelar suscripciones
    // - Limpiar timers
    // - Cerrar conexiones
  }
}, [dependencias])
```

**Ejemplo real en nuestro código:**
```typescript
// src/hooks/useSkeletonDelay.ts
useEffect(() => {
  setIsLoading(true)
  const timer = setTimeout(() => {
    setIsLoading(false)
  }, 800)
  
  // CLEANUP: Si el componente se desmonta antes de 800ms, cancela el timer
  return () => clearTimeout(timer)
}, deps)
```

### Reglas de useEffect

1. **Array vacío `[]`**: Solo en mount/unmount
2. **Con dependencias `[dep1, dep2]`**: Se ejecuta cuando cambian las dependencias
3. **Sin array**: Se ejecuta en CADA render (¡evitar!)
4. **Return cleanup**: Siempre limpiar recursos (timers, suscripciones, etc.)

---

## 🌐 Cuándo buscar datos a la API

### ¿En qué momento del ciclo de vida se buscan datos?

**Respuesta corta**: En el **MOUNT** del componente, usando `useEffect` con array vacío `[]`.

### Patrón común para cargar datos

```typescript
const MiComponente = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // MOUNT: Cargar datos cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/datos')
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, []) // Array vacío = solo al montar
  
  if (loading) return <Skeleton />
  if (error) return <Error message={error} />
  return <div>{data}</div>
}
```

### Ejemplos en nuestro proyecto

#### Ejemplo 1: Cargar datos desde localStorage al montar

```typescript
// src/context/AppStateContext.tsx
export const AppStateProvider = ({ children }) => {
  // MOUNT: loadServices() se ejecuta solo una vez al crear el estado
  const [services, setServices] = useState(loadServices())
  
  // loadServices() lee de localStorage o usa datos iniciales
  // Esto sucede ANTES del primer render
}
```

#### Ejemplo 2: Cargar datos cuando cambia un parámetro de ruta

```typescript
// src/pages/ServiceDetail.tsx
const ServiceDetail = () => {
  const { id } = useParams() // Parámetro de la URL
  const { services } = useAppState()
  const [service, setService] = useState(null)
  
  // UPDATE: Se ejecuta cuando cambia 'id' (navegas a otro servicio)
  useEffect(() => {
    const found = services.find(s => s.id === id)
    setService(found)
  }, [id, services]) // Se ejecuta cuando cambia la URL o los servicios
}
```

#### Ejemplo 3: Cargar datos cuando cambia un filtro

```typescript
// src/screens/ProveedorInsumosDashboard.tsx
const ProveedorInsumosDashboard = () => {
  const [activeTab, setActiveTab] = useState('catalogo')
  const { supplies } = useAppState()
  const [filteredSupplies, setFilteredSupplies] = useState([])
  
  // UPDATE: Filtra cuando cambia 'activeTab' o 'supplies'
  useEffect(() => {
    if (activeTab === 'catalogo') {
      setFilteredSupplies(supplies)
    } else {
      // Filtrar por otra lógica
    }
  }, [activeTab, supplies])
}
```

### ¿Cuándo NO buscar datos?

❌ **NO busques datos en el render directamente:**
```typescript
// ❌ MAL - Se ejecuta en cada render
const MiComponente = () => {
  const data = fetch('/api/datos') // ❌ Esto se ejecuta infinitamente
  return <div>{data}</div>
}
```

✅ **SÍ busca datos en useEffect:**
```typescript
// ✅ BIEN - Se ejecuta solo cuando es necesario
const MiComponente = () => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/datos').then(res => setData(res))
  }, []) // Solo al montar
  
  return <div>{data}</div>
}
```

### Flujo completo de carga de datos

```
1. Usuario navega a /app/servicios/123
   ↓
2. React monta ServiceDetail
   ↓
3. useEffect se ejecuta (mount)
   ↓
4. Busca el servicio con id='123' en el Context
   ↓
5. Actualiza el estado con setService()
   ↓
6. React re-renderiza con los nuevos datos
   ↓
7. Se muestra el servicio en pantalla
```

---

## 🔧 Cómo arreglar la aplicación si se rompe

### 1. Verificar errores en la consola del navegador

**Pasos:**
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo

**Errores comunes:**
- `Cannot read property 'X' of undefined` → Falta validar que el objeto exista
- `useAppState must be used within AppStateProvider` → Falta envolver con el Provider
- `Maximum update depth exceeded` → useEffect sin dependencias o dependencias incorrectas

### 2. Verificar errores de TypeScript

**Pasos:**
1. Abre la terminal
2. Ejecuta `npm run build` o revisa los errores en el IDE

**Errores comunes:**
- `Property 'X' does not exist on type 'Y'` → Falta definir la propiedad en la interfaz
- `Type 'X' is not assignable to type 'Y'` → Tipos incompatibles

### 3. Verificar el estado en React DevTools

**Pasos:**
1. Instala la extensión "React Developer Tools"
2. Abre DevTools → pestaña "Components"
3. Selecciona el componente que tiene el problema
4. Revisa el estado y props

### 4. Verificar localStorage

**Pasos:**
1. Abre DevTools → pestaña "Application"
2. Ve a "Local Storage" → `http://localhost:5173`
3. Revisa si los datos están corruptos

**Si los datos están corruptos:**
```javascript
// En la consola del navegador
localStorage.clear() // Limpia todo
// O específico:
localStorage.removeItem('servicios-market-services')
```

### 5. Errores comunes y soluciones

#### Error: "Cannot read property 'map' of undefined"

**Causa:** Intentas hacer `.map()` en un array que es `undefined`

**Solución:**
```typescript
// ❌ MAL
const items = data.items.map(...)

// ✅ BIEN
const items = data?.items?.map(...) ?? []
// O
const items = (data?.items || []).map(...)
```

#### Error: "useEffect has missing dependencies"

**Causa:** useEffect usa variables que no están en el array de dependencias

**Solución:**
```typescript
// ❌ MAL
useEffect(() => {
  fetchData(userId) // userId no está en dependencias
}, [])

// ✅ BIEN
useEffect(() => {
  fetchData(userId)
}, [userId]) // Agregar userId a dependencias
```

#### Error: "Maximum update depth exceeded"

**Causa:** useEffect actualiza el estado que está en sus dependencias, causando loop infinito

**Solución:**
```typescript
// ❌ MAL - Loop infinito
useEffect(() => {
  setCount(count + 1) // count cambia → useEffect se ejecuta → count cambia → ...
}, [count])

// ✅ BIEN - Usar función de actualización
useEffect(() => {
  setCount(prev => prev + 1) // No depende de count
}, []) // O remover count de dependencias si no es necesario
```

#### Error: "Context is undefined"

**Causa:** Usas un hook de Context fuera del Provider

**Solución:**
```typescript
// Verificar que el componente esté dentro del Provider en App.tsx
<AppStateProvider>
  <AuthProvider>
    <DashboardShell /> {/* ✅ Aquí sí funciona useAppState() */}
  </AuthProvider>
</AppStateProvider>
```

### 6. Debugging paso a paso

#### Paso 1: Identificar dónde está el error
- ¿En qué componente?
- ¿En qué línea?
- ¿Qué acción lo causa? (click, navegación, carga inicial)

#### Paso 2: Revisar el estado
```typescript
// Agregar console.log para debug
useEffect(() => {
  console.log('Estado actual:', { services, quotes, supplies })
}, [services, quotes, supplies])
```

#### Paso 3: Revisar props
```typescript
const MiComponente = ({ prop1, prop2 }) => {
  console.log('Props recibidas:', { prop1, prop2 })
  // ...
}
```

#### Paso 4: Revisar el flujo de datos
- ¿Los datos llegan al Context?
- ¿Los datos se pasan correctamente como props?
- ¿Los datos se actualizan cuando deberían?

### 7. Resetear la aplicación

Si todo falla, resetea los datos:

```javascript
// En la consola del navegador
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### 8. Verificar la estructura del proyecto

Asegúrate de que:
- ✅ `App.tsx` envuelve todo con los Providers
- ✅ Las rutas están correctamente definidas
- ✅ Los imports son correctos (rutas relativas)
- ✅ Los tipos TypeScript coinciden

---

## 📋 Resumen de Conceptos Clave

### Context API
- **¿Qué?** Sistema para compartir estado global sin prop drilling
- **¿Dónde?** `src/context/AppStateContext.tsx` y `src/context/AuthContext.tsx`
- **¿Cuándo usar?** Cuando múltiples componentes necesitan los mismos datos

### Ciclo de Vida
- **Mount**: Componente aparece → `useEffect(() => {}, [])`
- **Update**: Datos cambian → `useEffect(() => {}, [deps])`
- **Unmount**: Componente desaparece → `return () => { cleanup }`

### Cargar Datos
- **Cuándo**: En el **mount** del componente
- **Cómo**: `useEffect(() => { fetchData() }, [])`
- **Dónde**: En el componente que necesita los datos o en el Context Provider

### Debugging
1. Consola del navegador (F12)
2. React DevTools
3. Verificar localStorage
4. Console.log en puntos clave
5. Resetear datos si es necesario

---

## 🎓 Preguntas de Estudio

### Sobre Context API

1. **¿Qué problema resuelve Context API?**
   - Evita el "prop drilling" (pasar props por múltiples niveles)

2. **¿Cuándo debo usar Context vs Props?**
   - Context: Datos globales, múltiples niveles
   - Props: Datos locales, 1-2 niveles

3. **¿Dónde se define el Provider en este proyecto?**
   - En `src/App.tsx`, envolviendo toda la aplicación

### Sobre Ciclo de Vida

1. **¿Qué es el mount?**
   - Cuando el componente aparece por primera vez

2. **¿Cuándo se ejecuta useEffect con array vacío?**
   - Solo en mount y unmount

3. **¿Para qué sirve el cleanup en useEffect?**
   - Limpiar recursos (timers, suscripciones) cuando el componente se desmonta

### Sobre Carga de Datos

1. **¿En qué momento del ciclo de vida se cargan datos?**
   - En el mount, usando `useEffect(() => {}, [])`

2. **¿Qué pasa si busco datos directamente en el render?**
   - Se ejecuta infinitamente, causando loops

3. **¿Cómo cargo datos cuando cambia un parámetro de ruta?**
   - `useEffect(() => {}, [id])` donde `id` viene de `useParams()`

### Sobre Debugging

1. **¿Cómo identifico un error de Context?**
   - Error: "must be used within Provider"
   - Solución: Verificar que el componente esté dentro del Provider

2. **¿Qué hago si hay un loop infinito?**
   - Revisar dependencias de useEffect
   - Verificar que no actualices el estado que está en las dependencias

3. **¿Cómo reseteo los datos corruptos?**
   - `localStorage.clear()` en la consola del navegador

