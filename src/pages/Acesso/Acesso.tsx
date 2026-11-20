
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Users
} from 'lucide-react'
import {
  Pagina,
  Mensagem,
  botao,
  campo,
  painel
} from '../../components/Interface/Interface'
import type { Estado } from '../../data/estado'
import { apiConfigurada } from '../../services/api'
import { configurarPrimeiroAdmin, entrarAdmin } from '../../services/adminApi'

export function Acesso({ orgs, setPerfil }: Estado) {
  const navegar = useNavigate()
  const [aba, setAba] = useState<'organizacao' | 'administrador'>('organizacao')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminSenha, setAdminSenha] = useState('')
  const [adminNome, setAdminNome] = useState('')
  const [adminCpf, setAdminCpf] = useState('')
  const [chaveConfiguracao, setChaveConfiguracao] = useState('')
  const [configurarAdmin, setConfigurarAdmin] = useState(false)
  const [adminMensagem, setAdminMensagem] = useState('')
  const [adminErro, setAdminErro] = useState('')
  const [adminOcupado, setAdminOcupado] = useState(false)

  const [erros, setErros] = useState({
    email: '',
    senha: ''
  })

  const perfisDisponiveis = orgs.filter(org => org.ativa && org.papel !== 'ADMIN')

  function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const novosErros = {
      email: '',
      senha: ''
    }

    const emailLimpo = email.trim()
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailLimpo) {
      novosErros.email = 'O e-mail é obrigatório.'
    } else if (!formatoEmail.test(emailLimpo)) {
      novosErros.email = 'Informe um e-mail válido.'
    }

    if (!senha) {
      novosErros.senha = 'A senha é obrigatória.'
    }

    setErros(novosErros)

    if (novosErros.email || novosErros.senha) {
      setMensagem('')
      return
    }

    setMensagem(
      'Formulário validado! A autenticação real estará disponível após a integração com a API.'
    )

    setSenha('')
  }

  function alterarEmail(valor: string) {
    setEmail(valor)

    if (erros.email) {
      setErros(anterior => ({
        ...anterior,
        email: ''
      }))
    }

    setMensagem('')
  }

  function alterarSenha(valor: string) {
    setSenha(valor)

    if (erros.senha) {
      setErros(anterior => ({
        ...anterior,
        senha: ''
      }))
    }

    setMensagem('')
  }

  async function entrarAdministrador(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); setAdminErro(''); setAdminMensagem('')
    if (!apiConfigurada) { setAdminErro('Configure VITE_API_URL para conectar o acesso administrativo à API Java.'); return }
    setAdminOcupado(true)
    try {
      await entrarAdmin(adminEmail.trim(), adminSenha)
      navegar('/admin')
    } catch (falha) { setAdminErro(falha instanceof Error ? falha.message : 'Não foi possível entrar.') }
    finally { setAdminOcupado(false) }
  }

  async function configurarAdministrador(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); setAdminErro(''); setAdminMensagem('')
    if (!apiConfigurada) { setAdminErro('Configure VITE_API_URL para conectar o acesso administrativo à API Java.'); return }
    if (adminCpf.replace(/\D/g, '').length !== 11) { setAdminErro('Informe um CPF com 11 números.'); return }
    setAdminOcupado(true)
    try {
      await configurarPrimeiroAdmin({ chaveConfiguracao, nome: adminNome.trim(), cpf: adminCpf.replace(/\D/g, ''), email: adminEmail.trim(), senha: adminSenha })
      setConfigurarAdmin(false); setAdminMensagem('Conta administrativa configurada. Agora entre com o e-mail e a senha escolhidos.')
      setChaveConfiguracao(''); setAdminCpf(''); setAdminNome(''); setAdminSenha('')
    } catch (falha) { setAdminErro(falha instanceof Error ? falha.message : 'Não foi possível configurar a conta.') }
    finally { setAdminOcupado(false) }
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

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Tipo de acesso">
            <button type="button" role="tab" aria-selected={aba === 'organizacao'} onClick={() => setAba('organizacao')} className={`rounded-lg px-3 py-2.5 text-sm font-bold ${aba === 'organizacao' ? 'bg-white text-navy shadow-sm' : 'text-slate-600'}`}>Organização</button>
            <button type="button" role="tab" aria-selected={aba === 'administrador'} onClick={() => setAba('administrador')} className={`rounded-lg px-3 py-2.5 text-sm font-bold ${aba === 'administrador' ? 'bg-white text-navy shadow-sm' : 'text-slate-600'}`}>Administrador</button>
          </div>

          {aba === 'organizacao' && <form onSubmit={entrar} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="email-login"
                className="block text-sm font-bold text-navy"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="absolute left-3 top-4 text-slate-400"
                />

                <input
                  id="email-login"
                  type="email"
                  value={email}
                  onChange={evento => alterarEmail(evento.target.value)}
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  className={`${campo} pl-10 ${
                    erros.email ? 'border-red-500' : ''
                  }`}
                  aria-invalid={!!erros.email}
                  aria-describedby={erros.email ? 'erro-email-login' : undefined}
                  required
                />
              </div>

              {erros.email && (
                <p
                  id="erro-email-login"
                  role="alert"
                  className="mt-1 text-xs font-medium text-red-600"
                >
                  {erros.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="senha-login"
                className="block text-sm font-bold text-navy"
              >
                Senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="absolute left-3 top-4 text-slate-400"
                />

                <input
                  id="senha-login"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={evento => alterarSenha(evento.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  className={`${campo} pl-10 pr-12 ${
                    erros.senha ? 'border-red-500' : ''
                  }`}
                  aria-invalid={!!erros.senha}
                  aria-describedby={erros.senha ? 'erro-senha-login' : undefined}
                  required
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={
                    mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                  }
                  aria-pressed={mostrarSenha}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-bluebrand"
                >
                  {mostrarSenha ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {erros.senha && (
                <p
                  id="erro-senha-login"
                  role="alert"
                  className="mt-1 text-xs font-medium text-red-600"
                >
                  {erros.senha}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`${botao} w-full gap-2 py-3`}
            >
              Entrar
              <ArrowRight size={17} />
            </button>

            <Mensagem texto={mensagem} />
          </form>}

          {aba === 'administrador' && <div>
            <p className="mb-5 text-sm leading-6 text-slate-600">Conta individual de administrador, conforme as regras do Alimenta+. O CPF é vinculado a esta conta e não à organização.</p>
            <form onSubmit={configurarAdmin ? configurarAdministrador : entrarAdministrador} className="space-y-5">
              {configurarAdmin && <>
                <label className="block text-sm font-bold text-navy">Nome completo<input required maxLength={120} className={campo} value={adminNome} onChange={e => setAdminNome(e.target.value)}/></label>
                <label className="block text-sm font-bold text-navy">CPF<input required inputMode="numeric" maxLength={14} className={campo} value={adminCpf} onChange={e => setAdminCpf(e.target.value)}/></label>
                <label className="block text-sm font-bold text-navy">Chave de configuração do servidor<input required type="password" autoComplete="off" className={campo} value={chaveConfiguracao} onChange={e => setChaveConfiguracao(e.target.value)}/><span className="mt-1 block text-xs font-normal text-slate-500">Definida pela equipe na configuração da API. Não é a senha da conta.</span></label>
              </>}
              <label className="block text-sm font-bold text-navy">E-mail<input required type="email" autoComplete="email" className={campo} value={adminEmail} onChange={e => setAdminEmail(e.target.value)}/></label>
              <label className="block text-sm font-bold text-navy">Senha<input required type="password" autoComplete={configurarAdmin ? 'new-password' : 'current-password'} minLength={8} className={campo} value={adminSenha} onChange={e => setAdminSenha(e.target.value)}/></label>
              {adminErro && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{adminErro}</p>}
              {adminMensagem && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{adminMensagem}</p>}
              <button disabled={adminOcupado} type="submit" className={`${botao} w-full gap-2 py-3`}>{adminOcupado ? 'Aguarde…' : configurarAdmin ? 'Configurar primeira conta' : 'Entrar como administrador'}<ArrowRight size={17}/></button>
            </form>
            <button type="button" onClick={() => { setConfigurarAdmin(!configurarAdmin); setAdminErro(''); setAdminMensagem('') }} className="mt-5 text-sm font-bold text-bluebrand underline">{configurarAdmin ? 'Já tenho uma conta administrativa' : 'Configurar primeira conta administrativa'}</button>
          </div>}

          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-slate-600">
              Ainda não tem uma conta?{' '}
              <Link
                to="/cadastro"
                className="font-bold text-bluebrand hover:underline"
              >
                Cadastre sua organização
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Demonstração acadêmica. Não utilize credenciais reais.
          </p>
        </section>

        {aba === 'organizacao' ? <section className={`${painel} bg-[#f8faff] shadow-sm`}>
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
                to="/demonstracao/painel"
                onClick={() => setPerfil(org.id)}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-bluebrand hover:shadow-sm"
              >
                <div>
                  <h3 className="font-bold text-navy">
                    {org.nome}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {org.papel.replaceAll('_', ' ')}
                  </p>

                  <span className="mt-2 inline-block text-xs font-medium text-bluebrand">
                    {org.aprovada
                      ? 'Aprovada'
                      : 'Aguardando aprovação'}
                  </span>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-bluebrand"
                />
              </Link>
            ))}
          </div>
        </section> : <aside className={`${painel} bg-[#f8faff] shadow-sm`}><h2 className="font-display text-lg font-extrabold text-navy">Acesso protegido</h2><p className="mt-3 text-sm leading-6 text-slate-600">Depois de entrar, você poderá analisar cadastros pendentes e consultar mensagens de contato. As ações administrativas serão validadas pela API.</p><p className="mt-4 rounded-xl bg-blue-50 p-4 text-xs leading-5 text-slate-600">Para configurar a primeira conta, a equipe precisa definir uma chave no ambiente do servidor. O sistema não cria administradores por cadastro público.</p></aside>}
      </div>
    </Pagina>
  )
}
