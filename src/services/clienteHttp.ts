// Cliente genérico para a futura API. Os caminhos e tipos serão definidos
// com o grupo Java, quando o contrato da API estiver disponível.
export async function requisicao<T>(
  urlBase: string,
  caminho: string,
  opcoes: RequestInit = {},
): Promise<T> {
  if (!urlBase.trim()) {
    throw new Error('A URL da API ainda não foi configurada.')
  }

  const url = `${urlBase.replace(/\/+$/, '')}/${caminho.replace(/^\/+/, '')}`
  let resposta: Response

  try {
    resposta = await fetch(url, opcoes)
  } catch {
    throw new Error('Não foi possível acessar a API. Verifique a conexão e tente novamente.')
  }

  if (!resposta.ok) {
    throw new Error(`A API retornou um erro (${resposta.status}).`)
  }

  // O servidor pode confirmar uma operação sem devolver conteúdo (HTTP 204).
  if (resposta.status === 204) return undefined as T

  try {
    return await resposta.json() as T
  } catch {
    throw new Error('A API retornou uma resposta que não pôde ser lida.')
  }
}
