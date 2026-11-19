
import { MainLayout } from '../../layouts/MainLayout/MainLayout'

export function Integrantes() {
  return (
    <MainLayout>
      <main>
        <section className="bg-[#e8f0fd] px-4 py-12 text-center sm:py-16">
          <div className="mx-auto max-w-5xl">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Nossa equipe
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Conheça os integrantes responsáveis pelo desenvolvimento
              do projeto Alimenta+.
            </p>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
