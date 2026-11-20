import { createContext } from 'react'
import type { Organizacao } from '../data/modelos'

// Compartilha apenas o perfil fictício selecionado durante esta demonstração.
type PerfilContexto = {
  organizacao: Organizacao | undefined
  sair: () => void
}

export const PerfilContext = createContext<PerfilContexto>({
  organizacao: undefined,
  sair: () => {},
})
