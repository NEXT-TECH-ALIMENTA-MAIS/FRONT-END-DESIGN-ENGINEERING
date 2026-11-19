
import { useState } from 'react'
import { UserRound, ExternalLink } from 'lucide-react'

type CardIntegranteProps = {
  nome: string
  rm: string
  funcao: string
  descricao: string
  foto?: string
  github?: string
  linkedin?: string
}

export function CardIntegrante({
  nome,
  rm,
  funcao,
  descricao,
  foto,
  github,
  linkedin,
}: CardIntegranteProps) {
  const [erroFoto, setErroFoto] = useState(false)

  return (
    <article className="group flex h-full flex-col items-center rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl sm:p-6">

      {/* Foto do integrante */}
      <div className="mb-5 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#e8f0fd] bg-[#e8f0fd] shadow-sm transition-transform duration-300 group-hover:scale-105">
        {foto && !erroFoto ? (
          <img
            src={foto}
            alt={`Foto de ${nome}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setErroFoto(true)}
          />
        ) : (
          <UserRound
            size={46}
            className="text-bluebrand"
          />
        )}
      </div>

      {/* Nome e RM */}
      <h3 className="font-display text-lg font-extrabold leading-snug text-navy sm:text-xl">
        {nome}
      </h3>

      <p className="mt-2 text-sm font-semibold text-bluebrand">
        RM: {rm}
      </p>

      {/* Função no projeto */}
      <span className="mt-4 inline-flex min-h-9 items-center justify-center rounded-full bg-[#e8f0fd] px-4 py-2 text-center text-xs font-bold text-bluebrand">
        {funcao}
      </span>

      {/* Descrição */}
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
        {descricao}
      </p>

      {/* Redes sociais */}
      <div className="mt-6 flex w-full flex-wrap justify-center gap-3 border-t border-slate-100 pt-5">

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub de ${nome}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#172554] px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            GitHub
            <ExternalLink size={15} />
          </a>
        )}

        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn de ${nome}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            LinkedIn
            <ExternalLink size={15} />
          </a>
        )}

      </div>
    </article>
  )
}

