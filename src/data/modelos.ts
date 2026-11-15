// Tipos que descrevem os dados usados na demonstração.
export type Papel = 'ESTABELECIMENTO' | 'INSTITUICAO' | 'ADMIN'
export type StatusPedido = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CONCLUIDA_PARCIAL'
export type Organizacao = { id: number; nome: string; email: string; telefone: string; cnpj: string; papel: Papel; aprovada: boolean; ativa: boolean; motivoInativacao?: string; adminInativacao?: string; dataInativacao?: string }
export type Item = { nome: string; quantidade: number; lote: string; validade: string; conservacao: string }
export type Oferta = { id: number; titulo: string; local: string; dono: number; status: 'DISPONIVEL' | 'EM_ANDAMENTO' | 'FINALIZADO'; itens: Item[] }
export type Necessidade = { id: number; titulo: string; descricao: string; instituicao: number; itens: { nome: string; quantidade: number }[]; campanha: string; status: 'DISPONIVEL' }
export type Retirada = { id: number; entregue: number[]; recebido?: number[]; justificativa: string; resolucao?: string; conciliado?: number[] }
export type Pedido = { id: number; oferta: number; instituicao: number; quantidades: number[]; status: StatusPedido; retiradas: Retirada[]; justificativa?: string }
