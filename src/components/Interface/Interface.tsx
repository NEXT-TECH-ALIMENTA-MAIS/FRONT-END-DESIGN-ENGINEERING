import type { ReactNode } from 'react'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'

export const botao = 'inline-flex items-center justify-center rounded-lg bg-bluebrand px-4 py-2.5 text-sm font-bold text-white hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50'
export const campo = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800'
export const painel = 'rounded-2xl border border-slate-200 bg-white p-5 sm:p-6'
export function Pagina({ titulo, children }: { titulo: string; children: ReactNode }) {
  return <MainLayout><div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-950">Demonstração com dados fictícios. Alterações ficam apenas nesta sessão e não são enviadas à API.</div><main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10"><h1 className="mb-7 font-display text-3xl font-extrabold text-navy">{titulo}</h1>{children}</main></MainLayout>
}
export function Mensagem({ texto }: { texto: string }) { return texto ? <p role="status" className="mb-5 rounded-lg bg-blue-50 p-4 text-sm text-navy">{texto}</p> : null }
export function Etiqueta({ status }: { status: string }) { return <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-bluebrand">{status.replaceAll('_', ' ')}</span> }
