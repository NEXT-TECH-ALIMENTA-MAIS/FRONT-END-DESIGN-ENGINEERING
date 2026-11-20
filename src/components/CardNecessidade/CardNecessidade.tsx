
import { ArrowUpRight, CalendarDays, MapPin, PackageCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Necessidade } from '../../data/necessidades'

export function CardNecessidade({ necessidade }: { necessidade: Necessidade }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/8">
      <div className="relative h-43 overflow-hidden bg-blue-50 sm:h-45">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={necessidade.imagem}
          alt={necessidade.titulo}
        />
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-[.12em] text-navy">
          {necessidade.destaque}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-bluebrand">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          SOLICITANDO DOAÇÕES
        </div>

        <h3 className="min-h-13 font-display text-base font-extrabold leading-snug text-navy">
          {necessidade.titulo}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {necessidade.estabelecimento}
        </p>

        <div className="my-4 h-px bg-slate-100" />

        <div className="space-y-2 text-xs text-slate-500">
          <p className="flex items-center gap-2">
            <MapPin size={15} className="text-bluebrand" />
            {necessidade.localizacao}
          </p>

          <p className="flex items-center gap-2">
            <PackageCheck size={15} className="text-bluebrand" />
            {necessidade.quantidade}
          </p>

          <p className="flex items-center gap-2">
            <CalendarDays size={15} className="text-bluebrand" />
            {necessidade.data}
          </p>
        </div>

        <Link
          to={`/necessidades/${necessidade.id}`}
          className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-bluebrand hover:underline"
        >
          Ver detalhes
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
