import { useEffect, useState } from 'react'
import { botao, campo, Etiqueta, painel } from '../Interface/Interface'
import { kg } from '../../data/calculos'
import { confirmarItemApi, criarRetiradaApi, encerrarAtendimentoApi, iniciarAtendimentoApi, listarRetiradasApi, reservarItensApi, type DadosApi, type RetiradaApi, type SolicitacaoApi } from '../../services/painelApi'

type Props = { pedido: SolicitacaoApi; dados: DadosApi; organizacaoId: number; atualizar: () => Promise<void> }
export function NegociacaoApi({ pedido, dados, organizacaoId, atualizar }: Props) {
  const [retiradas, setRetiradas] = useState<RetiradaApi[]>([])
  const [carregando, setCarregando] = useState(true)
  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [motivo, setMotivo] = useState('')
  const [data, setData] = useState('')
  const [quantidades, setQuantidades] = useState<Record<number, string>>({})
  const oferta = dados.ofertas.find(item => item.id === pedido.ofertaId)
  const estabelecimento = oferta?.organizacaoId === organizacaoId
  const outro = dados.organizacoes.find(item => item.id === (estabelecimento ? pedido.instituicaoId : oferta?.organizacaoId))
  const aberto = ['PENDENTE', 'EM_ANDAMENTO'].includes(pedido.status)
  const podeAlterar = import.meta.env.DEV && aberto

  useEffect(() => {
    let ativo = true
    listarRetiradasApi(pedido.id).then(lista => { if (ativo) setRetiradas(lista) })
      .catch(falha => { if (ativo) setErro(falha.message) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [pedido])

  async function executar(acao: () => Promise<unknown>) {
    if (ocupado) return
    setOcupado(true); setErro(''); setMensagem('')
    let gravado = false
    try {
      await acao()
      gravado = true
      setMensagem('Alteração confirmada pela API.')
      setRetiradas(await listarRetiradasApi(pedido.id))
      await atualizar()
      setMotivo('')
    } catch (falha) {
      setErro(`${gravado ? 'A alteração foi salva, mas não foi possível atualizar a consulta. Recarregue antes de repetir. ' : ''}${falha instanceof Error ? falha.message : 'Falha na API.'}`)
    } finally { setOcupado(false) }
  }

  return <article className={painel}>
    <div className="flex flex-wrap justify-between gap-3"><h3 className="text-xl font-bold">{oferta?.titulo ?? `Oferta #${pedido.ofertaId}`}</h3><Etiqueta status={pedido.status}/></div>
    <p className="mt-2 text-sm">Solicitação #{pedido.id} · {outro?.nomeFantasia ?? 'Organização não encontrada'}</p>
    <p className="mt-2 break-words text-sm text-slate-500">Contato: {outro?.emailContato || 'Não informado'} · {outro?.telefone || 'Não informado'}</p>
    <p className="mt-2 text-sm text-bluebrand">Combine a retirada fora da plataforma e mantenha o andamento atualizado aqui.</p>
    {erro && <p role="alert" className="my-3 rounded-lg bg-red-50 p-3 text-red-800">{erro}</p>}
    {mensagem && <p role="status" className="my-3 rounded-lg bg-green-50 p-3 text-green-800">{mensagem}</p>}
    <ul className="my-4 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">{pedido.itens.map(item => <li key={item.id}><strong>{oferta?.itens.find(alimento => alimento.id === item.itemOfertaId)?.alimento ?? `Item #${item.itemOfertaId}`}</strong>: solicitado {kg(item.solicitadaKg)} · reservado {kg(item.alocadaKg)} · recebido {kg(item.recebidaKg)}</li>)}</ul>
    <p className="text-xs text-slate-500">Solicitada em {pedido.dataSolicitacao.replace('T', ' ')}{pedido.encerramento && ` · encerrada em ${pedido.encerramento.replace('T', ' ')}`}</p>
    {pedido.motivoEncerramento && <p className="mt-2 text-sm">Justificativa: {pedido.motivoEncerramento}</p>}
    <p className="mt-2 text-xs text-slate-500">Datas e status vêm da API. Ela ainda não fornece um histórico completo de alterações.</p>
    <fieldset disabled={ocupado || carregando} className="mt-5 space-y-4">
      {podeAlterar && <label className="block text-sm font-bold">Justificativa<textarea className={campo} maxLength={500} value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Obrigatória em divergências, recusa, cancelamento ou conclusão parcial."/></label>}
      {carregando ? <p role="status">Consultando retiradas…</p> : !retiradas.length && <p className="text-sm text-slate-500">Nenhuma retirada registrada.</p>}
      {retiradas.map(retirada => <section key={retirada.id} className="space-y-3 rounded-xl border border-slate-200 p-4"><h4 className="font-bold">Retirada #{retirada.id} · {retirada.data}</h4>{retirada.itens.map(item => {
        const solicitado = pedido.itens.find(s => s.id === item.itemSolicitacaoId)
        const nome = oferta?.itens.find(i => i.id === solicitado?.itemOfertaId)?.alimento ?? `Item #${item.itemSolicitacaoId}`
        const informado = estabelecimento ? item.informadaEstabelecimentoKg : item.confirmadaInstituicaoKg
        const divergente = item.informadaEstabelecimentoKg !== null && item.confirmadaInstituicaoKg !== null && item.informadaEstabelecimentoKg !== item.confirmadaInstituicaoKg
        return <div key={item.id} className="border-t border-slate-100 pt-3"><p className="text-sm"><strong>{nome}</strong> · entregue {item.informadaEstabelecimentoKg === null ? 'aguardando' : kg(item.informadaEstabelecimentoKg)} · recebido {item.confirmadaInstituicaoKg === null ? 'aguardando' : kg(item.confirmadaInstituicaoKg)}</p>
          {divergente && <p className="mt-2 text-sm text-amber-800">{item.resolucao ? `Resolução: ${item.resolucao}` : `Divergência para análise administrativa: ${item.motivoDivergencia ?? ''}`}</p>}
          {podeAlterar && pedido.status === 'EM_ANDAMENTO' && informado === null && <div className="mt-3 flex flex-wrap items-end gap-3"><label className="text-sm">{nome}: kg {estabelecimento ? 'entregues' : 'recebidos'}<input type="number" min="0" step="0.001" className={campo} value={quantidades[item.id] ?? ''} onChange={e => setQuantidades({ ...quantidades, [item.id]: e.target.value })}/></label><button className={botao} onClick={() => executar(() => confirmarItemApi(retirada.id, item.id, estabelecimento, quantidades[item.id]?.trim() ? Number(quantidades[item.id]) : NaN, motivo))}>Confirmar quantidade</button></div>}
        </div>
      })}</section>)}
      {podeAlterar && <div className="flex flex-wrap gap-3">
        {estabelecimento && pedido.status === 'PENDENTE' && <><button className={botao} onClick={() => executar(() => iniciarAtendimentoApi(pedido, dados.solicitacoes))}>Iniciar atendimento</button><button className={botao} onClick={() => executar(() => encerrarAtendimentoApi(pedido.id, 'RECUSADA', motivo))}>Recusar</button></>}
        {estabelecimento && pedido.status === 'EM_ANDAMENTO' && <><button className={botao} onClick={() => executar(() => reservarItensApi(pedido))}>Reservar quantidades solicitadas</button><button className={botao} onClick={() => executar(() => encerrarAtendimentoApi(pedido.id, 'CONCLUIDA', motivo))}>Concluir</button><button className={botao} onClick={() => executar(() => encerrarAtendimentoApi(pedido.id, 'CONCLUIDA_PARCIAL', motivo))}>Concluir parcialmente</button></>}
        {!retiradas.length && <button className="text-sm font-bold text-red-700" onClick={() => executar(() => encerrarAtendimentoApi(pedido.id, 'CANCELADA', motivo))}>Cancelar solicitação</button>}
      </div>}
      {podeAlterar && estabelecimento && pedido.status === 'EM_ANDAMENTO' && <div className="flex flex-wrap items-end gap-3"><label className="text-sm font-bold">Data da retirada<input type="date" className={campo} value={data} onChange={e => setData(e.target.value)}/></label><button className={botao} onClick={() => executar(() => criarRetiradaApi(pedido, data, motivo))}>Criar retirada</button></div>}
    </fieldset>
  </article>
}
