import { useEffect, useMemo, useState } from 'react'
import { USERS, type UserRole } from '../data/initialData'
import { useAuth } from '../context/AuthContext'

interface LoginProps {
  onSuccess: (role: UserRole) => void
  preferredRole?: UserRole
}

const Login = ({ onSuccess, preferredRole }: LoginProps) => {
  const { login } = useAuth()
  const defaultUser = useMemo(() => {
    if (preferredRole) {
      return USERS.find((candidate) => candidate.role === preferredRole) ?? USERS[0]
    }
    return USERS[0]
  }, [preferredRole])

  const [selectedUserId, setSelectedUserId] = useState(defaultUser?.id ?? '')
  const [email, setEmail] = useState(defaultUser?.email ?? '')
  const [password, setPassword] = useState(defaultUser?.password ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (defaultUser) {
      setSelectedUserId(defaultUser.id)
      setEmail(defaultUser.email)
      setPassword(defaultUser.password)
      setError(null)
    }
  }, [defaultUser])

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const user = USERS.find((candidate) => candidate.id === event.target.value)
    if (user) {
      setSelectedUserId(user.id)
      setEmail(user.email)
      setPassword(user.password)
      setError(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const authenticatedUser = await login(email, password)
      onSuccess(authenticatedUser.role)
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Error al iniciar sesión')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl sm:rounded-3xl border border-slate-200 bg-white/90 p-5 sm:p-8 shadow-card">
      <header className="mb-6 sm:mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-500">Marketplace</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">Accede a la plataforma</h1>
        <p className="text-sm text-slate-500">Selecciona un rol preconfigurado o ingresa tus credenciales.</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="preset">
            Usuarios disponibles
          </label>
          <select
            id="preset"
            value={selectedUserId}
            onChange={handlePresetChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none"
          >
            {USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} · {user.role.toLowerCase().replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </section>
  )
}

export default Login
