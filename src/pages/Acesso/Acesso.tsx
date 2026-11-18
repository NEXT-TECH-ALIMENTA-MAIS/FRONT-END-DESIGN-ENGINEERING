
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Users } from 'lucide-react'
import { Pagina, Mensagem, botao, campo, painel } from '../../components/Interface/Interface'
import type { Estado } from '../../data/estado'

export function Acesso({ orgs, setPerfil }: Estado) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const perfisDisponiveis = orgs.filter(org => org.ativa)

  function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setMensagem('O login real ainda não está disponível. Utilize um dos perfis demonstrativos.')
    setSenha('')
  }

  return (
    <Pagina titulo="Acesse sua conta">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <section className={`${painel} shadow-sm`}>
          <div className="mb-7">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-bluebrand">
              <LockKeyhole size={15} />
              Área de acesso
            </span>

            <h2 className="font-display text-2xl font-extrabold text-navy">
              Bem-vindo de volta!
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Acesse sua conta e acompanhe as atividades da sua organização.
            </p>
          </div>

          <form onSubmit={entrar} className="space-y-5">
            <div>
              <label htmlFor="email-login" className="block text-sm font-bold text-navy">
                E-mail
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-4 text-slate-400" />
                <input
                  id="email-login"
                  type="email"
                  value={email}
                  onChange={evento => setEmail(evento.target.value)}
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  className={`${campo} pl-10`}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha-login" className="block text-sm font-bold text-navy">
                Senha
              </label>
              <div className="relative">
                <LockKeyhole size={18} className="absolute left-3 top-4 text-slate-400" />
                <input
                  id="senha-login"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={evento => setSenha(evento.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  className={`${campo} pl-10 pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-bluebrand"
                >
                  {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button type="submit" className={`${botao} w-full gap-2 py-3`}>
              Entrar
              <ArrowRight size={17} />
            </button>

            <Mensagem texto={mensagem} />
          </form>

          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-slate-600">
              Ainda não tem uma conta?{' '}
              <Link to="/cadastro" className="font-bold text-bluebrand hover:underline">
                Cadastre sua organização
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Demonstração acadêmica. Não utilize credenciais reais.
          </p>
        </section>

        <section className={`${painel} bg-[#f8faff] shadow-sm`}>
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-xl bg-blue-100 p-3 text-bluebrand">
              <Users size={23} />
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold text-navy">
                Acesso demonstrativo
              </h2>
              <p className="text-sm text-slate-500">
                Experimente os diferentes perfis.
              </p>
            </div>
          </div>

          <p className="mb-5 text-sm leading-6 text-slate-600">
            Escolha uma organização fictícia para conhecer a plataforma.
            Nenhuma senha é necessária nesta demonstração.
          </p>

          <div className="space-y-3">
            {perfisDisponiveis.map(org => (
              <Link
                key={org.id}
                to="/painel"
                onClick={() => setPerfil(org.id)}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-bluebrand hover:shadow-sm"
              >
                <div>
                  <h3 className="font-bold text-navy">{org.nome}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {org.papel.replaceAll('_', ' ')}
                  </p>
                  <span className="mt-2 inline-block text-xs font-medium text-bluebrand">
                    {org.aprovada ? 'Aprovada' : 'Aguardando aprovação'}
                  </span>
                </div>
                <ArrowRight size={18} className="shrink-0 text-bluebrand" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Pagina>
  )
}
