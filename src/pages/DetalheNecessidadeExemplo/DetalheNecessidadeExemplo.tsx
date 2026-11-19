
import { CalendarDays, MapPin, PackageCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Pagina, painel } from '../../components/Interface/Interface'
import { necessidades } from '../../data/necessidades'

export function DetalheNecessidadeExemplo() {
  const { id } = useParams()

  const necessidade = necessidades.find(
    item => item.id === Number(id)
  )

  if (!necessidade) {
    return (
      <Pagina titulo="Necessidade não encontrada">
        <Link
          to="/necessidades"
          className="font-bold text-bluebrand"
        >
          Voltar às necessidades
        </Link>
      </Pagina>
    )
  }

  return (
    <Pagina titulo={necessidade.titulo}>

      <div className="grid gap-5 md:grid-cols-2">

        {/* Informações da campanha */}
        <section className={painel}>

          <div className="relative overflow-hidden rounded-xl">
            <img
              src={necessidade.imagem}
              alt={necessidade.titulo}
              className="h-64 w-full object-cover"
            />

            <span className="absolute left-3 top-3 rounded-md bg-white/95 px-3 py-1 text-xs font-bold text-navy">
              {necessidade.destaque}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs font-bold text-bluebrand">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            SOLICITANDO DOAÇÕES
          </div>

          <h2 className="mt-4 text-xl font-bold text-navy">
            {necessidade.titulo}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {necessidade.estabelecimento}
          </p>

          <div className="my-5 h-px bg-slate-100" />

          <div className="space-y-3 text-sm text-slate-600">

            <p className="flex items-center gap-2">
              <MapPin size={18} className="text-bluebrand" />
              {necessidade.localizacao}
            </p>

            <p className="flex items-center gap-2">
              <PackageCheck size={18} className="text-bluebrand" />
              {necessidade.quantidade}
            </p>

            <p className="flex items-center gap-2">
              <CalendarDays size={18} className="text-bluebrand" />
              {necessidade.data}
            </p>

          </div>

          <p className="mt-5 text-sm text-slate-600">
            Categoria: {necessidade.categoria}
          </p>

        </section>

        {/* Lista de alimentos */}
        <section className={painel}>

          <h2 className="text-xl font-bold text-navy">
            Alimentos necessários
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Confira os produtos e as quantidades solicitadas
            para esta ação social.
          </p>

          <div className="mt-5">
            {necessidade.itens.map((item, index) => (
              <div
                key={index}
                className="border-b border-slate-100 py-4"
              >
                <div className="flex items-center justify-between gap-4">

                  <strong className="text-sm text-navy">
                    {item.nome}
                  </strong>

                  <span className="text-sm font-bold text-bluebrand">
                    {item.quantidade} {item.unidade}
                  </span>

                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm">
            <strong className="text-navy">
              Como contribuir
            </strong>

            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
              <li>
                Consulte os alimentos solicitados.
              </li>

              <li>
                Verifique quais produtos você pode doar.
              </li>

              <li>
                Procure a instituição responsável para
                combinar a contribuição.
              </li>
            </ol>

            <p className="mt-4 text-xs text-slate-500">
              Esta é uma necessidade fictícia utilizada
              exclusivamente para demonstração da plataforma.
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
