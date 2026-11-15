import { requisicao } from './clienteHttp'

// Variáveis VITE_ são incluídas no front-end e podem ser vistas no navegador.
// Use somente a URL pública da API; credenciais do Oracle pertencem ao Java.
const urlBase = import.meta.env.VITE_API_URL ?? ''

export function consultarApi<T>(caminho: string): Promise<T> {
  return requisicao<T>(urlBase, caminho)
}

export function enviarParaApi<T>(caminho: string, dados: unknown): Promise<T> {
  return requisicao<T>(urlBase, caminho, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
}
