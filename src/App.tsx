
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Demonstracao } from './pages/Demonstracao'
import { Integrantes } from './pages/Integrantes/Integrantes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Demonstracao />} />
        <Route path="/integrantes" element={<Integrantes />} />
      </Routes>
    </BrowserRouter>
  )
}
