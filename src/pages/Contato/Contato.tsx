import { useState, type FormEvent } from 'react'
import {
    Send
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


            </main >
        </MainLayout >
    )
}