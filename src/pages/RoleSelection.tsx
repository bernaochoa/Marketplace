import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import LoginModal from '../components/LoginModal'
import SkeletonList from '../components/SkeletonList'
import { useAuth } from '../context/AuthContext'
import { useSkeletonDelay } from '../hooks/useSkeletonDelay'
import type { UserRole } from '../data/initialData'
import './RoleSelection.css'

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

const RoleSelection = () => {
  const { isAuthenticated } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const isLoading = useSkeletonDelay([])

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleCloseModal = () => {
    setSelectedRole(null)
  }

  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      {isLoading ? (
        <SkeletonList variant="role-selection" />
      ) : (
        <div className="role-selection">
          <div className="role-selection__shell">
            <Link to="/" className="role-selection__back">
              <span aria-hidden="true">&larr;</span>
              <span>Volver al inicio</span>
            </Link>
            <div className="role-selection__mark" aria-hidden="true">
              SM
            </div>
            <div className="role-selection__heading">
              <h1>Bienvenido a ServiciosMarket</h1>
              <p>Selecciona tu rol para continuar</p>
            </div>
            <div className="role-selection__grid">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-card ${role.accent}`}
                  onClick={() => handleSelect(role.id)}
                  onTouchStart={(e) => {
                    // Mejora la respuesta táctil en móvil
                    e.currentTarget.style.opacity = '0.8'
                  }}
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
      {selectedRole && <LoginModal role={selectedRole} onClose={handleCloseModal} />}
    </>
  )
}

export default RoleSelection
