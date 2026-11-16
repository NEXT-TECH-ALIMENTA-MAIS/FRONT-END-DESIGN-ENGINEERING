import { Link } from 'react-router-dom'
import { HeartHandshake } from 'lucide-react'

const anoAtual = new Date().getFullYear()

export function Rodape() {
  return <footer className="bg-navy text-white">
    <a href="#topo" className="block bg-[#234576] px-4 py-3 text-center text-sm font-semibold hover:bg-bluebrand">Voltar ao início da página ↑</a>
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:px-8">
      <div><Link to="/" className="inline-flex items-center gap-2" aria-label="Alimenta mais, início"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun text-navy"><HeartHandshake size={22} strokeWidth={2.3}/></span><span className="font-display text-2xl font-extrabold">alimenta<span className="text-sun">+</span></span></Link><p className="mt-3 max-w-xs text-sm leading-6 text-blue-100">Conectando estabelecimentos e instituições para que mais alimentos cheguem a quem precisa.</p></div>
      <div><h2 className="font-display text-sm font-extrabold">Explore o Alimenta+</h2><ul className="mt-4 space-y-3 text-sm text-blue-100"><li><Link className="hover:text-sun" to="/ofertas">Ofertas de alimentos</Link></li><li><Link className="hover:text-sun" to="/necessidades">Necessidades</Link></li><li><Link className="hover:text-sun" to="/">Página inicial</Link></li></ul></div>
      <div><h2 className="font-display text-sm font-extrabold">Faça parte</h2><ul className="mt-4 space-y-3 text-sm text-blue-100"><li><Link className="hover:text-sun" to="/acesso">Acessar demonstração</Link></li><li><Link className="hover:text-sun" to="/painel">Meu painel</Link></li></ul></div>
    </div>
    <div className="border-t border-white/10 px-4 py-5 text-center text-xs leading-5 text-blue-200">© {anoAtual} Alimenta+. Todos os direitos reservados.</div>
  </footer>
}
