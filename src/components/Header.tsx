import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../data/initialData'

interface HeaderProps {
  isAuthenticated: boolean
  currentRole?: UserRole
  onChangeUser?: () => void
  onLogout?: () => void
}

const LogoMark = ({ isHome = false }: { isHome?: boolean }) => {
  if (isHome) {
    // Logo simple para Home (casa blanca con fondo azul y destello azul)
    return (
      <svg width="56" height="56" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
        {/* Fondo azul oscuro como en el login */}
        <rect x="4" y="12" width="26" height="26" rx="8" fill="#0B2234" />
        {/* Casa en blanco */}
        <path
          d="M11 25.5 21 16l10 9.5v11c0 .828-.672 1.5-1.5 1.5h-7v-7h-4v7h-7c-.828 0-1.5-.672-1.5-1.5v-11Z"
          fill="white"
        />
        {/* Destello/estrellita en la esquina superior derecha con fondo azul oscuro */}
        <circle cx="28" cy="18" r="4" fill="#0B2234" />
        <circle cx="28" cy="18" r="2.5" fill="#10B5E8" />
        <path
          d="M28 15.5v1M28 20.5v1M30.5 18h-1M25.5 18h-1M30.5 19.5l-0.7-0.7M25.5 16.5l-0.7-0.7M30.5 16.5l-0.7 0.7M25.5 19.5l-0.7 0.7"
          stroke="#0B2234"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  // Logo completo para otras páginas
  return (
    <svg width="56" height="56" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      <rect x="4" y="12" width="26" height="26" rx="8" fill="#0B2234" />
      <path
        d="M11 25.5 21 16l10 9.5v11c0 .828-.672 1.5-1.5 1.5h-7v-7h-4v7h-7c-.828 0-1.5-.672-1.5-1.5v-11Z"
        fill="#10B5E8"
      />
      <circle cx="34" cy="17" r="6" stroke="#0B2234" strokeWidth="2" fill="#fff" />
      <path
        d="M34 13v2M34 19v2M38 17h-2M32 17h-2M37.242 20.242l-1.414-1.414M31.172 14.172l-1.414-1.414M37.242 13.758l-1.414 1.414M31.172 19.828l1.414 1.414"
        stroke="#10B5E8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const Header = ({ isAuthenticated, currentRole, onChangeUser, onLogout }: HeaderProps) => {
  const { currentUser } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const roleLabel = currentRole?.replace('_', ' ') ?? ''
  const isRoleSelectionPage = location.pathname === '/seleccionar-rol'
  const isHomePage = location.pathname === '/'

  return (
    <header className={`sticky top-0 z-20 ${isHomePage ? 'bg-[#1A9BC4] border-[#1A9BC4] w-full left-0 right-0' : 'border-b border-slate-200 bg-white/95 backdrop-blur'}`}>
      <div className={`flex items-center ${isHomePage ? 'w-full px-0' : 'mx-auto max-w-6xl px-4 sm:px-6'} py-2.5 sm:py-3`}>
        <div className={`flex items-center gap-2 sm:gap-3 flex-1 min-w-0 ${isHomePage ? 'pl-4 sm:pl-6' : ''}`}>
          <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${isHomePage ? 'bg-white/10 backdrop-blur-sm' : 'bg-brand-50'}`}>
            <LogoMark isHome={isHomePage} />
          </div>
          <div className="hidden sm:block">
            <p className={`text-xs uppercase tracking-widest ${isHomePage ? 'text-white/80' : ''}`}>
              {isHomePage ? (
                'ServiciosMarket'
              ) : (
                <>
                  <span className="text-dark-blue">Servicios</span>
                  <span className="text-brand-500">Market</span>
                </>
              )}
            </p>
            <p className={`text-sm sm:text-base font-semibold ${isHomePage ? 'text-white' : 'text-dark-blue'}`}>Marketplace de Servicios</p>
          </div>
        </div>
        {isAuthenticated && currentRole && (
          <span className={`hidden rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide md:inline-flex mr-3 flex-shrink-0 ${
            isHomePage
              ? 'border border-white/30 bg-white/10 text-white'
              : 'border border-brand-100 bg-brand-50 text-dark-blue'
          }`}>
            {roleLabel}
          </span>
        )}
        <div className={`relative flex-shrink-0 ${isHomePage ? 'pr-4 sm:pr-6' : ''}`}>
          {isAuthenticated && currentUser ? (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-left ${
                  isHomePage
                    ? 'border border-white/30 hover:border-white/50'
                    : 'border border-slate-200 hover:border-brand-400'
                }`}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {currentUser.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="hidden text-[10px] md:block">
                  <p className={isHomePage ? 'text-white/80' : 'text-slate-500'}>{currentUser.role.replace('_', ' ')}</p>
                  <p className={`text-xs font-semibold ${isHomePage ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</p>
                </div>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-2xl">
                  <div className="px-2 pb-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{currentUser.role.replace('_', ' ')}</p>
                  </div>
                  {onChangeUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        onChangeUser()
                      }}
                      className="mt-2 w-full rounded-xl px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Cambiar de Rol/Usuario
                    </button>
                  )}
                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        onLogout()
                      }}
                      className="mt-1 w-full rounded-xl px-3 py-2 text-left font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Salir
                    </button>
                  )}
                </div>
              )}
            </>
          ) : isRoleSelectionPage ? (
            <Link
              to="/"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:bg-slate-50"
            >
              Volver al inicio
            </Link>
          ) : (
            <Link
              to="/seleccionar-rol"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isHomePage
                  ? 'border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:bg-slate-50'
              }`}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
