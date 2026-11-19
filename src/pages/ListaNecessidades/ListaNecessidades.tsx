
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CardNecessidade } from '../../components/CardNecessidade/CardNecessidade'
import { Pagina, campo, painel } from '../../components/Interface/Interface'
import { kg, rotulo } from '../../data/calculos'
import { necessidades as necessidadesIlustrativas } from '../../data/necessidades'
import type { Estado } from '../../data/estado'

const categorias = [
  'Todos',
  'Campanhas',
  'Alimentação comunitária',
  'Cestas básicas',
  'Alimentação infantil'
]

const ITENS_POR_PAGINA = 5

export function ListaNecessidades({ necessidades, orgs }: Estado) {
  const [parametros, setParametros] = useSearchParams()
  const busca = parametros.get('busca') || ''

  const [categoria, setCategoria] = useState('Todos')
  const [pagina, setPagina] = useState(0)

  const setBusca = (valor: string) => {
    setPagina(0)
    setParametros(valor ? { busca: valor } : {})
  }

  // Filtra as necessidades ilustrativas
  const resultados = useMemo(() => {
    return necessidadesIlustrativas.filter(necessidade => {
      const combinaCategoria =
        categoria === 'Todos' ||
        necessidade.categoria === categoria

      const texto = `
        ${necessidade.titulo}
        ${necessidade.estabelecimento}
        ${necessidade.localizacao}
        ${necessidade.categoria}
        ${necessidade.itens.map(item => item.nome).join(' ')}
      `.toLocaleLowerCase('pt-BR')

      return (
        combinaCategoria &&
        texto.includes(busca.toLocaleLowerCase('pt-BR'))
      )
    })
  }, [busca, categoria])

  // Paginação
  const quantidadePaginas = Math.ceil(
    resultados.length / ITENS_POR_PAGINA
  )

  const paginaAtual = Math.min(
    pagina,
    Math.max(0, quantidadePaginas - 1)
  )

  const itensDaPagina = resultados.slice(
    paginaAtual * ITENS_POR_PAGINA,
    (paginaAtual + 1) * ITENS_POR_PAGINA
  )

  // Necessidades cadastradas na demonstração
  const necessidadesDaDemonstracao = necessidades.filter(n =>
    orgs.some(o =>
      o.id === n.instituicao && o.ativa
    ) &&
    `
      ${n.titulo}
      ${rotulo(orgs.find(o => o.id === n.instituicao))}
      ${n.itens.map(item => item.nome).join(' ')}
    `
      .toLocaleLowerCase('pt-BR')
      .includes(busca.toLocaleLowerCase('pt-BR'))
  )

  const selecionarCategoria = (nome: string) => {
    setPagina(0)
    setCategoria(nome)
  }

  return (
    <Pagina titulo="Necessidades das instituições">

      <section aria-labelledby="titulo-necessidades">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="titulo-necessidades"
              className="font-display text-xl font-extrabold text-navy"
            >
              Ajude instituições a realizar suas ações sociais
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explore as campanhas e necessidades das instituições.
            </p>
          </div>

          <span className="w-fit rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-bluebrand">
            Dados fictícios
          </span>
        </div>

        {/* Campo de busca */}
        <label className="relative mt-5 block max-w-xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            className={`${campo} !mt-0 pl-10`}
            placeholder="Buscar campanha, alimento ou localização"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            aria-label="Buscar necessidades"
          />
        </label>

        {/* Filtros por categoria */}
        <p className="mt-5 text-xs text-slate-500">
          Filtrar as necessidades por categoria:
        </p>

        <div
          className="mt-2 flex gap-2 overflow-x-auto pb-2"
          aria-label="Categorias de necessidades"
        >
          {categorias.map(nome => (
            <button
              key={nome}
              type="button"
              onClick={() => selecionarCategoria(nome)}
              aria-pressed={categoria === nome}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                categoria === nome
                  ? 'border-bluebrand bg-bluebrand text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-bluebrand hover:text-bluebrand'
              }`}
            >
              {nome}
            </button>
          ))}
        </div>

        {/* Cards ilustrativos */}
        {itensDaPagina.length ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {itensDaPagina.map(necessidade => (
              <CardNecessidade
                key={necessidade.id}
                necessidade={necessidade}
              />
            ))}
          </div>
        ) : (
          <div className={`${painel} mt-5 text-center`}>
            <p className="font-bold text-navy">
              Nenhuma necessidade encontrada
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Tente buscar outra campanha ou selecione outra categoria.
            </p>
          </div>
        )}

        {/* Paginação */}
        {quantidadePaginas > 1 && (
          <nav
            className="mt-6 flex items-center justify-center gap-4"
            aria-label="Paginação das necessidades"
          >
            <button
              type="button"
              onClick={() =>
                setPagina(Math.max(0, paginaAtual - 1))
              }
              disabled={paginaAtual === 0}
              aria-label="Página anterior"
              className="rounded-full border border-slate-200 bg-white p-2.5 text-navy transition hover:border-bluebrand hover:text-bluebrand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </button>

            <span className="text-sm font-semibold text-slate-600">
              Página {paginaAtual + 1} de {quantidadePaginas}
            </span>

            <button
              type="button"
              onClick={() =>
                setPagina(
                  Math.min(quantidadePaginas - 1, paginaAtual + 1)
                )
              }
              disabled={paginaAtual === quantidadePaginas - 1}
              aria-label="Próxima página"
              className="rounded-full border border-slate-200 bg-white p-2.5 text-navy transition hover:border-bluebrand hover:text-bluebrand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        )}

        <p className="mt-4 text-center text-xs text-slate-500">
          Estas necessidades são exemplos visuais e não representam
          solicitações reais de instituições.
        </p>

      </section>

      {/* Necessidades cadastradas na demonstração */}
      {necessidadesDaDemonstracao.length > 0 && (
        <section className="mt-12 border-t border-slate-200 pt-8">

          <h2 className="font-display text-xl font-extrabold text-navy">
            Necessidades criadas nesta demonstração
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Essas necessidades são temporárias e desaparecem
            ao atualizar a página.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {necessidadesDaDemonstracao.map(n => (
              <article key={n.id} className={painel}>

                <h3 className="text-lg font-bold text-navy">
                  {n.titulo}
                </h3>

                <p className="my-2 text-sm text-slate-500">
                  {rotulo(
                    orgs.find(o => o.id === n.instituicao)
                  )}
                </p>

                <p className="text-sm">
                  {n.itens
                    .map(item =>
                      `${item.nome}: ${kg(item.quantidade)}`
                    )
                    .join(' · ')}
                </p>

                <Link
                  className="mt-4 inline-block font-bold text-bluebrand"
                  to={`/necessidades/${n.id}`}
                >
                  Ver detalhes →
                </Link>

              </article>
            ))}
          </div>

        </section>
      )}

    </Pagina>
  )
}
