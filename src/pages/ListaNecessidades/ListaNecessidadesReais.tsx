
import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, PackageCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { listaNecessidadesReais } from '../../services/necessidadesApi'
import type { Necessidade } from '../../data/modelos'

type Props = {
  busca?: string
}

const apiHabilitada =
  import.meta.env.VITE_API_HABILITADA === 'true'

export function ListaNecessidadesReais({ busca = '' }: Props) {
  const [necessidades, setNecessidades] = useState<Necessidade[]>([])
  const [carregando, setCarregando] = useState(apiHabilitada)
  const [erro, setErro] = useState<string | null>(null)


  const carregarNecessidades = useCallback(async () => {
    if (!apiHabilitada) return

    setCarregando(true)
    setErro(null)

    try {
      const dados = await listaNecessidadesReais()

      if (!Array.isArray(dados)) {
        throw new Error('Formato de resposta inválido.')
      }

      setNecessidades(dados)
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar as necessidades.'
      )
    } finally {
      setCarregando(false)
    }
  }, [])


  useEffect(() => {
    if (!apiHabilitada) return

    let ativo = true

    async function carregarInicial() {
      try {
        const dados = await listaNecessidadesReais()

        if (!Array.isArray(dados)) {
          throw new Error('Formato de resposta inválido.')
        }

        if (ativo) {
          setNecessidades(dados)
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar as necessidades.'
          )
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarInicial()

    return () => {
      ativo = false
    }
  }, [])


  const buscaNormalizada = busca.toLocaleLowerCase('pt-BR')

  const necessidadesFiltradas = necessidades.filter(n => {
    const texto = [
      n.titulo,
      n.descricao,
      n.campanha,
      ...n.itens.map(item => item.nome)
    ]
      .join(' ')
      .toLocaleLowerCase('pt-BR')

    return texto.includes(buscaNormalizada)
  })


  return (
    <section
      className="mt-10 border-t border-slate-200 pt-8"
      aria-labelledby="titulo-necessidades-reais"
    >

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="titulo-necessidades-reais"
            className="font-display text-xl font-extrabold text-navy"
          >
            Necessidades cadastradas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Necessidades registradas pelas instituições na plataforma.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void carregarNecessidades()}
          disabled={carregando || !apiHabilitada}
          className="inline-flex items-center gap-2 rounded-lg
            border border-slate-200 bg-white px-4 py-2
            text-sm font-bold text-bluebrand
            hover:border-bluebrand
            disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={carregando ? 'animate-spin' : ''}
          />
          Atualizar
        </button>
      </div>

      {!apiHabilitada && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <p className="font-bold text-navy">
            Integração temporariamente desabilitada
          </p>

          <p className="mt-1 text-sm text-slate-500">
            A conexão com a API Java está desabilitada.
            Os exemplos ilustrativos continuam disponíveis abaixo.
          </p>
        </div>
      )}

      {apiHabilitada && carregando && (
        <p
          role="status"
          className="mt-6 text-sm text-slate-500"
        >
          Carregando necessidades...
        </p>
      )}

      {apiHabilitada && erro && !carregando && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200
            bg-red-50 p-4 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      {apiHabilitada &&
        !carregando &&
        !erro &&
        necessidadesFiltradas.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <p className="font-bold text-navy">
              Nenhuma necessidade encontrada.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Ainda não existem registros para esta pesquisa.
            </p>
          </div>
        )}

      {apiHabilitada &&
        !carregando &&
        !erro &&
        necessidadesFiltradas.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            {necessidadesFiltradas.map(necessidade => (
              <article
                key={necessidade.id}
                className="flex flex-col overflow-hidden rounded-2xl
                  border border-slate-200 bg-white p-5
                  transition duration-200
                  hover:-translate-y-1 hover:shadow-xl"
              >

                <span className="text-xs font-bold text-bluebrand">
                  NECESSIDADE CADASTRADA
                </span>

                <h3 className="mt-3 font-display text-base font-extrabold text-navy">
                  {necessidade.titulo}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {necessidade.descricao}
                </p>

                {necessidade.campanha && (
                  <p className="mt-3 text-xs font-semibold text-bluebrand">
                    {necessidade.campanha}
                  </p>
                )}

                <div className="my-4 h-px bg-slate-100" />

                <div className="space-y-2">
                  {necessidade.itens.map((item, index) => (
                    <p
                      key={`${item.nome}-${index}`}
                      className="flex items-center gap-2 text-xs text-slate-600"
                    >
                      <PackageCheck
                        size={15}
                        className="shrink-0 text-bluebrand"
                      />

                      {item.nome}: {item.quantidade} kg
                    </p>
                  ))}
                </div>

                <div className="mt-auto pt-5">
                  <Link
                    to={`/necessidades/reais/${necessidade.id}`}
                    className="inline-flex items-center gap-2
                      text-sm font-bold text-bluebrand
                      transition hover:underline"
                  >
                    Ver detalhes
                    <ArrowRight size={16} />
                  </Link>
                </div>

              </article>
            ))}

          </div>
        )}

    </section>
  )
}
