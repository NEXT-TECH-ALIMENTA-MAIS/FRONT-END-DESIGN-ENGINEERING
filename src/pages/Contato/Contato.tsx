
import { useState, type FormEvent } from 'react'
import {
    ArrowRight,
    HeartHandshake,
    Mail,
    MessageCircle,
    Send,
    ShieldCheck
} from 'lucide-react'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'

export function Contato() {
    const [enviado, setEnviado] = useState(false)

    function enviarMensagem(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()

        const formulario = evento.currentTarget
        const dados = new FormData(formulario)

        const nome = String(dados.get('nome') ?? '').trim()
        const email = String(dados.get('email') ?? '').trim()
        const assunto = String(dados.get('assunto') ?? '').trim()
        const mensagem = String(dados.get('mensagem') ?? '').trim()

        if (!nome || !email || !assunto || !mensagem) {
            setEnviado(false)
            return
        }

        // Simulação de envio: nenhum dado é enviado à API.
        formulario.reset()
        setEnviado(true)
    }

    const estiloCampo =
        'mt-2 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-bluebrand focus:ring-2 focus:ring-bluebrand/20'

    return (
        <MainLayout>
            <main>
                {/* Apresentação da página */}
                <section className="bg-[#e8f0ff] px-4 py-14 sm:px-6 md:py-20 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-bluebrand">
                            <MessageCircle size={15} />
                            Fale com a gente
                        </div>

                        <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl">
                            Sua mensagem pode fazer
                            <span className="block text-bluebrand">
                                a diferença.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            Tem alguma dúvida, sugestão ou gostaria de saber
                            mais sobre o Alimenta+? Este é um espaço para
                            conversar sobre nosso projeto.
                        </p>
                    </div>
                </section>

                {/* Informações e formulário */}
                <section className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">

                        {/* Coluna de informações */}
                        <div className="min-w-0">
                            <span className="text-xs font-bold uppercase tracking-widest text-bluebrand">
                                Estamos aqui para ouvir
                            </span>

                            <h2 className="mt-3 font-display text-3xl font-extrabold text-navy">
                                Vamos conversar?
                            </h2>

                            <p className="mt-4 max-w-lg leading-7 text-slate-600">
                                O Alimenta+ nasceu com o propósito de conectar
                                estabelecimentos que possuem alimentos disponíveis
                                a instituições que podem transformá-los em refeições
                                para quem precisa.
                            </p>

                            <div className="mt-8 space-y-4">

                                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-bluebrand">
                                        <Mail size={23} />
                                    </div>

                                    <div>
                                        <h3 className="font-display font-bold text-navy">
                                            Dúvidas e sugestões
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            Utilize o formulário para demonstrar como
                                            seria o contato com nossa equipe.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-bluebrand">
                                        <HeartHandshake size={23} />
                                    </div>

                                    <div>
                                        <h3 className="font-display font-bold text-navy">
                                            Faça parte dessa ideia
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            Conheça nossa proposta de combate ao
                                            desperdício de alimentos e incentivo à
                                            solidariedade.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-bluebrand">
                                        <ShieldCheck size={23} />
                                    </div>

                                    <div>
                                        <h3 className="font-display font-bold text-navy">
                                            Projeto acadêmico
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            Plataforma demonstrativa desenvolvida
                                            para a Global Solution da FIAP.
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-8 rounded-2xl bg-[#e8f0ff] p-6">
                                <p className="font-display font-bold text-navy">
                                    Mais alimento, mais cuidado.
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Acreditamos que pequenas atitudes podem
                                    gerar grandes transformações.
                                </p>

                                <a
                                    href="/sobre"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-bluebrand hover:underline"
                                >
                                    Conheça o Alimenta+
                                    <ArrowRight size={17} />
                                </a>
                            </div>
                        </div>

                        {/* Coluna do formulário */}
                        <div className="min-w-0">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

                                <div className="mb-7">
                                    <h2 className="font-display text-2xl font-extrabold text-navy">
                                        Envie sua mensagem
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Preencha os campos abaixo para experimentar
                                        nosso formulário de contato.
                                    </p>
                                </div>

                                <form
                                    onSubmit={enviarMensagem}
                                    onChange={() => setEnviado(false)}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label
                                            htmlFor="contato-nome"
                                            className="text-sm font-bold text-navy"
                                        >
                                            Nome completo *
                                        </label>

                                        <input
                                            id="contato-nome"
                                            name="nome"
                                            type="text"
                                            required
                                            minLength={2}
                                            maxLength={100}
                                            autoComplete="name"
                                            placeholder="Digite seu nome completo"
                                            className={estiloCampo}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contato-email"
                                            className="text-sm font-bold text-navy"
                                        >
                                            E-mail *
                                        </label>

                                        <input
                                            id="contato-email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            placeholder="exemplo@email.com"
                                            className={estiloCampo}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contato-assunto"
                                            className="text-sm font-bold text-navy"
                                        >
                                            Assunto *
                                        </label>

                                        <select
                                            id="contato-assunto"
                                            name="assunto"
                                            required
                                            defaultValue=""
                                            className={estiloCampo}
                                        >
                                            <option value="" disabled>
                                                Selecione um assunto
                                            </option>
                                            <option value="duvida">
                                                Dúvida sobre a plataforma
                                            </option>
                                            <option value="doacao">
                                                Doação de alimentos
                                            </option>
                                            <option value="instituicao">
                                                Instituições participantes
                                            </option>
                                            <option value="sugestao">
                                                Sugestões e melhorias
                                            </option>
                                            <option value="outro">
                                                Outro assunto
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contato-mensagem"
                                            className="text-sm font-bold text-navy"
                                        >
                                            Mensagem *
                                        </label>

                                        <textarea
                                            id="contato-mensagem"
                                            name="mensagem"
                                            required
                                            minLength={10}
                                            maxLength={1000}
                                            rows={5}
                                            placeholder="Escreva sua mensagem aqui..."
                                            className={`${estiloCampo} resize-y`}
                                        />
                                    </div>

                                    <p className="text-xs leading-5 text-slate-500">
                                        * Campos obrigatórios.
                                    </p>

                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-bluebrand px-5 py-3.5 font-bold text-white transition hover:bg-navy"
                                    >
                                        <Send size={18} />
                                        Enviar mensagem
                                    </button>

                                    {enviado && (
                                        <div
                                            role="status"
                                            aria-live="polite"
                                            className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
                                        >
                                            Formulário preenchido com sucesso!
                                            Esta é uma demonstração, portanto sua
                                            mensagem não foi enviada nem armazenada.
                                        </div>
                                    )}

                                    <p className="text-center text-xs leading-5 text-slate-500">
                                        Formulário demonstrativo. Nenhuma mensagem
                                        será enviada ou armazenada.
                                    </p>
                                </form>

                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </MainLayout>
    )
}
