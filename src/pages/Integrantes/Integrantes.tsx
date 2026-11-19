
import { Users, HeartHandshake, Lightbulb, Code2 } from 'lucide-react'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { CardIntegrante } from '../../components/CardIntegrante/CardIntegrante'

const integrantes = [
  {
    nome: 'Allex Oliveira',
    rm: '571648',
    funcao: 'Página de Login',
    descricao:
      'Responsável pelo desenvolvimento da página de login do Alimenta+, criando a interface de acesso à plataforma.',
  },
  {
    nome: 'Igor Gracetti',
    rm: '573708',
    funcao: 'Página de Integrantes',
    descricao:
      'Responsável pelo desenvolvimento da página de integrantes, apresentando os membros da equipe, suas funções e contribuições no projeto.',
  },
  {
    nome: 'Mateus Isaque',
    rm: '571365',
    funcao: 'Página Home',
    descricao:
      'Responsável pelo desenvolvimento da página inicial do Alimenta+, apresentando a plataforma e sua proposta aos usuários.',
  },
  {
    nome: 'Murilo Santos',
    rm: '572704',
    funcao: 'Página de Contato',
    descricao:
      'Responsável pelo desenvolvimento da página de contato, criando um espaço para facilitar a comunicação dos usuários com a plataforma.',
  },
  {
    nome: 'Roberto Yong',
    rm: '572229',
    funcao: 'Páginas Sobre e Necessidades',
    descricao:
      'Responsável pelo desenvolvimento das páginas Sobre e Necessidades, apresentando informações do projeto e as necessidades relacionadas à doação de alimentos.',
  },
]

export function Integrantes() {
  return (
    <MainLayout>
      <main>
        {/* Apresentação da equipe */}
        <section className="bg-[#e8f0fd] px-4 py-12 text-center sm:py-16">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-bluebrand">
              <Users size={16} />
              EQUIPE ALIMENTA+
            </span>

            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Conheça nossa equipe
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Somos cinco estudantes da FIAP que se uniram para
              desenvolver o Alimenta+, uma plataforma que busca
              conectar estabelecimentos com alimentos disponíveis
              para doação a instituições que precisam recebê-los.
            </p>
          </div>
        </section>

        {/* Propósito do projeto */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
              Nosso propósito
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Nosso grupo acredita que a tecnologia pode ajudar
              a reduzir o desperdício de alimentos e facilitar
              o processo de doação para quem mais precisa.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <HeartHandshake
                size={32}
                className="mx-auto mb-4 text-bluebrand"
              />

              <h3 className="font-display text-lg font-bold text-navy">
                Solidariedade
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Queremos aproximar quem pode doar alimentos
                de instituições que precisam de apoio.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <Lightbulb
                size={32}
                className="mx-auto mb-4 text-bluebrand"
              />

              <h3 className="font-display text-lg font-bold text-navy">
                Inovação
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Utilizamos a tecnologia para propor uma
                solução simples e acessível.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <Code2
                size={32}
                className="mx-auto mb-4 text-bluebrand"
              />

              <h3 className="font-display text-lg font-bold text-navy">
                Desenvolvimento
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Aplicamos os conhecimentos adquiridos
                durante nossa formação na FIAP.
              </p>
            </div>
          </div>
        </section>

        {/* Cards dos integrantes */}
        <section className="bg-[#f6f8fc] px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f0fd] px-4 py-2 text-xs font-bold text-bluebrand">
                <Users size={16} />
                NOSSO TIME
              </span>

              <h2 className="mt-4 font-display text-2xl font-extrabold text-navy sm:text-3xl">
                Integrantes do projeto
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Conheça os estudantes responsáveis pelo desenvolvimento
                das diferentes páginas do Alimenta+.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {integrantes.map((integrante) => (
                <CardIntegrante
                  key={integrante.rm}
                  nome={integrante.nome}
                  rm={integrante.rm}
                  funcao={integrante.funcao}
                  descricao={integrante.descricao}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
