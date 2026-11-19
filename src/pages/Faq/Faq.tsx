import { useState } from 'react'
import { ChevronDown, CircleHelp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'

const categorias = [
  { nome: 'Sobre o Alimenta+', perguntas: [
    { pergunta: 'O que é o Alimenta+?', resposta: 'O Alimenta+ é uma plataforma em desenvolvimento que aproxima estabelecimentos com alimentos para doar de instituições que precisam recebê-los.' },
    { pergunta: 'Quem pode participar?', resposta: 'Estabelecimentos, como mercados e restaurantes, podem oferecer alimentos. Instituições, como ONGs, podem solicitar ofertas e publicar suas necessidades.' },
    { pergunta: 'Existe pagamento pelas doações?', resposta: 'Não. O Alimenta+ foi pensado para a doação de alimentos e não realiza compras, pagamentos ou transferências de dinheiro.' },
  ] },
  { nome: 'Cadastro e acesso', perguntas: [
    { pergunta: 'Como uma organização pode participar?', resposta: 'A organização escolhe se é estabelecimento ou instituição e preenche seu cadastro. A proposta prevê análise por um administrador antes de liberar as publicações.' },
    { pergunta: 'O que acontece após o cadastro?', resposta: 'O cadastro fica pendente de aprovação. Na versão atual, esse processo pode ser experimentado apenas com dados fictícios na demonstração.' },
    { pergunta: 'Posso inativar minha própria organização?', resposta: 'A inativação é feita pela administração, com justificativa, desde que não exista uma doação em andamento vinculada à organização. O histórico é preservado.' },
  ] },
  { nome: 'Ofertas e necessidades', perguntas: [
    { pergunta: 'Como funciona uma oferta?', resposta: 'O estabelecimento informa os alimentos disponíveis para doação. Cada item pode ter quantidade em kg, lote, validade e informações de conservação.' },
    { pergunta: 'Uma instituição pode publicar o que precisa?', resposta: 'Sim. A instituição pode publicar uma necessidade com os alimentos e quantidades desejados e, quando aplicável, vinculá-la a uma campanha.' },
    { pergunta: 'Posso solicitar uma oferta que está em andamento?', resposta: 'A proposta permite novas solicitações enquanto a oferta está em atendimento. Elas ficam pendentes até que o estabelecimento possa iniciar outro atendimento.' },
  ] },
  { nome: 'Retiradas e confirmações', perguntas: [
    { pergunta: 'Como as partes combinam a retirada?', resposta: 'As partes conversam fora da plataforma usando os dados de contato informados e combinam os detalhes. Elas devem manter o andamento atualizado no site.' },
    { pergunta: 'Uma doação pode ter mais de uma retirada?', resposta: 'Sim. Uma solicitação pode ser atendida em várias viagens. Enquanto faltar uma retirada combinada, o atendimento permanece em andamento.' },
    { pergunta: 'Como o recebimento é confirmado?', resposta: 'Em cada retirada, o estabelecimento informa os kg entregues e a instituição informa os kg recebidos para cada alimento. A confirmação depende da concordância dos valores.' },
    { pergunta: 'O que acontece se as quantidades forem diferentes?', resposta: 'A divergência deve ter uma justificativa e ser encaminhada à administração para análise. O valor divergente não é contabilizado como recebido até a resolução.' },
  ] },
]

export function Faq() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(0)
  const [perguntaAberta, setPerguntaAberta] = useState<number | null>(null)
  const categoria = categorias[categoriaSelecionada]

  function selecionarCategoria(indice: number) {
    setCategoriaSelecionada(indice)
    setPerguntaAberta(null)
  }

  return <MainLayout><main>
    <section className="bg-[#e8f0fd] px-4 py-12 text-center sm:py-16">
      <div className="mx-auto max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-bluebrand"><CircleHelp size={16}/> CENTRAL DE AJUDA</span><h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Perguntas frequentes</h1><p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Encontre respostas sobre o Alimenta+ e entenda cada etapa da doação.</p></div>
    </section>
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3" aria-label="Categorias de perguntas">
        {categorias.map((item, indice)=><button key={item.nome} type="button" onClick={()=>selecionarCategoria(indice)} aria-pressed={categoriaSelecionada===indice} className={`rounded-lg border px-4 py-3 text-xs font-bold transition sm:text-sm ${categoriaSelecionada===indice?'border-bluebrand bg-bluebrand text-white':'border-slate-200 bg-white text-navy hover:border-bluebrand'}`}>{item.nome}</button>)}
      </div>
      <div className="mx-auto mt-12 max-w-3xl"><h2 className="mb-5 text-center font-display text-xl font-extrabold text-navy sm:text-2xl">{categoria.nome}</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {categoria.perguntas.map((item,indice)=>{const aberta=perguntaAberta===indice;return <div key={item.pergunta} className="border-b border-slate-200 last:border-b-0"><h3><button type="button" aria-expanded={aberta} aria-controls={`resposta-${indice}`} onClick={()=>setPerguntaAberta(aberta?null:indice)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-sm font-bold text-navy hover:bg-blue-50 sm:px-6 sm:text-base"><span>{item.pergunta}</span><ChevronDown size={19} className={`shrink-0 text-bluebrand transition-transform ${aberta?'rotate-180':''}`}/></button></h3><div id={`resposta-${indice}`} hidden={!aberta} className="px-5 pb-5 text-sm leading-7 text-slate-600 sm:px-6">{item.resposta}</div></div>})}
        </div>
        <div className="mt-8 rounded-2xl bg-[#e8f0fd] px-5 py-6 text-center"><h2 className="font-display text-lg font-extrabold text-navy">Quer conhecer as ofertas?</h2><p className="mt-2 text-sm text-slate-600">Veja como os alimentos podem se conectar a quem precisa.</p><Link to="/ofertas" className="mt-4 inline-block font-bold text-bluebrand underline">Explorar ofertas</Link></div>
      </div>
    </section>
  </main></MainLayout>
}
