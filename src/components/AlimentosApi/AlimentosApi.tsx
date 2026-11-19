
import { useEffect, useState, type FormEvent } from 'react'
import { consultarApi, enviarParaApi } from '../../services/api'
import { botao, campo, painel } from '../Interface/Interface'

type Classificacao = 'PERECIVEL' | 'NAO_PERECIVEL'

type Alimento = {
  id: number
  nome: string
  classificacao: Classificacao
}

export function AlimentosApi() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [nome, setNome] = useState('')
  const [classificacao, setClassificacao] =
    useState<Classificacao>('NAO_PERECIVEL')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    let ativo = true

    consultarApi<Alimento[]>('/api/alimentos')
      .then(lista => {
        if (ativo) setAlimentos(lista)
      })
      .catch(error => {
        if (ativo) {
          setErro(error instanceof Error ? error.message : 'Erro na consulta.')
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!nome.trim() || salvando) return

    setSalvando(true)
    setErro('')
    setSucesso('')

    try {
      const criado = await enviarParaApi<Alimento>(
        '/api/alimentos',
        {
          nome: nome.trim(),
          classificacao
        }
      )

      setAlimentos(anterior => [...anterior, criado])
      setNome('')
      setSucesso('Alimento cadastrado no Oracle com sucesso!')
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível cadastrar o alimento.'
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className={`${painel} mt-10`}>
      <h2 className="font-display text-xl font-extrabold text-navy">
        Alimentos cadastrados no sistema
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Dados consultados diretamente da API Java e do Oracle.
        Esta seção é separada das ofertas demonstrativas.
      </p>

      <form onSubmit={cadastrar} className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="nome-alimento" className="text-sm font-bold">
            Nome do alimento
          </label>
          <input
            id="nome-alimento"
            className={campo}
            value={nome}
            maxLength={100}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex.: Arroz branco"
            required
          />
        </div>

        <div>
          <label htmlFor="tipo-alimento" className="text-sm font-bold">
            Classificação
          </label>
          <select
            id="tipo-alimento"
            className={campo}
            value={classificacao}
            onChange={e =>
              setClassificacao(e.target.value as Classificacao)
            }
          >
            <option value="NAO_PERECIVEL">Não perecível</option>
            <option value="PERECIVEL">Perecível</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={salvando}
          className={`${botao} self-end`}
        >
          {salvando ? 'Cadastrando...' : 'Cadastrar alimento'}
        </button>
      </form>

      {erro && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {erro}
        </p>
      )}

      {sucesso && (
        <p role="status" className="mt-4 text-sm text-green-700">
          {sucesso}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {carregando ? (
          <p>Consultando alimentos no Oracle...</p>
        ) : alimentos.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum alimento cadastrado no banco.
          </p>
        ) : (
          alimentos.map(alimento => (
            <div
              key={alimento.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <p className="font-bold text-navy">{alimento.nome}</p>
              <p className="mt-1 text-xs text-slate-500">
                ID: {alimento.id} ·{' '}
                {alimento.classificacao === 'PERECIVEL'
                  ? 'Perecível'
                  : 'Não perecível'}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
