
import { UserRound } from 'lucide-react'

type CardIntegranteProps = {
  nome: string
  rm: string
  funcao: string
  descricao: string
}

export function CardIntegrante({
  nome,
  rm,
  funcao,
  descricao,
}: CardIntegranteProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#e8f0fd]">
        <UserRound
          size={42}
          className="text-bluebrand"
        />
      </div>

      <h3 className="font-display text-xl font-extrabold text-navy">
        {nome}
      </h3>

      <p className="mt-1 text-sm font-semibold text-bluebrand">
        RM: {rm}
      </p>

      <span className="mt-4 inline-block rounded-full bg-[#e8f0fd] px-4 py-2 text-xs font-bold text-bluebrand">
        {funcao}
      </span>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {descricao}
      </p>
    </article>
  )
}
