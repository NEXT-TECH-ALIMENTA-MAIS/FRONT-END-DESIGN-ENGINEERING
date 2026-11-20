import { Link, useParams } from 'react-router-dom'
import { Pagina, painel } from '../../components/Interface/Interface'
import { kg } from '../../data/calculos'
import type { Estado } from '../../data/estado'
import { DetalheNecessidadeExemplo } from '../DetalheNecessidadeExemplo/DetalheNecessidadeExemplo'
import { necessidades as necessidadesIniciais } from '../../data/necessidades'

export function DetalheNecessidade({ necessidades, orgs }: Estado) {
  const { id } = useParams()

  const n = necessidades.find(
    x =>
      x.id === Number(id) &&
      orgs.some(o => o.id === x.instituicao && o.ativa)
  )

  // Caso não encontre uma necessidade cadastrada,
  // procura nos dados ilustrativos.
  if (
    !n &&
    necessidadesIniciais.some(item => item.id === Number(id))
  ) {
    return <DetalheNecessidadeExemplo />
  }

  if (!n) {
    return (
      <Pagina titulo="Necessidade não encontrada">
        <Link
          to="/necessidades"
          className="font-bold text-bluebrand hover:underline"
        >
          Voltar às necessidades
        </Link>
      </Pagina>
    )
  }

  const org = orgs.find(o => o.id === n.instituicao)

  return (
    <Pagina titulo={n.titulo}>
      <div className="grid gap-5 md:grid-cols-2">

        {/* Informações da necessidade */}
        <section className={painel}>
          <h2 className="text-xl font-bold text-navy">
            Sobre a necessidade
          </h2>

          <p className="mt-4 text-sm text-slate-600">
            {n.descricao}
          </p>

          <h3 className="mt-6 text-lg font-bold text-navy">
            Alimentos necessários
          </h3>

          {n.itens.map((item, index) => (
            <div
              key={index}
              className="mt-4 border-b border-slate-100 pb-4"
            >
              <strong>
                {item.nome} · {kg(item.quantidade)} necessários
              </strong>
            </div>
          ))}

          <p className="mt-5 text-sm text-slate-600">
            Campanha: {n.campanha || 'Não vinculada'}
          </p>

          <p className="mt-4 text-sm text-slate-600">
            {org?.nome}
          </p>

          <p className="text-sm text-slate-500">
            {org?.email} · {org?.telefone}
          </p>
        </section>

        {/* Orientações */}
        <section className={painel}>
          <h2 className="text-xl font-bold text-navy">
            Como ajudar
          </h2>

          <p className="mt-4 text-sm text-slate-600">
            Esta instituição está buscando alimentos para
            atender suas necessidades e realizar suas ações sociais.
          </p>

          <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm">
            <strong>Orientações para colaboração</strong>

            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                Consulte a lista de alimentos solicitados.
              </li>

              <li>
                Verifique quais produtos você pode disponibilizar.
              </li>

              <li>
                Entre em contato com a instituição utilizando
                as informações apresentadas.
              </li>

              <li>
                Combine a entrega dos alimentos diretamente
                com a instituição.
              </li>
            </ol>

            <p className="mt-4 text-slate-500">
              As informações apresentadas fazem parte de
              uma demonstração acadêmica.
            </p>
          </div>

          <Link
            to="/necessidades"
            className="mt-6 inline-block font-bold text-bluebrand hover:underline"
          >
            ← Voltar às necessidades
          </Link>
        </section>

      </div>
    </Pagina>
  )
}
