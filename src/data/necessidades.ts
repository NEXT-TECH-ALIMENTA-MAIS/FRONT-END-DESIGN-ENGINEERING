
export type ItemNecessidade = {
  nome: string
  quantidade: number
  unidade: string
}

export type Necessidade = {
  id: number
  titulo: string
  estabelecimento: string
  localizacao: string
  quantidade: string
  data: string
  categoria: string
  imagem: string
  destaque: string
  itens: ItemNecessidade[]
}

// Dados fictícios para apresentar a interface.
// A API será integrada em outra etapa.

export const necessidades: Necessidade[] = [
  {
    id: 1,
    titulo: 'Campanha de Natal Solidário',
    estabelecimento: 'Instituto Esperança',
    localizacao: 'Pinheiros, São Paulo',
    quantidade: '150 kg de alimentos',
    data: '20/12/2026',
    categoria: 'Campanhas',
    imagem: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    destaque: 'NATAL SOLIDÁRIO',
    itens: [
      { nome: 'Arroz', quantidade: 50, unidade: 'kg' },
      { nome: 'Feijão', quantidade: 40, unidade: 'kg' },
      { nome: 'Macarrão', quantidade: 30, unidade: 'kg' },
      { nome: 'Açúcar', quantidade: 30, unidade: 'kg' }
    ]
  },
  {
    id: 2,
    titulo: 'Café da Manhã Comunitário',
    estabelecimento: 'Associação Mãos Unidas',
    localizacao: 'Vila Mariana, São Paulo',
    quantidade: '80 kg de alimentos',
    data: '15/01/2027',
    categoria: 'Alimentação comunitária',
    imagem: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    destaque: 'CAFÉ SOLIDÁRIO',
    itens: [
      { nome: 'Pães', quantidade: 30, unidade: 'kg' },
      { nome: 'Frutas', quantidade: 20, unidade: 'kg' },
      { nome: 'Leite', quantidade: 30, unidade: 'L' }
    ]
  },
  {
    id: 3,
    titulo: 'Distribuição de Cestas Básicas',
    estabelecimento: 'Projeto Alimentar',
    localizacao: 'Mooca, São Paulo',
    quantidade: '300 kg de alimentos',
    data: '10/02/2027',
    categoria: 'Cestas básicas',
    imagem: 'https://media.istockphoto.com/id/75406566/pt/foto/food-in-a-shopping-basket.jpg?s=2048x2048&w=is&k=20&c=lQN2XMRi75cj19u7k6Ci9ytF2t7UIy7XKLXEpdrsww4=',
    destaque: 'CESTAS BÁSICAS',
    itens: [
      { nome: 'Arroz', quantidade: 100, unidade: 'kg' },
      { nome: 'Feijão', quantidade: 80, unidade: 'kg' },
      { nome: 'Macarrão', quantidade: 60, unidade: 'kg' },
      { nome: 'Farinha', quantidade: 60, unidade: 'kg' }
    ]
  },
  {
    id: 4,
    titulo: 'Almoço Solidário',
    estabelecimento: 'ONG Semeando Amor',
    localizacao: 'Centro, São Paulo',
    quantidade: '120 kg de alimentos',
    data: '25/01/2027',
    categoria: 'Alimentação comunitária',
    imagem: 'https://plus.unsplash.com/premium_photo-1677518438690-29a107f5c3bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    destaque: 'ALMOÇO SOLIDÁRIO',
    itens: [
      { nome: 'Arroz', quantidade: 40, unidade: 'kg' },
      { nome: 'Feijão', quantidade: 30, unidade: 'kg' },
      { nome: 'Legumes', quantidade: 30, unidade: 'kg' },
      { nome: 'Verduras', quantidade: 20, unidade: 'kg' }
    ]
  },
  {
    id: 5,
    titulo: 'Campanha de Alimentação Infantil',
    estabelecimento: 'Instituto Criança Feliz',
    localizacao: 'Tatuapé, São Paulo',
    quantidade: '100 kg de alimentos',
    data: '05/02/2027',
    categoria: 'Alimentação infantil',
    imagem: 'https://images.unsplash.com/photo-1761092315416-ed229b18e3d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    destaque: 'INFÂNCIA SOLIDÁRIA',
    itens: [
      { nome: 'Frutas', quantidade: 40, unidade: 'kg' },
      { nome: 'Aveia', quantidade: 20, unidade: 'kg' },
      { nome: 'Leite em pó', quantidade: 20, unidade: 'kg' },
      { nome: 'Cereais', quantidade: 20, unidade: 'kg' }
    ]
  }
]
