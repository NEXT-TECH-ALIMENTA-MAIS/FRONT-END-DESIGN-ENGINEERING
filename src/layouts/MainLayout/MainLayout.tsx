import type { ReactNode } from 'react'
import { Cabecalho } from '../../components/Cabecalho/Cabecalho'
import { Rodape } from '../../components/Rodape/Rodape'

export function MainLayout({ children }: { children: ReactNode }) {
  return <div id="topo" className="flex min-h-screen flex-col"><Cabecalho/><div className="flex-1">{children}</div><Rodape/></div>
}
