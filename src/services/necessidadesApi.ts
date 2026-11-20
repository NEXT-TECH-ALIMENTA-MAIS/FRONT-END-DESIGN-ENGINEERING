import { consultarApi } from './api'
import type { Necessidade } from '../data/modelos'

export function listaNecessidadesReais(): Promise<Necessidade[]> {
  return consultarApi<Necessidade[]>('/necessidades')
}