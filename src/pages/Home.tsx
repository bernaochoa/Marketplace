import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const benefits = [
  {
    title: 'Gestión completa',
    body: 'Administra demandas, cotizaciones y packs desde un mismo panel con visibilidad total.',
    color: 'benefit-icon--blue',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.333 4.667H6.3a2.3 2.3 0 0 0-2.3 2.3v14.066a2.3 2.3 0 0 0 2.3 2.3h15.4a2.3 2.3 0 0 0 2.3-2.3V11.2L17.5 4.667H9.333Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M17.5 4.667v6.534H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.333 15.167h9.334M9.333 19.833h5.834" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Procesos más rápidos',
    body: 'Compará propuestas en segundos con métricas claras de precio, plazo y rating.',
    color: 'benefit-icon--teal',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M23.333 7 14 2.333 4.667 7v6.3c0 6.533 4.867 12.133 9.333 12.7 4.466-.567 9.333-6.167 9.333-12.7V7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 14v-5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Seguro y transparente',
    body: 'Trazabilidad completa de cada interacción con historial y registros accesibles.',
    color: 'benefit-icon--orange',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 17.5v-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.987 6.417a2.916 2.916 0 1 0 .026 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="m8.4 3.5 15 4.667-3.7 12V24.5L5.6 20.5V7.2a3.7 3.7 0 0 1 2.8-3.567Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

const roles = ['Solicitantes', 'Proveedores de servicio', 'Proveedores de insumos']

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="home">
      <Header isAuthenticated={isAuthenticated} />
      <main className="home__hero">
        <section className="home__hero-content">
          <span className="home__badge">Conectando oportunidades</span>
          <h1>
            El marketplace que conecta <span>servicios e insumos</span>
          </h1>
          <p>
            ServiciosMarket centraliza los procesos de compra pública y privada para que equipos de solicitantes y
            proveedores colaboren con información clara, tiempos ágiles y trazabilidad desde el primer contacto.
          </p>
          <ul className="home__roles">
            {roles.map((role) => (
              <li key={role}>
                <span className="home__roles-icon" aria-hidden="true" />
                <span>{role}</span>
              </li>
            ))}
          </ul>
          <div className="home__cta">
            <Link to="/seleccionar-rol">Explorar roles</Link>
          </div>
        </section>
        <section className="home__cards" aria-label="Beneficios del marketplace">
          <article className="home__card home__card--large">
            <div className={`benefit-icon ${benefits[0].color}`}>{benefits[0].icon}</div>
            <h3>{benefits[0].title}</h3>
            <p>{benefits[0].body}</p>
          </article>
          <div className="home__card-grid">
            {benefits.slice(1).map((benefit) => (
              <article key={benefit.title} className="home__card">
                <div className={`benefit-icon ${benefit.color}`}>{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
