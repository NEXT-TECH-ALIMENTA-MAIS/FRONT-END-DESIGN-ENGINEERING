
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  PackageCheck,
  ClipboardList,
  Megaphone,
  Building2,
  RefreshCw
} from 'lucide-react'

import { Pagina, painel } from '../../components/Interface/Interface'
import { buscarNecessidadeRealPorId } from '../../services/necessidadesApi'
import type { Necessidade } from '../../data/modelos'
import { kg } from '../../data/calculos'

const apiHabilitada =
  import.meta.env.VITE_API_HABILITADA === 'true'

export function DetalheNecessidadeReal() {
  const { id } = useParams<{ id: string }>()

  const [necessidade, setNecessidade] =
    useState<Necessidade | null>(null)

  const [carregando, setCarregando] = useState(apiHabilitada)
  const [erro, setErro] = useState<string | null>(null)

  const idNumerico = Number(id)


  useEffect(() => {
    if (!apiHabilitada || !id || !Number.isSafeInteger(idNumerico) ||
        idNumerico <= 0) {
      return
    }

    let ativo = true

    async function carregarDetalhes() {
      try {
        const dados = await buscarNecessidadeRealPorId(idNumerico)

        if (ativo) {
          setNecessidade(dados)
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar a necessidade.'
          )
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarDetalhes()

    return () => {
      ativo = false
    }
  }, [id, idNumerico])


  if (!apiHabilitada) {
    return (
      <Pagina titulo="Detalhes da necessidade">
        <div className={painel}>
          <h2 className="text-xl font-bold text-navy">
            Integração desabilitada
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            A conexão com a API Java está temporariamente
            desabilitada.
          </p>

          <Link
            to="/necessidades"
            className="mt-5 inline-flex items-center gap-2 font-bold text-bluebrand"
          >
            <ArrowLeft size={18} />
            Voltar às necessidades
          </Link>
        </div>
      </Pagina>
    )
  }


  if (!id || !Number.isSafeInteger(idNumerico) || idNumerico <= 0) {
    return (
      <Pagina titulo="Necessidade inválida">
        <p className="text-slate-600">
          O identificador informado não é válido.
        </p>

        <Link
          to="/necessidades"
          className="mt-5 inline-block font-bold text-bluebrand"
        >
          Voltar às necessidades
        </Link>
      </Pagina>
    )
  }


  if (carregando) {
    return (
      <Pagina titulo="Detalhes da necessidade">
        <div
          role="status"
          className={`${painel} flex items-center gap-3`}
        >
          <RefreshCw
            size={20}
            className="animate-spin text-bluebrand"
          />

          <p className="text-sm text-slate-600">
            Carregando informações da necessidade...
          </p>
        </div>
      </Pagina>
    )
  }


  if (erro) {
    return (
      <Pagina titulo="Erro ao carregar necessidade">
        <div role="alert" className={painel}>
          <h2 className="text-xl font-bold text-navy">
            Não foi possível carregar os detalhes
          </h2>

          <p className="mt-3 text-sm text-red-600">
            {erro}
          </p>

          <Link
            to="/necessidades"
            className="mt-5 inline-flex items-center gap-2 font-bold text-bluebrand"
          >
            <ArrowLeft size={18} />
            Voltar às necessidades
          </Link>
        </div>
      </Pagina>
    )
  }


  if (!necessidade) {
    return (
      <Pagina titulo="Necessidade não encontrada">
        <div className={painel}>
          <p className="text-sm text-slate-600">
            A necessidade solicitada não foi encontrada.
          </p>

          <Link
            to="/necessidades"
            className="mt-5 inline-flex items-center gap-2 font-bold text-bluebrand"
          >
            <ArrowLeft size={18} />
            Voltar às necessidades
          </Link>
        </div>
      </Pagina>
    )
  }


  return (
    <Pagina titulo={necessidade.titulo}>

      <Link
        to="/necessidades"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-bluebrand hover:underline"
      >
        <ArrowLeft size={18} />
        Voltar às necessidades
      </Link>

      <section className="mb-6 rounded-2xl bg-[#d1e0fa] px-6 py-8 sm:px-10">

        <span className="inline-block rounded-full bg-white px-3 py-1.5 text-xs font-bold text-bluebrand">
          NECESSIDADE CADASTRADA
        </span>

        <h1 className="mt-4 font-display text-3xl font-extrabold text-[#3050AD] sm:text-4xl">
          {necessidade.titulo}
        </h1>

        <p className="mt-4 max-w-3xl text-justify text-base leading-7 text-[#192D63]">
          {necessidade.descricao}
        </p>

      </section>

      <div className="grid gap-5 md:grid-cols-2">

        <section className={painel}>

          <div className="flex items-center gap-3">
            <ClipboardList
              size={22}
              className="text-bluebrand"
            />

            <h2 className="text-xl font-bold text-navy">
              Alimentos necessários
            </h2>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Relação dos alimentos solicitados pela instituição.
          </p>

          <div className="mt-5 space-y-3">
            {necessidade.itens.length > 0 ? (
              necessidade.itens.map((item, index) => (
                <div
                  key={`${item.nome}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <PackageCheck
                      size={20}
                      className="shrink-0 text-bluebrand"
                    />

                    <span className="text-sm font-semibold text-navy">
                      {item.nome}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-bold text-bluebrand">
                    {kg(item.quantidade)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Nenhum alimento informado.
              </p>
            )}
          </div>

        </section>

        <section className={painel}>

          <h2 className="text-xl font-bold text-navy">
            Informações da necessidade
          </h2>

          <div className="mt-6 flex items-start gap-3">
            <Megaphone
              size={20}
              className="shrink-0 text-bluebrand"
            />

            <div>
              <h3 className="text-sm font-bold text-navy">
                Campanha
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                {necessidade.campanha || 'Não vinculada'}
              </p>
            </div>
          </div>

          <div className="my-5 border-t border-slate-100" />

          <div className="flex items-start gap-3">
            <Building2
              size={20}
              className="shrink-0 text-bluebrand"
            />

            <div>
              <h3 className="text-sm font-bold text-navy">
                Instituição responsável
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Código da instituição: {necessidade.instituicao}
              </p>
            </div>
          </div>

          <div className="my-5 border-t border-slate-100" />

          <div>
            <h3 className="text-sm font-bold text-navy">
              Situação da necessidade
            </h3>

            <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
              {necessidade.status === 'DISPONIVEL'
                ? 'Disponível'
                : necessidade.status}
            </span>
          </div>

          <div className="my-5 border-t border-slate-100" />

          <div>
            <h3 className="text-sm font-bold text-navy">
              Identificação do registro
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Necessidade #{necessidade.id}
            </p>
          </div>

        </section>

      </div>

      <div className="mt-8 flex justify-start">
        <Link
          to="/necessidades"
          className="inline-flex items-center gap-2 rounded-xl bg-bluebrand px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          <ArrowLeft size={18} />
          Voltar à lista de necessidades
        </Link>
      </div>

    </Pagina>
  )
}
