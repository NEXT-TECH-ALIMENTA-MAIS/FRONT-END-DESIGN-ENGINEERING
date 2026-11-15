export type Oferta = {
  id: number
  titulo: string
  estabelecimento: string
  localizacao: string
  quantidade: string
  validade: string
  categoria: string
  imagem: string
  destaque: string
}

// Dados fictícios para apresentar a interface. A API será integrada em outra etapa.
export const ofertas: Oferta[] = [
  { id: 1, titulo: 'Frutas da estação', estabelecimento: 'Hortifruti Boa Terra', localizacao: 'Pinheiros, São Paulo', quantidade: '25 kg disponíveis', validade: 'Retirada em breve', categoria: 'Frutas', imagem: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80', destaque: 'FRUTAS FRESCAS' },
  { id: 2, titulo: 'Pães e produtos de padaria', estabelecimento: 'Padaria Pão da Vila', localizacao: 'Vila Mariana, São Paulo', quantidade: '15 kg disponíveis', validade: 'Retirada em breve', categoria: 'Padaria', imagem: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', destaque: 'FEITOS HOJE' },
  { id: 3, titulo: 'Legumes e verduras', estabelecimento: 'Mercado Bom Vizinho', localizacao: 'Mooca, São Paulo', quantidade: '30 kg disponíveis', validade: 'Retirada em breve', categoria: 'Hortaliças', imagem: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', destaque: 'HORTALIÇAS' },
  { id: 4, titulo: 'Alimentos não perecíveis', estabelecimento: 'Empório da Comunidade', localizacao: 'Centro, São Paulo', quantidade: '40 kg disponíveis', validade: 'Retirada agendada', categoria: 'Não perecíveis', imagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', destaque: 'DESPENSA' },
]
