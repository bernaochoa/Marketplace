// Imports de React y hooks
import { useState } from 'react'
import type { ReactNode } from 'react'
// Imports de React Router para navegación
import { Link } from 'react-router-dom'
// Componentes de la aplicación
import Header from '../components/Header'
import LoginModal from '../components/LoginModal'
import SkeletonList from '../components/SkeletonList'
// Context para verificar autenticación
import { useAuth } from '../context/AuthContext'
// Hook personalizado para mostrar skeleton loading
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'
// Tipos TypeScript
import type { UserRole } from '../data/initialData'
// Estilos CSS específicos de la página
import './RoleSelection.css'

/**
 * Array de roles disponibles en el marketplace
 * Cada rol contiene:
 * - id: Identificador único del rol (UserRole)
 * - title: Título del rol
 * - description: Descripción de qué hace ese rol
 * - accent: Clase CSS para el color de acento
 * - icon: Componente SVG del ícono del rol
 */
const roles: Array<{
  id: UserRole
  title: string
  description: string
  accent: string
  icon: ReactNode
}> = [
  {
    id: 'SOLICITANTE',
    title: 'Solicitante',
    description: 'Publico y gestiono los servicios o insumos que necesito.',
    accent: 'role-card--blue',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="26" cy="18" r="9" stroke="currentColor" strokeWidth="3" />
        <path d="M12 42c2.6-7 8.667-10.5 14-10.5s11.4 3.5 14 10.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'PROVEEDOR_SERVICIO',
    title: 'Proveedor de Servicio',
    description: 'Ofrezco mis servicios profesionales para licitaciones.',
    accent: 'role-card--orange',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="m15 33 7-7m8-8 7-7M11 37l8.5-1.5L36.5 18M13 25l4 4M29 11l4 4"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M41.5 33.5c5-1 7 7 2 8s-7-7-2-8ZM10.5 16.5c5-1 7 7 2 8s-7-7-2-8Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'PROVEEDOR_INSUMOS',
    title: 'Proveedor de Insumos',
    description: 'Vendo materiales, repuestos y packs con descuento.',
    accent: 'role-card--green',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M10 17 26 8l16 9v16L26 42 10 33V17Zm32 0L26 26 10 17"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M26 26v16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
]

/**
 * Componente RoleSelection
 * 
 * Página para seleccionar el rol de usuario antes de iniciar sesión.
 * Permite elegir entre:
 * - SOLICITANTE: Publica y gestiona servicios/insumos necesarios
 * - PROVEEDOR_SERVICIO: Ofrece servicios profesionales
 * - PROVEEDOR_INSUMOS: Vende materiales y packs
 * 
 * Al seleccionar un rol, se abre un modal de login específico para ese rol.
 */
const RoleSelection = () => {
  // Obtener estado de autenticación del Context
  const { isAuthenticated } = useAuth()
  
  // Estado local para el rol seleccionado (null si no hay ninguno)
  // Cuando se selecciona un rol, se muestra el modal de login
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  
  // Hook personalizado que muestra skeleton loading durante 800ms
  // Array vacío [] = solo se ejecuta al montar
  const isLoading = useSkeletonDelay([])

  /**
   * Maneja la selección de un rol
   * Actualiza el estado para mostrar el modal de login
   * 
   * @param role - Rol seleccionado por el usuario
   */
  const handleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  /**
   * Maneja el cierre del modal de login
   * Limpia el estado del rol seleccionado
   */
  const handleCloseModal = () => {
    setSelectedRole(null)
  }

  return (
    <>
      {/* Header con navegación */}
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Renderizado condicional: skeleton loading o contenido */}
      {isLoading ? (
        // Mostrar skeleton mientras se carga
        <SkeletonList variant="role-selection" />
      ) : (
        // Contenido principal de selección de roles
        <div className="role-selection">
          <div className="role-selection__shell">
            {/* Botón para volver al inicio */}
            <Link to="/" className="role-selection__back">
              <span aria-hidden="true">&larr;</span>
              <span>Volver al inicio</span>
            </Link>
            
            {/* Marca/logo del marketplace */}
            <div className="role-selection__mark" aria-hidden="true">
              SM
            </div>
            
            {/* Título y descripción */}
            <div className="role-selection__heading">
              <h1>Bienvenido a ServiciosMarket</h1>
              <p>Selecciona tu rol para continuar</p>
            </div>
            
            {/* Grid de tarjetas de roles */}
            <div className="role-selection__grid">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-card ${role.accent}`}
                  onClick={() => handleSelect(role.id)}
                  // Mejora la respuesta táctil en dispositivos móviles
                  // Reduce la opacidad al tocar para dar feedback visual
                  onTouchStart={(e) => {
                    e.currentTarget.style.opacity = '0.8'
                  }}
                  // Restaura la opacidad al soltar
                  onTouchEnd={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                >
                  <div className="role-card__icon">{role.icon}</div>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de login - solo se muestra si hay un rol seleccionado */}
      {selectedRole && <LoginModal role={selectedRole} onClose={handleCloseModal} />}
    </>
  )
}

export default RoleSelection
