
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
    <article className="flex h-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Foto do integrante */}
      <div className="mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#e8f0fd] bg-[#e8f0fd]">
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

      {/* Nome completo */}
      <h3 className="font-display text-xl font-extrabold text-navy">
        {nome}
      </h3>

      {/* RM */}
      <p className="mt-2 text-sm font-semibold text-bluebrand">
        RM: {rm}
      </p>

      {/* Função no projeto */}
      <span className="mt-4 inline-block rounded-full bg-[#e8f0fd] px-4 py-2 text-xs font-bold text-bluebrand">
        {funcao}
      </span>

      {/* Descrição */}
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
        {descricao}
      </p>

      {/* Links das redes sociais */}
      <div className="mt-6 flex w-full flex-wrap justify-center gap-3">

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub de ${nome}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#172554] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-80"
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
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-80"
          >
            LinkedIn
            <ExternalLink size={15} />
          </a>
        )}

      </div>
    </article>
  )
}
