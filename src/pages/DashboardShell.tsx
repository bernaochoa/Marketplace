/**
 * DashboardShell - Layout principal de la aplicación autenticada
 * 
 * Este componente:
 * 1. Renderiza el Header en la parte superior
 * 2. Maneja las rutas anidadas dentro de /app/*
 * 3. Muestra el dashboard correspondiente según el rol del usuario
 * 4. Muestra el formulario de login si no está autenticado
 * 
 * Las rutas anidadas incluyen:
 * - /app - Dashboard principal (según rol)
 * - /app/servicios/:id - Detalle de servicio
 * - /app/insumos - Catálogo de insumos (solo Proveedor de Insumos)
 * - /app/cotizaciones - Mis cotizaciones (solo Proveedor de Servicio)
 */

import { useMemo, useState } from 'react'
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom'
import Header from '../components/Header'
import Login from '../components/Login'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../data/initialData'
import SolicitanteDashboard from '../screens/SolicitanteDashboard'
import ProveedorServicioDashboard from '../screens/ProveedorServicioDashboard'
import ProveedorInsumosDashboard from '../screens/ProveedorInsumosDashboard'
import ServiceDetail from './ServiceDetail'
import InsumosPage from './InsumosPage'
import CotizacionesPage from './CotizacionesPage'

/**
 * Convierte un rol opcional a un rol válido
 * Si no hay rol, devuelve 'SOLICITANTE' por defecto
 */
const roleToScreen = (role?: UserRole): UserRole => role ?? 'SOLICITANTE'

const DashboardShell = () => {
  // Obtener estado de autenticación y funciones del AuthContext
  const { isAuthenticated, currentUser, logout, switchUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Obtener el rol preferido desde el state de la navegación (si viene de RoleSelection)
  const preferredRole = (location.state as { role?: UserRole } | null)?.role
  
  // Estado local para el dashboard actual a mostrar
  // Se inicializa con el rol del usuario actual o el rol preferido
  const [currentScreen, setCurrentScreen] = useState<UserRole>(roleToScreen(currentUser?.role))

  /**
   * Maneja el éxito del login
   * Actualiza el dashboard a mostrar según el rol del usuario que se logueó
   */
  const handleLoginSuccess = (role: UserRole) => {
    setCurrentScreen(role)
  }

  /**
   * Maneja el logout
   * Cierra sesión, resetea el dashboard a SOLICITANTE y navega a la home
   */
  const handleLogout = () => {
    logout()
    setCurrentScreen('SOLICITANTE')
    navigate('/', { replace: true })
  }

  /**
   * Maneja el cambio de usuario
   * Cierra sesión, resetea el dashboard y navega a la selección de rol
   */
  const handleChangeUser = () => {
    switchUser()
    setCurrentScreen('SOLICITANTE')
    navigate('/seleccionar-rol', { replace: true })
  }

  /**
   * useMemo: Memoizar el componente del dashboard según el rol
   * Solo se recalcula cuando cambia currentScreen
   * Esto evita re-renderizar el dashboard innecesariamente
   */
  const screenComponent = useMemo(() => {
    switch (currentScreen) {
      case 'PROVEEDOR_SERVICIO':
        return <ProveedorServicioDashboard />
      case 'PROVEEDOR_INSUMOS':
        return <ProveedorInsumosDashboard />
      case 'SOLICITANTE':
      default:
        return <SolicitanteDashboard />
    }
  }, [currentScreen])

  return (
    <div className="h-screen bg-slate-100 text-slate-900 flex flex-col overflow-hidden">
      {/* Header siempre visible en la parte superior */}
      <Header
        isAuthenticated={isAuthenticated}
        currentRole={currentScreen}
        onChangeUser={handleChangeUser}
        onLogout={handleLogout}
      />
      {/* Contenido principal: rutas anidadas o login */}
      <main className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 py-4 sm:py-6 flex-1 overflow-y-auto">
        {isAuthenticated ? (
          // Rutas anidadas dentro de /app/*
          // Estas rutas solo son accesibles si el usuario está autenticado
          <Routes>
            {/* Dashboard principal según el rol */}
            <Route path="/" element={screenComponent} />
            {/* Detalle de un servicio específico */}
            <Route path="servicios/:id" element={<ServiceDetail />} />
            {/* Catálogo de insumos (solo para Proveedor de Insumos) */}
            <Route path="insumos" element={<InsumosPage />} />
            {/* Mis cotizaciones (solo para Proveedor de Servicio) */}
            <Route path="cotizaciones" element={<CotizacionesPage />} />
          </Routes>
        ) : (
          // Si no está autenticado, mostrar formulario de login
          <div className="flex items-center justify-center min-h-full">
            <Login onSuccess={handleLoginSuccess} preferredRole={preferredRole} />
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardShell
