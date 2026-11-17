import type { ReactNode } from 'react'
import { Rodape } from '../../components/Rodape/Rodape'

// Estrutura comum às páginas, inspirada no projeto usado em aula.
export function MainLayout({ children }: { children: ReactNode }) {
  return <div>{children}<Rodape /></div>
}
