import { HeartHandshake, Menu, Search, UserRound, X } from 'lucide-react'
import { useContext, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { PerfilContext } from '../../context/PerfilContext'

const paginas = [
  { nome: 'Início', caminho: '/' },
  { nome: 'Ofertas', caminho: '/ofertas' },
  { nome: 'Necessidades', caminho: '/necessidades' },
]

const institucionais = [
  { nome: 'Sobre', caminho: '/Sobre' },
  { nome: 'Integrantes', caminho: '/#' },
  { nome: 'FAQ', caminho: '/#' },
  { nome: 'Contato', caminho: '' },
]

export function Cabecalho() {
  const perfil = useContext(PerfilContext)
  const [menuAberto, setMenuAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const navegar = useNavigate()

  function pesquisar(evento: FormEvent) {
    evento.preventDefault()
    const termo = busca.trim()
    navegar(termo ? `/ofertas?busca=${encodeURIComponent(termo)}` : '/ofertas')
    setMenuAberto(false)
  }

  return <header className="bg-navy text-white">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:gap-5 sm:px-6 md:flex-nowrap lg:px-8">
      <Link to="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label="Alimenta mais, início">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sun text-navy sm:h-10 sm:w-10"><HeartHandshake size={22} strokeWidth={2.3} /></span>
        <span className="font-display text-base font-extrabold tracking-tight sm:text-2xl">alimenta<span className="text-sun">+</span></span>
      </Link>
      <form onSubmit={pesquisar} role="search" className="order-last flex h-11 w-full min-w-0 overflow-hidden rounded-lg bg-white md:order-none md:w-auto md:flex-1 lg:max-w-2xl">
        <label htmlFor="busca-cabecalho" className="sr-only">Buscar alimentos ou localidades</label>
        <input id="busca-cabecalho" value={busca} onChange={e => setBusca(e.target.value)} className="min-w-0 flex-1 px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400" placeholder="Busque alimentos ou localização" />
        <button type="submit" aria-label="Buscar ofertas" className="flex w-13 shrink-0 items-center justify-center bg-sun text-navy hover:bg-yellow-300"><Search size={20} /></button>
      </form>
      <Link to={perfil ? '/painel' : '/acesso'} className="ml-auto flex shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-white/10 sm:px-3" aria-label={perfil ? `Olá, ${perfil.nome}. Acessar demonstração` : 'Entrar na demonstração'}>
        <UserRound size={22} />
        {perfil ? <span className="hidden max-w-48 sm:block"><span className="block truncate text-xs text-blue-100">Olá, {perfil.nome}</span><strong>Acessar demonstração</strong><span className="block text-xs text-blue-200">Perfil fictício</span></span> : <strong>Entrar</strong>}
      </Link>
    </div>

    <div className="border-t border-white/10 bg-[#16366f]">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <nav aria-label="Navegação principal" className="hidden items-center gap-5 lg:flex">
          {paginas.map(pagina => <NavLink key={pagina.caminho} to={pagina.caminho} end={pagina.caminho === '/'} className={({ isActive }) => `text-sm font-semibold hover:text-sun ${isActive ? 'text-sun' : ''}`}>{pagina.nome}</NavLink>)}
        </nav>
        <div className="lg:hidden">
          <button type="button" onClick={() => setMenuAberto(!menuAberto)} aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuAberto} aria-controls="menu-mobile" className="rounded-lg p-2 hover:bg-white/10">{menuAberto ? <X /> : <Menu />}</button>
        </div>
        <Link to="/" className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sun text-navy" aria-label="Alimenta mais, início">
          <HeartHandshake size={24} strokeWidth={2.3} />
        </Link>
        <nav aria-label="Páginas institucionais" className="hidden items-center justify-end gap-5 lg:flex">
          {institucionais.map(pagina => (
            <NavLink
              key={pagina.nome}
              to={pagina.caminho}
              className={({ isActive }) =>
                `text-sm font-semibold hover:text-sun ${isActive ? 'text-sun' : ''
                }`
              }
            >
              {pagina.nome}
            </NavLink>
          ))}
        </nav>
        <div className="lg:hidden" aria-hidden="true" />
      </div>
    </div>

    <nav
      id="menu-mobile"
      aria-label="Menu mobile"
      className={`${menuAberto ? 'block' : 'hidden'} border-t border-white/10 bg-[#16366f] lg:hidden`}
    >
      <div className="flex flex-col gap-1 px-5 py-3 text-sm font-medium">

        {perfil && (
  <p className="py-2 text-blue-100">
    Olá, {perfil.nome}
    <span className="text-xs"> (perfil fictício)</span>
  </p>
)}

{paginas.map(pagina => (
  <NavLink
    key={pagina.caminho}
    to={pagina.caminho}
    end={pagina.caminho === '/'}
    onClick={() => setMenuAberto(false)}
    className={({ isActive }) =>
      `py-2 hover:text-sun ${isActive ? 'text-sun' : ''}`
    }
  >
    {pagina.nome}
  </NavLink>
))}

{institucionais.map(pagina => (
  <NavLink
    key={pagina.nome}
    to={pagina.caminho}
    onClick={() => setMenuAberto(false)}
    className={({ isActive }) =>
      `py-2 hover:text-sun ${isActive ? 'text-sun' : ''}`
    }
  >
    {pagina.nome}
  </NavLink>
))}

<Link
  to={perfil ? '/painel' : '/acesso'}
  onClick={() => setMenuAberto(false)}
  className="py-2 text-sun"
>
  {perfil ? 'Acessar demonstração' : 'Entrar'}
</Link>

        {perfil&&<p className="py-2 text-blue-100">Olá, {perfil.nome} <span className="text-xs">(perfil fictício)</span></p>}
        {paginas.map(pagina=><NavLink key={pagina.caminho} to={pagina.caminho} end={pagina.caminho==='/'} onClick={()=>setMenuAberto(false)} className={({isActive})=>`py-2 hover:text-sun ${isActive?'text-sun':''}`}>{pagina.nome}</NavLink>)}
        <NavLink to="/faq" onClick={()=>setMenuAberto(false)} className={({isActive})=>`py-2 hover:text-sun ${isActive?'text-sun':''}`}>FAQ</NavLink>
        <Link to={perfil?'/painel':'/acesso'} onClick={()=>setMenuAberto(false)} className="py-2 text-sun">{perfil?'Acessar demonstração':'Entrar'}</Link>
      </div>
    </nav>
  </header>
}
