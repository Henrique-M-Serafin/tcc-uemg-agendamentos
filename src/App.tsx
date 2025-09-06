
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { HomePage } from './pages/HomePage'
import { AppointmentsPage } from './pages/Appointments'
import { VehiclesPage } from './pages/Vehicles'

function PublicRoute({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" 
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          } 
        />
        <Route path='/agendamentos'
          element={
            <PublicRoute>
              <AppointmentsPage />
            </PublicRoute>
          }
        />
        <Route path='/veiculos'
          element={
            <PublicRoute>
              <VehiclesPage />
            </PublicRoute>
          }
        />

      </Routes>
      </div>
    </Router>
  )
}

export default App
