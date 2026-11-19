
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { Demonstracao } from './pages/Demonstracao'
import { Integrantes } from './pages/Integrantes/Integrantes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial */}
        <Route
          path="/"
          element={<Demonstracao />}
        />

        {/* Página dos integrantes do Alimenta+ */}
        <Route
          path="/integrantes"
          element={<Integrantes />}
        />

        {/* Redirecionamento para páginas inexistentes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
