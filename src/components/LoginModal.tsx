import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { USERS, type UserRole } from '../data/initialData'
import { useAuth } from '../context/AuthContext'

interface LoginModalProps {
  role: UserRole
  onClose: () => void
}

const LoginModal = ({ role, onClose }: LoginModalProps) => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const defaultUser = useMemo(() => {
    return USERS.find((candidate) => candidate.role === role) ?? USERS[0]
  }, [role])

  const [email, setEmail] = useState(defaultUser?.email ?? '')
  const [password, setPassword] = useState(defaultUser?.password ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (defaultUser) {
      setEmail(defaultUser.email)
      setPassword(defaultUser.password)
      setError(null)
    }
  }, [defaultUser])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const authenticatedUser = await login(email, password)
      if (authenticatedUser.role === role) {
        navigate('/app', { replace: true })
      } else {
        setError('Las credenciales no corresponden a este rol')
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Error al iniciar sesión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const roleLabels: Record<UserRole, string> = {
    SOLICITANTE: 'Solicitante',
    PROVEEDOR_SERVICIO: 'Proveedor de Servicio',
    PROVEEDOR_INSUMOS: 'Proveedor de Insumos',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-500">Iniciar sesión</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{roleLabels[role]}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-sm font-semibold text-rose-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginModal

