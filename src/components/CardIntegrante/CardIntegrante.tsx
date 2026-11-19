
import { useState } from 'react'
import { UserRound } from 'lucide-react'

type CardIntegranteProps = {
  nome: string
  rm: string
  funcao: string
  descricao: string
  foto?: string
}

export function CardIntegrante({
  nome,
  rm,
  funcao,
  descricao,
  foto,
}: CardIntegranteProps) {
  const [erroFoto, setErroFoto] = useState(false)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#e8f0fd] bg-[#e8f0fd]">
        {foto && !erroFoto ? (
          <img
            src={foto}
            alt={`Foto de ${nome}`}
            className="h-full w-full object-cover"
            onError={() => setErroFoto(true)}
          />
        ) : (
          <UserRound
            size={42}
            className="text-bluebrand"
          />
        )}
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
