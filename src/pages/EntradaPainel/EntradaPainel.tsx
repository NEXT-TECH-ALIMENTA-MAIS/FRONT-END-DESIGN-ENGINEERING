import { Link } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { painel, botao } from '../../components/Interface/Interface'
import { apiConfigurada } from '../../services/api'
import { PainelApi } from '../PainelApi/PainelApi'

export function EntradaPainel() {
  if (apiConfigurada) return <PainelApi/>
  return <MainLayout><main className="mx-auto max-w-6xl px-4 py-10">
    <h1 className="font-display text-3xl font-extrabold text-navy">Painel da organização</h1>
    <p className="my-5 text-slate-600">Acompanhe suas publicações, solicitações e retiradas.</p>
    <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">A API ainda não foi configurada. Os acessos abaixo abrem a prévia com dados fictícios salvos neste navegador; não fazem login.</p>
    <div className="grid gap-5 sm:grid-cols-2">
      <section className={painel}><h2 className="text-xl font-bold">Estabelecimento</h2><p className="my-4 text-sm">Veja suas ofertas e acompanhe os pedidos das instituições.</p><Link className={botao} to="/painel/estabelecimento">Abrir painel do estabelecimento</Link></section>
      <section className={painel}><h2 className="text-xl font-bold">Instituição</h2><p className="my-4 text-sm">Consulte suas necessidades e confirme os recebimentos.</p><Link className={botao} to="/painel/instituicao">Abrir painel da instituição</Link></section>
    </div>
  </main></MainLayout>
}
