import { requisicao } from './clienteHttp'

const urlBase = import.meta.env.VITE_API_URL ?? ''
const chaveSessao = 'alimenta-admin-sessao'

export type SessaoAdmin = { id: number; nome: string; email: string; token: string }
export type OrganizacaoAdmin = {
  id: number; cnpj: string; tipo: 'ESTABELECIMENTO' | 'INSTITUICAO'
  razaoSocial: string; nomeFantasia: string; emailContato: string
  telefone: string | null; endereco: string; statusCadastro: string; statusConta: string
}
export type ContatoAdmin = {
  id: number; nome: string; email: string; assunto: string
  mensagem: string; status: string; criadoEm: string
}

export function sessaoAdminAtual(): SessaoAdmin | null {
  const salva = sessionStorage.getItem(chaveSessao)
  if (!salva) return null
  try { return JSON.parse(salva) as SessaoAdmin }
  catch { sessionStorage.removeItem(chaveSessao); return null }
}

export async function entrarAdmin(email: string, senha: string) {
  const sessao = await requisicao<SessaoAdmin>(urlBase, '/api/admin/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, senha }),
  })
  sessionStorage.setItem(chaveSessao, JSON.stringify(sessao))
  return sessao
}

export function configurarPrimeiroAdmin(dados: { chaveConfiguracao: string; nome: string; cpf: string; email: string; senha: string }) {
  return requisicao<void>(urlBase, '/api/admin/configurar-primeiro-acesso', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados),
  })
}

export async function sairAdmin(token: string) {
  try { await requisicao<void>(urlBase, '/api/admin/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }) }
  finally { sessionStorage.removeItem(chaveSessao) }
}

function opcoesAdmin(token: string): RequestInit { return { headers: { Authorization: `Bearer ${token}` } } }
export const listarOrganizacoesAdmin = (token: string) => requisicao<OrganizacaoAdmin[]>(urlBase, '/api/admin/organizacoes', opcoesAdmin(token))
export const listarContatosAdmin = (token: string) => requisicao<ContatoAdmin[]>(urlBase, '/api/admin/contatos', opcoesAdmin(token))
export const aprovarOrganizacaoAdmin = (id: number, aprovado: boolean, token: string) =>
  requisicao<OrganizacaoAdmin>(urlBase, `/api/admin/organizacoes/${id}/aprovacao?aprovado=${aprovado}`, { method: 'PATCH', ...opcoesAdmin(token) })

export const enviarContato = (dados: { nome: string; email: string; assunto: string; mensagem: string }) =>
  requisicao<ContatoAdmin>(urlBase, '/api/contatos', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados),
  })
