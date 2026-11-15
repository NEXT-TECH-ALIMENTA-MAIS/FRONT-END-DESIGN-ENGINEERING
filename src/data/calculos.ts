import type { Oferta, Organizacao, Pedido } from './modelos'

export const novoId = () => Date.now()
export const kg = (valor: number) => `${valor.toLocaleString('pt-BR')} kg`
export const rotulo = (org?: Organizacao) => org?.nome || 'Organização não encontrada'
export const recebido = (pedido: Pedido, indice: number) => pedido.retiradas.reduce((total, r) => total + (r.conciliado ? r.conciliado[indice] : r.recebido && r.entregue[indice] === r.recebido[indice] ? r.recebido[indice] : 0), 0)
export const saldo = (oferta: Oferta, pedidos: Pedido[], indice: number) => Math.max(0, oferta.itens[indice].quantidade - pedidos.filter(p => p.oferta === oferta.id).reduce((total, p) => total + recebido(p, indice), 0))
