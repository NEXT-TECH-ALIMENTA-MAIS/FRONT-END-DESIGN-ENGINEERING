import { consultarApi } from './api'
import type { Necessidade } from '../data/modelos'

const usarMock =
  import.meta.env.VITE_API_MOCK === 'true'

export async function listaNecessidadesReais(): Promise<Necessidade[]> {
  if (usarMock) {
    const resposta = await fetch('/mock/necessidades.json')

    if (!resposta.ok) {
      throw new Error('Erro ao carregar necessidades simuladas.')
    }

    return resposta.json() as Promise<Necessidade[]>
  }

  return consultarApi<Necessidade[]>('/necessidades')
}

export async function buscarNecessidadeRealPorId(
  id: number
): Promise<Necessidade | null> {
  if (usarMock) {
    const necessidades = await listaNecessidadesReais()

    return necessidades.find(n => n.id === id) ?? null
  }

  return consultarApi<Necessidade>(
    `/necessidades/${id}`
  )
}

type Instituicao = {
  id: number
  nome: string
}

export async function buscarNomeInstituicao(
  id: number
): Promise<string> {
  if (usarMock) {
    const instituicoes: Instituicao[] = [
      { id: 1, nome: 'Nossa Comunidade' },
      { id: 2, nome: 'Criando Falcões' },
      { id: 3, nome: 'Comunidade Solidariedade' },
      { id: 4, nome: 'Ong da Comunidade' }
    ]

    return instituicoes.find(i => i.id === id)?.nome
      ?? 'Instituição não identificada'
  }

  const instituicao = await consultarApi<Instituicao>(
    `/instituicoes/${id}`
  )

  return instituicao.nome
}
