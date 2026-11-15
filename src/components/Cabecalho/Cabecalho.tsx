import { HeartHandshake, Menu, Search, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

type Props = { onSearch: (value: string) => void }
export function Cabecalho({ onSearch }: Props) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [busca, setBusca] = useState('')
  function pesquisar(evento: FormEvent) { evento.preventDefault(); onSearch(busca); document.getElementById('ofertas')?.scrollIntoView({ behavior: 'smooth' }) }
  return <header className="bg-navy text-white">
    <div className="border-b border-white/10 bg-[#0b2353] text-center text-[11px] font-medium tracking-wide text-blue-100"><div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 sm:justify-between"><span>Uma rede de solidariedade, perto de você.</span><span className="hidden sm:block">Juntos contra o desperdício de alimentos ✦</span></div></div>
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-5 sm:px-6 lg:gap-9 lg:px-8">
      <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Alimenta mais, início"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun text-navy"><HeartHandshake size={24} strokeWidth={2.3}/></span><span className="font-display text-2xl font-extrabold tracking-tight">alimenta<span className="text-sun">+</span></span></Link>
      <form onSubmit={pesquisar} className="order-3 flex h-11 w-full overflow-hidden rounded-lg bg-white lg:order-none lg:max-w-xl lg:flex-1"><label htmlFor="busca" className="sr-only">Buscar alimentos ou localidades</label><input id="busca" value={busca} onChange={e=>setBusca(e.target.value)} className="min-w-0 flex-1 px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400" placeholder="Busque alimentos, estabelecimentos ou cidades"/><button aria-label="Buscar" className="flex w-13 items-center justify-center bg-sun text-navy hover:bg-yellow-300"><Search size={20}/></button></form>
      <div className="ml-auto hidden items-center gap-5 text-sm font-semibold lg:flex"><a href="#como-funciona" className="hover:text-sun">Como funciona</a><Link to="/acesso" className="rounded-lg border border-white/35 px-4 py-2.5 hover:bg-white/10">Entrar na demonstração</Link></div>
      <button onClick={()=>setMenuAberto(!menuAberto)} aria-label={menuAberto?'Fechar menu':'Abrir menu'} aria-expanded={menuAberto} className="ml-auto rounded-lg p-2 hover:bg-white/10 lg:hidden">{menuAberto?<X/>:<Menu/>}</button>
    </div>
    <nav aria-label="Navegação principal" className={`${menuAberto?'block':'hidden'} border-t border-white/10 lg:block`}><div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 text-sm font-medium sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:py-0"><Link onClick={()=>setMenuAberto(false)} className="py-3 text-sun" to="/">Início</Link><a onClick={()=>setMenuAberto(false)} href="#ofertas" className="py-3 hover:text-sun">Explorar alimentos</a><a onClick={()=>setMenuAberto(false)} href="#como-funciona" className="py-3 hover:text-sun">Como funciona</a><Link onClick={()=>setMenuAberto(false)} to="/ofertas" className="py-3 hover:text-sun">Ofertas reais da demonstração</Link><Link onClick={()=>setMenuAberto(false)} to="/necessidades" className="py-3 hover:text-sun">Necessidades</Link><Link onClick={()=>setMenuAberto(false)} to="/acesso" className="py-3 hover:text-sun lg:hidden">Acesso demo</Link><span className="hidden flex-1 text-right text-xs text-blue-200 lg:block">Conectando quem pode doar com quem precisa receber.</span></div></nav>
  </header>
}
