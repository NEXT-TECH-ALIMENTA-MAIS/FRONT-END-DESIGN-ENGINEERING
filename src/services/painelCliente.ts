import { dadosPainelIniciais, type DadosPainel, type Negociacao } from '../data/painelCliente'

export const chavePainel = 'alimenta-painel-v1'

// A futura API Java substituirá a leitura e a gravação locais deste serviço.
export function carregarPainel(): DadosPainel {
  const salvo = localStorage.getItem(chavePainel)
  if (!salvo) return structuredClone(dadosPainelIniciais)
  const dados = JSON.parse(salvo) as DadosPainel
  if (dados.versao !== 1 || !Array.isArray(dados.organizacoes) || !Array.isArray(dados.ofertas) || !Array.isArray(dados.necessidades) || !Array.isArray(dados.negociacoes)) {
    throw new Error('Não foi possível ler os dados locais do painel.')
  }
  return dados
}

export function salvarPainel(alterar: (dados: DadosPainel) => DadosPainel): DadosPainel {
  // Lê novamente para considerar alterações feitas na outra aba antes de salvar.
  const novos = alterar(carregarPainel())
  localStorage.setItem(chavePainel, JSON.stringify(novos))
  return novos
}

export function confirmado(pedido: Negociacao, indice: number) {
  return pedido.retiradas.reduce((total, retirada) => total + (retirada.conciliado?.[indice] ?? (retirada.recebido?.[indice] === retirada.entregue[indice] ? retirada.recebido[indice] : 0)), 0)
}

export function saldoPainel(dados: DadosPainel, ofertaId: number, indice: number) {
  const oferta = dados.ofertas.find(item => item.id === ofertaId)
  return (oferta?.itens[indice].quantidade ?? 0) - dados.negociacoes.filter(item => item.oferta === ofertaId).reduce((total, pedido) => total + confirmado(pedido, indice), 0)
}

export type AcaoNegociacao = 'INICIAR' | 'RECUSAR' | 'CANCELAR' | 'ENTREGAR' | 'RECEBER' | 'CONCLUIR' | 'PARCIAL'

export function atualizarNegociacao(dados: DadosPainel, id: number, autorId: number, acao: AcaoNegociacao, motivo = '', valores: number[] = [], retiradaId?: number): DadosPainel {
  const pedido = dados.negociacoes.find(item => item.id === id)
  const oferta = dados.ofertas.find(item => item.id === pedido?.oferta)
  const autor = dados.organizacoes.find(item => item.id === autorId)
  if (!pedido || !oferta || !autor?.ativa || !autor.aprovada || ![oferta.dono, pedido.instituicao].includes(autorId)) throw new Error('Organização sem acesso a esta negociação.')
  const estabelecimento = autorId === oferta.dono
  const atualizado = structuredClone(pedido)
  let mensagem = ''
  if (['CONCLUIDA', 'CONCLUIDA_PARCIAL', 'CANCELADA', 'RECUSADA'].includes(pedido.status)) throw new Error('Esta negociação já foi encerrada.')
  if (['RECUSAR', 'CANCELAR', 'PARCIAL'].includes(acao) && !motivo.trim()) throw new Error('Informe uma justificativa para esta ação.')

  if (acao === 'INICIAR') {
    if (!estabelecimento || pedido.status !== 'PENDENTE') throw new Error('Somente o estabelecimento pode iniciar um pedido pendente.')
    if (dados.negociacoes.some(item => item.oferta === oferta.id && item.status === 'EM_ANDAMENTO')) throw new Error('Já existe um atendimento em andamento nesta oferta. Encerre-o antes de iniciar outro.')
    if (pedido.quantidades.some((valor, i) => valor > saldoPainel(dados, oferta.id, i))) throw new Error('O saldo atual não atende às quantidades solicitadas.')
    atualizado.status = 'EM_ANDAMENTO'
    mensagem = 'Iniciou o atendimento. Combine a retirada fora da plataforma.'
  } else if (acao === 'CANCELAR' || acao === 'RECUSAR') {
    if (acao === 'RECUSAR' && (!estabelecimento || pedido.status !== 'PENDENTE')) throw new Error('Somente pedidos pendentes podem ser recusados pelo estabelecimento.')
    if (pedido.retiradas.length) throw new Error('Há retiradas registradas. Confirme os recebimentos e use a conclusão parcial.')
    atualizado.status = acao === 'CANCELAR' ? 'CANCELADA' : 'RECUSADA'
    atualizado.justificativa = motivo.trim()
    mensagem = `${acao === 'CANCELAR' ? 'Cancelou' : 'Recusou'} a solicitação: ${motivo.trim()}`
  } else {
    if (pedido.status !== 'EM_ANDAMENTO') throw new Error('Inicie o atendimento antes de registrar retiradas ou concluir.')
    if (acao === 'ENTREGAR' || acao === 'RECEBER') {
      if (valores.length !== oferta.itens.length || valores.some(valor => !Number.isFinite(valor) || valor < 0)) throw new Error('Preencha os kg de cada alimento com valores válidos.')
      if (acao === 'ENTREGAR') {
        if (!estabelecimento) throw new Error('Somente o estabelecimento registra entregas.')
        if (!valores.some(valor => valor > 0) || valores.some((valor, i) => valor + pedido.retiradas.reduce((total, retirada) => total + retirada.entregue[i], 0) > pedido.quantidades[i])) throw new Error('Informe uma entrega positiva, sem ultrapassar o combinado.')
        const idRetirada = Math.max(Date.now(), ...pedido.retiradas.map(item => item.id + 1))
        atualizado.retiradas.push({ id: idRetirada, entregue: valores, justificativa: '' })
        mensagem = `Registrou entrega: ${oferta.itens.map((item, i) => `${item.nome}: ${valores[i]} kg`).join(', ')}. Aguardando a instituição.`
      } else {
        const retirada = atualizado.retiradas.find(item => item.id === retiradaId)
        if (estabelecimento || !retirada || retirada.recebido) throw new Error('Esta retirada não está disponível para confirmação.')
        const divergencia = valores.some((valor, i) => valor !== retirada.entregue[i])
        if (divergencia && !motivo.trim()) throw new Error('As quantidades divergem. Explique o motivo para análise administrativa.')
        retirada.recebido = valores
        retirada.justificativa = divergencia ? motivo.trim() : ''
        mensagem = divergencia ? `Informou divergência, pendente de análise administrativa: ${motivo.trim()}` : 'Confirmou o recebimento. As quantidades coincidem com a entrega.'
      }
    } else {
      if (!estabelecimento) throw new Error('Somente o estabelecimento encerra o atendimento.')
      if (!pedido.retiradas.length || pedido.retiradas.some(retirada => !retirada.recebido || (!retirada.conciliado && retirada.recebido.some((valor, i) => valor !== retirada.entregue[i])))) throw new Error('Confirme as retiradas e resolva as divergências antes de concluir.')
      const completo = pedido.quantidades.every((valor, i) => confirmado(pedido, i) >= valor)
      if (acao === 'CONCLUIR' && !completo) throw new Error('Ainda faltam alimentos. Mantenha em andamento para outra retirada ou conclua parcialmente.')
      if (acao === 'PARCIAL' && completo) throw new Error('Todos os alimentos foram recebidos. Use Concluir atendimento.')
      atualizado.status = acao === 'PARCIAL' ? 'CONCLUIDA_PARCIAL' : 'CONCLUIDA'
      atualizado.justificativa = motivo.trim()
      mensagem = acao === 'PARCIAL' ? `Concluiu parcialmente: ${motivo.trim()}` : 'Concluiu o atendimento.'
    }
  }
  atualizado.historico.push({ autor: autor.nome, data: new Date().toISOString(), mensagem })
  const novos = { ...dados, negociacoes: dados.negociacoes.map(item => item.id === id ? atualizado : item) }
  return { ...novos, ofertas: novos.ofertas.map(item => item.id === oferta.id ? { ...item, status: novos.negociacoes.some(p => p.oferta === item.id && p.status === 'EM_ANDAMENTO') ? 'EM_ANDAMENTO' : item.itens.some((_, i) => saldoPainel(novos, item.id, i) > 0) ? 'DISPONIVEL' : 'FINALIZADO' } : item) }
}
