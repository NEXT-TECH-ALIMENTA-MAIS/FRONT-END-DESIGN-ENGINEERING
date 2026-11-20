import { ArrowRight, HeartHandshake, LogOut, Menu, Search, UserRound, X } from 'lucide-react'
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
  { nome: 'Integrantes', caminho: '/Integrantes' },
  { nome: 'FAQ', caminho: '/faq' },
  { nome: 'Contato', caminho: '/Contato' },
]

export function Cabecalho() {
  const { organizacao: perfil, sair } = useContext(PerfilContext)
  const [menuAberto, setMenuAberto] = useState(false)
  const [resumoAberto, setResumoAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const navegar = useNavigate()

  function encerrarAcesso() {
    sair()
    setResumoAberto(false)
    setMenuAberto(false)
    navegar('/acesso')
  }

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
      <div className="relative ml-auto shrink-0">
        {perfil ? <>
          <button type="button" onClick={() => setResumoAberto(!resumoAberto)} aria-expanded={resumoAberto} aria-controls="resumo-organizacao" className="flex items-center gap-2 rounded-xl px-2 py-2 text-left hover:bg-white/10 sm:px-3">
            <UserRound size={23} className="shrink-0" aria-hidden="true"/>
            <span className="max-w-40 sm:max-w-56"><span className="block truncate text-xs text-blue-100">Olá, {perfil.nome}</span><strong className="block text-sm sm:text-base">Minha organização</strong><span className="block text-xs text-blue-200">{perfil.papel === 'ESTABELECIMENTO' ? 'Estabelecimento' : perfil.papel === 'INSTITUICAO' ? 'Instituição' : 'Administrador'}</span></span>
          </button>
          {resumoAberto && <section id="resumo-organizacao" className="absolute right-0 top-full z-50 mt-2 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-xl" aria-label="Resumo da organização">
            <p className="text-xs font-bold uppercase tracking-wider text-bluebrand">Área da organização</p>
            <h2 className="mt-1 truncate font-display text-lg font-extrabold text-navy">{perfil.nome}</h2>
            <div className="mt-4 rounded-xl bg-blue-50 p-3"><p className="text-xs text-slate-500">Tipo de conta</p><p className="mt-1 text-sm font-bold text-navy">{perfil.papel === 'ESTABELECIMENTO' ? 'Estabelecimento doador' : perfil.papel === 'INSTITUICAO' ? 'Instituição receptora' : 'Administrador'}</p></div>
            <p className="mt-4 text-sm leading-5 text-slate-600">Acompanhe suas publicações, solicitações e retiradas no painel da organização.</p>
            <Link to="/painel" onClick={() => setResumoAberto(false)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-bluebrand px-4 py-3 text-sm font-bold text-white hover:bg-navy">Abrir painel <ArrowRight size={17}/></Link>
            <button type="button" onClick={encerrarAcesso} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"><LogOut size={17}/> Sair da conta</button>
          </section>}
        </> : <Link to="/acesso" className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-white/10 sm:px-3" aria-label="Entrar"><UserRound size={22}/><strong>Entrar</strong></Link>}
      </div>
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

        {institucionais.map(pagina =>
          pagina.caminho !== '/#' ? (
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
          ) : (
            <span key={pagina.nome} aria-disabled="true" className="py-2 text-blue-200/75">{pagina.nome}<span className="text-xs"> (em breve)</span></span>
          )
        )}

        <Link
          to={perfil ? '/painel' : '/acesso'}
          onClick={() => setMenuAberto(false)}
          className="py-2 text-sun"
        >
          {perfil ? 'Acessar demonstração' : 'Entrar'}
        </Link>
        {perfil && <button type="button" onClick={encerrarAcesso} className="py-2 text-left text-blue-100">Sair da conta</button>}
      </div>
    </nav>
  </header>
}
