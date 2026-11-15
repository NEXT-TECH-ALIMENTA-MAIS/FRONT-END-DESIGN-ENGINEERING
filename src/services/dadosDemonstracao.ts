import type { Necessidade, Oferta, Organizacao, Pedido } from '../data/modelos'

// Dados locais: serão substituídos por funções que usam fetch quando existir a API Java.
export const organizacoesIniciais: Organizacao[] = [
  { id: 1, nome: 'Mercado Boa Mesa', email: 'mercado@exemplo.com', telefone: '(11) 99999-0001', cnpj: '12345678000190', papel: 'ESTABELECIMENTO', aprovada: true, ativa: true },
  { id: 2, nome: 'Instituição Mãos Unidas', email: 'instituicao@exemplo.com', telefone: '(11) 99999-0002', cnpj: '98765432000110', papel: 'INSTITUICAO', aprovada: true, ativa: true },
  { id: 3, nome: 'Administração Alimenta+', email: 'admin@exemplo.com', telefone: '', cnpj: '', papel: 'ADMIN', aprovada: true, ativa: true },
]
export const ofertasIniciais: Oferta[] = []
export const pedidosIniciais: Pedido[] = []
export const necessidadesIniciais: Necessidade[] = []
