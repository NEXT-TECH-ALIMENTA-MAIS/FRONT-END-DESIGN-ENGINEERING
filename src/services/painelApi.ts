import { alterarNaApi, consultarApi, enviarParaApi } from './api'

// Campos conferidos nos DTOs Java. Não reutilizamos IDs ou saldos fictícios.
export type OrganizacaoApi = {
  id: number; cnpj: string; tipo: 'ESTABELECIMENTO' | 'INSTITUICAO'
  razaoSocial: string; nomeFantasia: string; emailContato: string
  telefone: string | null; endereco: string; statusCadastro: string; statusConta: string
}
export type PerfilApi = Pick<OrganizacaoApi, 'razaoSocial' | 'nomeFantasia' | 'emailContato' | 'telefone' | 'endereco'>
export type ItemOfertaApi = { id: number; alimentoId: number; alimento: string; quantidadeKg: number; disponivelKg: number; validade: string | null; lote: string | null; conservacao: string | null }
export type OfertaApi = { id: number; organizacaoId: number; titulo: string; descricao: string; status: string; tag: string; itens: ItemOfertaApi[] }
export type NecessidadeApi = { id: number; instituicaoId: number; titulo: string; descricao: string; status: string; itens: { id: number; alimento: string; quantidadeKg: number }[] }
export type SolicitacaoApi = {
  id: number; ofertaId: number; instituicaoId: number; status: string; dataSolicitacao: string; encerramento: string | null; motivoEncerramento: string | null
  itens: { id: number; itemOfertaId: number; solicitadaKg: number; alocadaKg: number; recebidaKg: number }[]
}
export type RetiradaApi = {
  id: number; solicitacaoId: number; data: string; motivoParcial: string | null
  itens: { id: number; itemSolicitacaoId: number; informadaEstabelecimentoKg: number | null; confirmadaInstituicaoKg: number | null; motivoDivergencia: string | null; resolucao: string | null }[]
}
export type DadosApi = { organizacoes: OrganizacaoApi[]; ofertas: OfertaApi[]; necessidades: NecessidadeApi[]; solicitacoes: SolicitacaoApi[] }
export const listarOrganizacoes = () => consultarApi<OrganizacaoApi[]>('/api/organizacoes')
export const listarOfertasApi = () => consultarApi<OfertaApi[]>('/api/ofertas')
export const listarNecessidadesApi = () => consultarApi<NecessidadeApi[]>('/api/necessidades')

export function solicitarOfertaApi(ofertaId: number, instituicaoId: number, itens: { itemOfertaId: number; quantidadeKg: number }[]) {
  exigirAmbienteDeTeste()
  if (!instituicaoId || !itens.length || itens.some(item => !Number.isFinite(item.quantidadeKg) || item.quantidadeKg <= 0)) throw new Error('Selecione a instituição e informe ao menos uma quantidade positiva.')
  return enviarParaApi<SolicitacaoApi>('/api/solicitacoes', { ofertaId, instituicaoId, itens })
}

export async function carregarPainelApi(): Promise<DadosApi> {
  const [organizacoes, ofertas, necessidades, solicitacoes] = await Promise.all([
    listarOrganizacoes(), listarOfertasApi(), listarNecessidadesApi(), consultarApi<SolicitacaoApi[]>('/api/solicitacoes'),
  ])
  return { organizacoes, ofertas, necessidades, solicitacoes }
}

// Sem endpoint de login no Java, escritas identificadas por organização só são
// expostas no ambiente local de desenvolvimento. Isso NÃO substitui autorização no servidor.
function exigirAmbienteDeTeste() {
  if (!import.meta.env.DEV) throw new Error('A API ainda precisa autenticar a organização para liberar estas alterações no site publicado.')
}
export function salvarPerfilApi(id: number, perfil: PerfilApi) {
  exigirAmbienteDeTeste()
  return alterarNaApi<OrganizacaoApi>(`/api/organizacoes/${id}`, perfil, 'PUT')
}
export function iniciarAtendimentoApi(pedido: SolicitacaoApi, pedidos: SolicitacaoApi[]) {
  exigirAmbienteDeTeste()
  if (pedidos.some(item => item.ofertaId === pedido.ofertaId && item.status === 'EM_ANDAMENTO')) throw new Error('Esta oferta já tem um atendimento em andamento.')
  return alterarNaApi<SolicitacaoApi>(`/api/solicitacoes/${pedido.id}/iniciar`, undefined)
}
export function reservarItensApi(pedido: SolicitacaoApi) {
  exigirAmbienteDeTeste()
  return alterarNaApi<SolicitacaoApi>(`/api/solicitacoes/${pedido.id}/reservar`, { itens: pedido.itens.map(item => ({ itemSolicitacaoId: item.id, quantidadeKg: item.solicitadaKg })) })
}
export function encerrarAtendimentoApi(id: number, status: string, motivo: string) {
  exigirAmbienteDeTeste()
  if (status !== 'CONCLUIDA' && !motivo.trim()) throw new Error('Informe a justificativa do encerramento.')
  return alterarNaApi<SolicitacaoApi>(`/api/solicitacoes/${id}/encerrar`, { status, motivo })
}
export const listarRetiradasApi = (id: number) => consultarApi<RetiradaApi[]>(`/api/solicitacoes/${id}/retiradas`)
export function criarRetiradaApi(pedido: SolicitacaoApi, data: string, motivoParcial: string) {
  exigirAmbienteDeTeste()
  const itens = pedido.itens.filter(item => item.alocadaKg > item.recebidaKg).map(item => ({ itemSolicitacaoId: item.id }))
  if (!data || !itens.length) throw new Error('Informe a data e reserve os alimentos pendentes antes de registrar a retirada.')
  return enviarParaApi<RetiradaApi>(`/api/solicitacoes/${pedido.id}/retiradas`, { data, motivoParcial, itens })
}
export function confirmarItemApi(retiradaId: number, itemId: number, estabelecimento: boolean, quantidadeKg: number, motivoDivergencia: string) {
  exigirAmbienteDeTeste()
  if (!Number.isFinite(quantidadeKg) || quantidadeKg < 0) throw new Error('Informe uma quantidade válida.')
  return alterarNaApi(`/api/retiradas/${retiradaId}/itens/${itemId}/confirmar-${estabelecimento ? 'estabelecimento' : 'instituicao'}`, { quantidadeKg, motivoDivergencia })
}
