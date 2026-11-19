import type { Necessidade, Oferta, Organizacao, Pedido } from './modelos'

export type PerfilCliente = Organizacao & { endereco: string; descricao: string; responsavel: string }
export type Registro = { data: string; autor: string; mensagem: string }
export type Negociacao = Omit<Pedido, 'status'> & {
  status: Pedido['status'] | 'CANCELADA' | 'RECUSADA'
  historico: Registro[]
}
export type DadosPainel = {
  versao: 1
  organizacoes: PerfilCliente[]
  ofertas: Oferta[]
  necessidades: Necessidade[]
  negociacoes: Negociacao[]
}

// Cenário separado do catálogo público. Não representa organizações ou contatos reais.
export const dadosPainelIniciais: DadosPainel = {
  versao: 1,
  organizacoes: [
    { id: 1, nome: 'Mercado Boa Mesa', papel: 'ESTABELECIMENTO', cnpj: '12345678000190', email: 'mercado@example.com', telefone: '(11) 0000-0001', endereco: 'Vila Mariana, São Paulo — SP', responsavel: 'Ana', descricao: 'Compartilhamos alimentos para fortalecer nossa comunidade.', ativa: true, aprovada: true },
    { id: 2, nome: 'Instituição Mãos Unidas', papel: 'INSTITUICAO', cnpj: '98765432000110', email: 'instituicao@example.com', telefone: '(11) 0000-0002', endereco: 'Saúde, São Paulo — SP', responsavel: 'Marina', descricao: 'Recebemos alimentos para preparar refeições solidárias.', ativa: true, aprovada: true },
    { id: 4, nome: 'Instituto Mesa Compartilhada', papel: 'INSTITUICAO', cnpj: '11223344000155', email: 'instituto@example.com', telefone: '(11) 0000-0004', endereco: 'Centro, São Paulo — SP', responsavel: 'Paulo', descricao: 'Apoio alimentar à comunidade.', ativa: true, aprovada: true },
  ],
  ofertas: [{ id: 101, dono: 1, titulo: 'Arroz para compartilhar', local: 'Vila Mariana, São Paulo — SP', status: 'DISPONIVEL', itens: [{ nome: 'Arroz', quantidade: 50, lote: 'AR-01', validade: '2027-06-30', conservacao: 'Embalagem fechada, em local seco e fresco.' }] }],
  necessidades: [{ id: 201, instituicao: 2, titulo: 'Alimentos para refeições solidárias', descricao: 'Preparação de refeições para famílias atendidas.', campanha: 'Mesa solidária', status: 'DISPONIVEL', itens: [{ nome: 'Arroz', quantidade: 20 }] }],
  negociacoes: [
    { id: 301, oferta: 101, instituicao: 2, quantidades: [20], status: 'PENDENTE', retiradas: [], historico: [{ data: '2026-11-17T12:00:00Z', autor: 'Instituição Mãos Unidas', mensagem: 'Solicitou 20 kg de arroz. Aguardando atendimento.' }] },
    { id: 302, oferta: 101, instituicao: 4, quantidades: [10], status: 'PENDENTE', retiradas: [], historico: [{ data: '2026-11-17T13:00:00Z', autor: 'Instituto Mesa Compartilhada', mensagem: 'Solicitou 10 kg de arroz. Aguardando atendimento.' }] },
  ],
}
