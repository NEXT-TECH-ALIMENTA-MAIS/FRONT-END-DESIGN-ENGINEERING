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

  try {
    return await consultarApi<Necessidade>(
      `/necessidades/${id}`
    )
  } catch (error) {
    throw error
  }
}
