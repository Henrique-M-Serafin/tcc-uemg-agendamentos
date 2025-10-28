
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { HomePage } from './pages/HomePage'
import { AppointmentsPage } from './pages/Appointments'
import { VehiclesPage } from './pages/Vehicles'
import { LoginPage } from './pages/LoginPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  // Implement your authentication logic here  
  
  return <Layout>{children}</Layout>

}

function PublicRoute({ children }: { children: React.ReactNode }) {
  return <div className="">{children}</div>
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path="/agendamentos" 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } 
        />
        <Route path='/solicitar-agendamento'
          element={
            <PrivateRoute>
              <AppointmentsPage />
            </PrivateRoute>
          }
        />
        <Route path='/veiculos'
          element={
            <PrivateRoute>
              <VehiclesPage />
            </PrivateRoute>
          }
        />

      </Routes>
      </div>
    </Router>
  )
}

export default App
