import { Link } from 'react-router-dom'

export function Rodape() {
  return <footer className="bg-navy px-4 py-9 text-white sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-6">
      <div>
        <Link to="/" className="font-display text-xl font-extrabold">alimenta<span className="text-sun">+</span></Link>
        <p className="mt-2 text-sm text-blue-200">Conectando alimentos, pessoas e possibilidades.</p>
      </div>
      <div className="text-sm text-blue-200">
        <p>Projeto acadêmico · FIAP Global Solution</p>
        <p className="mt-2">Interface em desenvolvimento</p>
      </div>
    </div>
  </footer>
}
