import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USERS, type User } from '../data/initialData'

interface AuthContextValue {
  currentUser: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  switchUser: () => void
}

const STORAGE_KEY = 'marketplace_current_user'
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const getStoredUser = async (): Promise<User | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch (error) {
    console.warn('Error al leer el usuario almacenado', error)
    await AsyncStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuario al montar
  useEffect(() => {
    const loadUser = async () => {
      const user = await getStoredUser()
      setCurrentUser(user)
      setIsLoading(false)
    }
    loadUser()
  }, [])

  const persistUser = async (user: User | null) => {
    setCurrentUser(user)
    try {
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Error al guardar usuario', error)
    }
  }

  const login = async (email: string, password: string) => {
    await delay(350)
    const normalizedEmail = email.trim().toLowerCase()
    const candidate = USERS.find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === password,
    )

    if (!candidate) {
      throw new Error('Credenciales inválidas')
    }

    await persistUser(candidate)
    return candidate
  }

  const logout = () => persistUser(null)
  const switchUser = () => persistUser(null)

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
      switchUser,
    }),
    [currentUser],
  )

  // Proporcionar el valor del Context a todos los componentes hijos
  // No retornamos null, siempre proporcionamos el contexto aunque esté cargando
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

