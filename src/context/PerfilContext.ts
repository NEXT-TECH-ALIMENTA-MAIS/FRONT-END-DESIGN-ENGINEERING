import { createContext } from 'react'
import type { Organizacao } from '../data/modelos'

// Compartilha apenas o perfil fictício selecionado durante esta demonstração.
export const PerfilContext = createContext<Organizacao | undefined>(undefined)
