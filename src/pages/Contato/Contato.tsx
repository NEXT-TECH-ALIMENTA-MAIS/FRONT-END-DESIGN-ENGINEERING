import { useState, type FormEvent } from 'react'
import { Mail, MessageCircle, Send } from 'lucide-react'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { apiConfigurada } from '../../services/api'
import { enviarContato } from '../../services/adminApi'

export function Contato() {
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function enviarMensagem(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setEnviado(false)
    setErro('')
    const formulario = evento.currentTarget
    const dados = new FormData(formulario)
    const nome = String(dados.get('nome') ?? '').trim()
    const email = String(dados.get('email') ?? '').trim()
    const assunto = String(dados.get('assunto') ?? '').trim()
    const mensagem = String(dados.get('mensagem') ?? '').trim()
    if (!nome || !email || !assunto || !mensagem) { setErro('Preencha todos os campos antes de enviar.'); return }
    if (!apiConfigurada) { setErro('O serviço de contato está indisponível. Sua mensagem não foi armazenada.'); return }
    setEnviando(true)
    try { await enviarContato({ nome, email, assunto, mensagem }); formulario.reset(); setEnviado(true) }
    catch (falha) { setErro(falha instanceof Error ? falha.message : 'Não foi possível enviar. Sua mensagem não foi armazenada.') }
    finally { setEnviando(false) }
  }

  const campo = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-bluebrand focus:ring-2 focus:ring-bluebrand/20'
  return <MainLayout><main>
    <section className="bg-[#e8f0ff] px-4 py-14 sm:px-6 md:py-20"><div className="mx-auto max-w-7xl"><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-bluebrand"><MessageCircle size={18}/> Fale com a gente</p><h1 className="mt-5 font-display text-4xl font-extrabold text-navy sm:text-5xl">Sua mensagem pode fazer <span className="text-bluebrand">a diferença.</span></h1><p className="mt-5 max-w-2xl leading-7 text-slate-600">Tem alguma dúvida, sugestão ou gostaria de saber mais sobre o Alimenta+? Este é um espaço para conversar sobre nosso projeto.</p></div></section>
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2"><div><Mail size={28} className="text-bluebrand"/><h2 className="mt-4 font-display text-3xl font-extrabold text-navy">Vamos conversar?</h2><p className="mt-4 max-w-lg leading-7 text-slate-600">O Alimenta+ conecta estabelecimentos que possuem alimentos disponíveis a instituições que podem transformá-los em refeições para quem precisa.</p><p className="mt-6 rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-navy">Preencha o formulário para enviar dúvidas e sugestões à equipe.</p></div>
    <form onSubmit={enviarMensagem} onChange={() => { setEnviado(false); setErro('') }} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="font-display text-2xl font-extrabold text-navy">Envie sua mensagem</h2>
      <label className="block text-sm font-bold text-navy">Nome completo *<input name="nome" type="text" required minLength={2} maxLength={100} autoComplete="name" placeholder="Digite seu nome completo" className={campo}/></label>
      <label className="block text-sm font-bold text-navy">E-mail *<input name="email" type="email" required autoComplete="email" placeholder="exemplo@email.com" className={campo}/></label>
      <label className="block text-sm font-bold text-navy">Assunto *<select name="assunto" required defaultValue="" className={campo}><option value="" disabled>Selecione um assunto</option><option value="duvida">Dúvida sobre a plataforma</option><option value="doacao">Doação de alimentos</option><option value="instituicao">Instituições participantes</option><option value="sugestao">Sugestões e melhorias</option><option value="outro">Outro assunto</option></select></label>
      <label className="block text-sm font-bold text-navy">Mensagem *<textarea name="mensagem" required minLength={10} maxLength={1000} rows={5} placeholder="Escreva sua mensagem aqui..." className={`${campo} resize-y`}/></label>
      <p className="text-xs text-slate-500">* Campos obrigatórios.</p><button type="submit" disabled={enviando} className="flex w-full items-center justify-center gap-2 rounded-xl bg-bluebrand px-5 py-3.5 font-bold text-white hover:bg-navy disabled:opacity-60"><Send size={18}/>{enviando ? 'Enviando…' : 'Enviar mensagem'}</button>
      {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}{enviado && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">Mensagem enviada com sucesso. Nossa equipe poderá consultá-la na área administrativa.</p>}
      <p className="text-center text-xs text-slate-500">Os dados são enviados à API para serem registrados no banco de dados.</p>
    </form></section>
  </main></MainLayout>
}
