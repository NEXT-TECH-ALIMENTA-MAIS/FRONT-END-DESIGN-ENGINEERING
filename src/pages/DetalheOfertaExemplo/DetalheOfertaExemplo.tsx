import { ArrowLeft, Building2, MapPin, Package, Phone } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Pagina, painel } from '../../components/Interface/Interface'
import { ofertas } from '../../data/ofertas'

export function DetalheOfertaExemplo() {
  const { id } = useParams()
  const oferta = ofertas.find(item => item.id === Number(id))

  if (!oferta) return <Pagina titulo="Oferta não encontrada"><Link className="text-bluebrand underline" to="/ofertas">Voltar às ofertas</Link></Pagina>

  return <Pagina titulo={oferta.titulo}>
    <Link to="/ofertas" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-bluebrand"><ArrowLeft size={16}/> Voltar às ofertas</Link>
    <div className="mb-6 rounded-xl bg-blue-50 p-4 text-sm text-navy">Dados fictícios para apresentação. Esta oferta ainda não está disponível para contato ou retirada.</div>
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-5">
        <img src={oferta.imagem} alt={oferta.titulo} className="h-56 w-full rounded-2xl object-cover sm:h-72" />
        <section className={painel}>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy"><Package size={22} className="text-bluebrand"/> Alimentos</h2>
          <p className="mt-4 font-bold text-navy">{oferta.titulo}</p>
          <p className="mt-2 text-sm text-slate-600">Quantidade informada: {oferta.quantidade}</p>
          <p className="mt-2 text-sm text-slate-600">Categoria: {oferta.categoria}</p>
          <p className="mt-2 text-sm text-slate-600">Lote, validade e conservação: não informados neste exemplo.</p>
          <p className="mt-2 text-sm text-slate-500">Previsão de retirada: {oferta.validade}</p>
        </section>
      </div>
      <div className="space-y-5">
        <section className={painel}>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy"><Building2 size={22} className="text-bluebrand"/> Estabelecimento</h2>
          <p className="mt-4 font-bold text-navy">{oferta.estabelecimento}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><MapPin size={16}/>{oferta.localizacao}</p>
        </section>
        <section className={painel}>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy"><Phone size={22} className="text-bluebrand"/> Contato</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">O contato não foi informado para este exemplo. Em uma oferta da demonstração, os dados aparecem após o estabelecimento publicá-la.</p>
          <p className="mt-3 text-sm text-bluebrand">As partes conversam fora da plataforma e devem atualizar o andamento no site.</p>
          <button type="button" disabled className="mt-5 rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500" title="Contato indisponível para dados fictícios">Iniciar contato</button><p className="mt-2 text-xs text-slate-500">Disponível quando houver dados reais de contato.</p>
        </section>
      </div>
    </div>
  </Pagina>
}
