import type { Necessidade, Oferta, Organizacao, Pedido } from './modelos'

export type Estado = {
  orgs: Organizacao[]; setOrgs: React.Dispatch<React.SetStateAction<Organizacao[]>>
  ofertas: Oferta[]; setOfertas: React.Dispatch<React.SetStateAction<Oferta[]>>
  pedidos: Pedido[]; setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>
  necessidades: Necessidade[]; setNecessidades: React.Dispatch<React.SetStateAction<Necessidade[]>>
  atual: Organizacao | undefined; setPerfil: (id: number) => void
}
