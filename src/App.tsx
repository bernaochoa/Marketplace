import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import RoleSelection from './pages/RoleSelection'
import DashboardShell from './pages/DashboardShell'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/seleccionar-rol" element={<RoleSelection />} />
      <Route path="/app/*" element={<DashboardShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
