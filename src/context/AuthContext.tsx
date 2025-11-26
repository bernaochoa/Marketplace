/**
 * AuthContext - Context API para gestionar la autenticación de usuarios
 * 
 * Este Context maneja:
 * - Usuario actual (currentUser): El usuario que está logueado
 * - Estado de autenticación (isAuthenticated): Si hay un usuario logueado
 * - Funciones de login/logout: Para autenticar y desautenticar usuarios
 * 
 * Los datos se persisten en sessionStorage (se pierden al cerrar la pestaña)
 */

import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { USERS, type User } from '../data/initialData'

// Interfaz que define qué valores y funciones expone el Context
interface AuthContextValue {
  currentUser: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  switchUser: () => void
}

// Clave para sessionStorage (se pierde al cerrar la pestaña, a diferencia de localStorage)
const STORAGE_KEY = 'marketplace_current_user'

// Crear el Context. El valor inicial es undefined porque se proveerá desde el Provider
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Función auxiliar para simular un delay (útil para simular llamadas a API)
 * 
 * @param ms - Milisegundos de delay
 * @returns Promise que se resuelve después del delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Carga el usuario desde sessionStorage
 * Se ejecuta al montar el Provider para restaurar la sesión
 * 
 * @returns Usuario almacenado o null si no hay ninguno
 */
const getStoredUser = () => {
  // Verificar que estamos en el navegador (no en SSR)
  if (typeof window === 'undefined') return null
  const raw = window.sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch (error) {
    // Si hay error al parsear, limpiar el dato corrupto
    console.warn('Error al leer el usuario almacenado', error)
    window.sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

/**
 * Provider del AuthContext
 * 
 * Este componente:
 * 1. Inicializa el usuario desde sessionStorage (si existe)
 * 2. Proporciona funciones de login/logout
 * 3. Persiste el usuario en sessionStorage cuando cambia
 * 
 * @param children - Componentes hijos que tendrán acceso al Context
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado inicializado desde sessionStorage (lazy initialization)
  // Si hay un usuario guardado, se restaura la sesión
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser())

  /**
   * Persiste el usuario en sessionStorage y actualiza el estado
   * 
   * @param user - Usuario a persistir (o null para logout)
   */
  const persistUser = (user: User | null) => {
    setCurrentUser(user)
    if (typeof window === 'undefined') return
    if (user) {
      // Guardar usuario en sessionStorage
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      // Eliminar usuario de sessionStorage (logout)
      window.sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  /**
   * Autentica un usuario con email y contraseña
   * Simula un delay de 350ms para simular una llamada a API
   * 
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Promise con el usuario autenticado
   * @throws Error si las credenciales son inválidas
   */
  const login = async (email: string, password: string) => {
    // Simular delay de red (350ms)
    await delay(350)
    // Normalizar email (trim y lowercase) para comparación
    const normalizedEmail = email.trim().toLowerCase()
    // Buscar usuario en la lista de usuarios hardcodeados
    const candidate = USERS.find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === password,
    )

    if (!candidate) {
      throw new Error('Credenciales inválidas')
    }

    // Persistir usuario y actualizar estado
    persistUser(candidate)
    return candidate
  }

  /**
   * Cierra la sesión del usuario actual
   * Elimina el usuario del estado y de sessionStorage
   */
  const logout = () => persistUser(null)

  /**
   * Cambia de usuario (cierra sesión para permitir login de otro usuario)
   * Similar a logout pero con propósito diferente
   */
  const switchUser = () => persistUser(null)

  /**
   * useMemo: Memorizar el valor del Context para evitar re-renders innecesarios
   * Solo se recalcula cuando cambia currentUser
   * isAuthenticated se calcula dinámicamente desde currentUser
   */
  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser), // true si hay usuario, false si es null
      login,
      logout,
      switchUser,
    }),
    [currentUser],
  )

  // Proporcionar el valor del Context a todos los componentes hijos
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook personalizado para usar el AuthContext
 * 
 * Este hook:
 * 1. Obtiene el contexto usando useContext
 * 2. Valida que el componente esté dentro del AuthProvider
 * 3. Devuelve el valor del contexto (usuario, autenticación y funciones)
 * 
 * @returns AuthContextValue con usuario actual, estado de autenticación y funciones
 * @throws Error si se usa fuera del AuthProvider
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { currentUser, isAuthenticated, login } = useAuth()
 *   // Usar currentUser, isAuthenticated, login...
 * }
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  // Validar que el componente esté dentro del Provider
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
