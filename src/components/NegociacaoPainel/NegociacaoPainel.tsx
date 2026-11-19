import { useState } from 'react'
import type { DadosPainel, Negociacao } from '../../data/painelCliente'
import { confirmado, type AcaoNegociacao } from '../../services/painelCliente'
import { kg } from '../../data/calculos'
import { botao, campo, Etiqueta, painel } from '../Interface/Interface'

type Props = {
  pedido: Negociacao
  dados: DadosPainel
  organizacaoId: number
  atualizar: (id: number, acao: AcaoNegociacao, motivo: string, valores?: number[], retiradaId?: number) => boolean
}

export function NegociacaoPainel({ pedido, dados, organizacaoId, atualizar }: Props) {
  const [motivo, setMotivo] = useState('')
  const [valores, setValores] = useState<Record<string, string[]>>({})
  const oferta = dados.ofertas.find(item => item.id === pedido.oferta)
  if (!oferta) return null
  const estabelecimento = oferta.dono === organizacaoId
  const outro = dados.organizacoes.find(item => item.id === (estabelecimento ? pedido.instituicao : oferta.dono))
  const aberto = pedido.status === 'PENDENTE' || pedido.status === 'EM_ANDAMENTO'
  const emAndamento = pedido.status === 'EM_ANDAMENTO'
  const ocupado = dados.negociacoes.some(item => item.oferta === oferta.id && item.id !== pedido.id && item.status === 'EM_ANDAMENTO')
  const ultimo = pedido.historico.at(-1)

  function agir(acao: AcaoNegociacao, chave?: string, retiradaId?: number) {
    const quantidades = chave ? oferta!.itens.map((_, i) => valores[chave]?.[i]?.trim() ? Number(valores[chave][i]) : NaN) : []
    if (atualizar(pedido.id, acao, motivo, quantidades, retiradaId)) { setMotivo(''); setValores({}) }
  }

  function camposQuantidade(chave: string) {
    return <div className="grid gap-3 sm:grid-cols-2">{oferta!.itens.map((item, i) => <label key={item.nome} className="text-sm font-semibold">{item.nome} (kg)
      <input className={campo} type="number" min="0" step="0.01" value={valores[chave]?.[i] ?? ''} onChange={evento => {
        const novos = [...(valores[chave] ?? [])]
        novos[i] = evento.target.value
        setValores({ ...valores, [chave]: novos })
      }}/>
    </label>)}</div>
  }

  return <article className={`${painel} min-w-0`}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Solicitação #{pedido.id}</p><h3 className="mt-2 text-xl font-bold text-navy">{outro?.nome}</h3><p className="mt-1 text-sm text-slate-600">{oferta.titulo}</p></div><Etiqueta status={pedido.status}/></div>
    <ul className="my-5 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">{oferta.itens.map((item, i) => <li key={item.nome}><strong>{item.nome}</strong> · solicitado: {kg(pedido.quantidades[i])} · confirmado: {kg(confirmado(pedido, i))}</li>)}</ul>
    <div className="rounded-xl bg-blue-50 p-4 text-sm leading-relaxed"><p className="font-bold">{ultimo?.autor === outro?.nome ? 'Atualização da outra organização' : 'Última atualização'}</p><p>{ultimo?.mensagem}</p>{ultimo && <time className="mt-1 block text-xs text-slate-500" dateTime={ultimo.data}>{new Date(ultimo.data).toLocaleString('pt-BR')} · {ultimo.autor}</time>}</div>
    <details className="mt-4 rounded-lg border border-slate-200 p-3 text-sm"><summary className="cursor-pointer font-bold text-bluebrand">Contato e orientações</summary><div className="mt-3 space-y-2 break-words"><p>{outro?.responsavel} · {outro?.email} · {outro?.telefone}</p><p>Contatos fictícios; nenhum contato real será iniciado nesta versão.</p><ol className="list-decimal space-y-1 pl-5"><li>Aguarde o aceite do estabelecimento.</li><li>Combine local, horário e transporte fora da plataforma.</li><li>Registre os kg entregues e recebidos após cada retirada.</li><li>Mantenha o atendimento em andamento se houver outra viagem.</li></ol></div></details>
    {pedido.retiradas.map((retirada, i) => <section key={retirada.id} className="mt-4 rounded-xl border border-slate-200 p-4"><h4 className="font-bold">Retirada {i + 1}</h4>{oferta.itens.map((item, j) => <p key={item.nome} className="mt-2 text-sm">{item.nome}: entregue {kg(retirada.entregue[j])} · recebido {retirada.recebido ? kg(retirada.recebido[j]) : 'aguardando confirmação'}</p>)}
      {retirada.recebido && retirada.recebido.some((valor, j) => valor !== retirada.entregue[j]) && <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Divergência pendente de análise administrativa. {retirada.justificativa} O encaminhamento real dependerá da API.</p>}
      {!estabelecimento && emAndamento && !retirada.recebido && <div className="mt-4 space-y-3">{camposQuantidade(String(retirada.id))}<p className="text-xs text-slate-500">Se os kg forem diferentes, preencha a justificativa abaixo.</p><button className={botao} onClick={() => agir('RECEBER', String(retirada.id), retirada.id)}>Confirmar recebimento</button></div>}
    </section>)}
    {aberto && <div className="mt-5 space-y-4">
      <label className="block text-sm font-bold">Justificativa<textarea className={campo} rows={2} maxLength={500} placeholder="Obrigatória para recusa, cancelamento, divergência ou conclusão parcial." value={motivo} onChange={evento => setMotivo(evento.target.value)}/></label>
      {estabelecimento && emAndamento && <div className="space-y-3 rounded-xl bg-slate-50 p-4"><h4 className="font-bold">Registrar nova retirada</h4>{camposQuantidade('entrega')}<button className={botao} onClick={() => agir('ENTREGAR', 'entrega')}>Registrar kg entregues</button></div>}
      <div className="flex flex-wrap gap-3">
        {estabelecimento && pedido.status === 'PENDENTE' && <><button className={botao} disabled={ocupado} onClick={() => agir('INICIAR')}>Iniciar atendimento</button><button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold" onClick={() => agir('RECUSAR')}>Recusar solicitação</button></>}
        {estabelecimento && emAndamento && <><button className={botao} onClick={() => agir('CONCLUIR')}>Concluir atendimento</button><button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold" onClick={() => agir('PARCIAL')}>Concluir parcialmente</button></>}
        {!pedido.retiradas.length && <button className="rounded-lg px-3 py-2 text-sm font-bold text-red-700" onClick={() => agir('CANCELAR')}>Cancelar solicitação</button>}
      </div>
      {ocupado && pedido.status === 'PENDENTE' && <p className="text-sm text-slate-500">Aguardando o encerramento de outro atendimento desta oferta.</p>}
      {!estabelecimento && pedido.status === 'PENDENTE' && <p className="text-sm text-slate-500">Aguardando o estabelecimento iniciar o atendimento. A solicitação não reserva estoque.</p>}
    </div>}
    <details className="mt-5 border-t border-slate-100 pt-4"><summary className="cursor-pointer text-sm font-bold text-bluebrand">Histórico da negociação ({pedido.historico.length})</summary><ol className="mt-4 space-y-4 border-l-2 border-blue-100 pl-4">{pedido.historico.map((registro, i) => <li key={i} className="text-sm"><p className="font-bold">{registro.autor}</p><p className="my-1 text-slate-600">{registro.mensagem}</p><time className="text-xs text-slate-500" dateTime={registro.data}>{new Date(registro.data).toLocaleString('pt-BR')}</time></li>)}</ol></details>
  </article>
}
