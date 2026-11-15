import { Link } from 'react-router-dom'
import { Pagina, painel } from '../../components/Interface/Interface'
import type { Estado } from '../../data/estado'

export function Acesso({orgs, setPerfil}: Estado) {
  return <Pagina titulo="Acessar demonstração"><div className={painel}><p className="mb-5 text-slate-600">Escolha um perfil fictício para testar o fluxo. Esta tela não faz autenticação real.</p><div className="grid gap-3 sm:grid-cols-2">{orgs.filter(o=>o.ativa).map(o=><Link key={o.id} to="/painel" onClick={()=>setPerfil(o.id)} className="rounded-xl border border-slate-200 p-4 hover:border-bluebrand"><strong>{o.nome}</strong><p className="mt-1 text-sm text-slate-500">{o.papel.replace('_',' ')} · {o.aprovada?'Aprovada':'Aguardando aprovação'}</p></Link>)}</div><p className="mt-6 text-sm">Ainda não tem cadastro? <Link className="font-bold text-bluebrand underline" to="/cadastro">Cadastrar organização</Link></p></div></Pagina>
}
