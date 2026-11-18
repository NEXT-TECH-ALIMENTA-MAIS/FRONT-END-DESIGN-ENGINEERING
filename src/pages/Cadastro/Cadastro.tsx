
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck
} from 'lucide-react'
import {
  Pagina,
  Mensagem,
  botao,
  campo,
  painel
} from '../../components/Interface/Interface'
import type { Estado } from '../../data/estado'
import type { Papel } from '../../data/modelos'
import { novoId } from '../../data/calculos'

export function Cadastro({ orgs, setOrgs }: Estado) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [papel, setPapel] = useState<Papel>('ESTABELECIMENTO')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mensagem, setMensagem] = useState('')

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const numero = cnpj.replace(/\D/g, '')
    const emailNormalizado = email.trim().toLowerCase()

    if (numero.length !== 14) {
      setMensagem('Informe um CNPJ com 14 dígitos.')
      return
    }

    if (senha !== confirmarSenha) {
      setMensagem('As senhas informadas não coincidem.')
      return
    }

    if (
      orgs.some(
        org =>
          org.cnpj === numero ||
          org.email.toLowerCase() === emailNormalizado
      )
    ) {
      setMensagem('CNPJ ou e-mail já cadastrado na demonstração.')
      return
    }

    setOrgs(anterior => [
      ...anterior,
      {
        id: novoId(),
        nome: nome.trim(),
        email: emailNormalizado,
        telefone: telefone.trim(),
        cnpj: numero,
        papel,
        aprovada: false,
        ativa: true
      }
    ])

    setMensagem(
      'Cadastro demonstrativo realizado! Sua organização aguarda aprovação. Nenhuma senha foi armazenada.'
    )

    setNome('')
    setEmail('')
    setTelefone('')
    setCnpj('')
    setSenha('')
    setConfirmarSenha('')
  }

  return (
    <Pagina titulo="Cadastre sua organização">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className={`${painel} shadow-sm`}>
          <div className="mb-7">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-bluebrand">
              <Building2 size={15} />
              Cadastro de organização
            </span>

            <h2 className="font-display text-2xl font-extrabold text-navy">
              Faça parte do Alimenta+
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cadastre sua organização e participe da nossa rede de
              combate ao desperdício de alimentos.
            </p>
          </div>

          <Mensagem texto={mensagem} />

          <form onSubmit={enviar} className="space-y-5">
            <div>
              <label
                htmlFor="tipo-organizacao"
                className="block text-sm font-bold text-navy"
              >
                Tipo de organização
              </label>

              <select
                id="tipo-organizacao"
                value={papel}
                onChange={evento =>
                  setPapel(evento.target.value as Papel)
                }
                className={campo}
              >
                <option value="ESTABELECIMENTO">
                  Estabelecimento doador
                </option>
                <option value="INSTITUICAO">
                  Instituição receptora
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="nome-organizacao"
                className="block text-sm font-bold text-navy"
              >
                Nome da organização
              </label>

              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-3 top-4 text-slate-400"
                />

                <input
                  id="nome-organizacao"
                  type="text"
                  value={nome}
                  onChange={evento => setNome(evento.target.value)}
                  placeholder="Nome da organização"
                  className={`${campo} pl-10`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cnpj-cadastro"
                className="block text-sm font-bold text-navy"
              >
                CNPJ
              </label>

              <input
                id="cnpj-cadastro"
                type="text"
                inputMode="numeric"
                value={cnpj}
                onChange={evento => setCnpj(evento.target.value)}
                placeholder="00.000.000/0000-00"
                className={campo}
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="email-cadastro"
                  className="block text-sm font-bold text-navy"
                >
                  E-mail
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-4 text-slate-400"
                  />

                  <input
                    id="email-cadastro"
                    type="email"
                    value={email}
                    onChange={evento => setEmail(evento.target.value)}
                    placeholder="contato@exemplo.com"
                    autoComplete="email"
                    className={`${campo} pl-10`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="telefone-cadastro"
                  className="block text-sm font-bold text-navy"
                >
                  Telefone
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-4 text-slate-400"
                  />

                  <input
                    id="telefone-cadastro"
                    type="tel"
                    value={telefone}
                    onChange={evento => setTelefone(evento.target.value)}
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                    className={`${campo} pl-10`}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="senha-cadastro"
                className="block text-sm font-bold text-navy"
              >
                Senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-4 text-slate-400"
                />

                <input
                  id="senha-cadastro"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={evento => setSenha(evento.target.value)}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  minLength={8}
                  className={`${campo} pl-10 pr-12`}
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

              <p className="mt-1 text-xs text-slate-500">
                Utilize pelo menos 8 caracteres fictícios.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmar-senha"
                className="block text-sm font-bold text-navy"
              >
                Confirmar senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-4 text-slate-400"
                />

                <input
                  id="confirmar-senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={evento =>
                    setConfirmarSenha(evento.target.value)
                  }
                  placeholder="Repita sua senha"
                  autoComplete="new-password"
                  minLength={8}
                  className={`${campo} pl-10`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`${botao} w-full gap-2 py-3`}
            >
              Cadastrar organização
              <ArrowRight size={17} />
            </button>

            <p className="text-center text-xs leading-5 text-slate-500">
              Ambiente demonstrativo. Não utilize dados pessoais,
              CNPJ ou senhas reais. Nenhuma senha será armazenada.
            </p>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-slate-600">
              Já possui uma conta?{' '}
              <Link
                to="/acesso"
                className="font-bold text-bluebrand hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </section>

        <aside className={`${painel} h-fit bg-[#f8faff] shadow-sm`}>
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-xl bg-blue-100 p-3 text-bluebrand">
              <HeartHandshake size={24} />
            </span>

            <h2 className="font-display text-lg font-extrabold text-navy">
              Juntos fazemos a diferença
            </h2>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            O Alimenta+ conecta quem tem alimentos disponíveis
            com instituições que precisam recebê-los.
          </p>

          <div className="mt-7 space-y-6">
            <div className="flex gap-3">
              <CheckCircle2
                size={21}
                className="shrink-0 text-bluebrand"
              />
              <div>
                <h3 className="text-sm font-bold text-navy">
                  Reduza o desperdício
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Compartilhe alimentos próprios para consumo.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <HeartHandshake
                size={21}
                className="shrink-0 text-bluebrand"
              />
              <div>
                <h3 className="text-sm font-bold text-navy">
                  Conecte organizações
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Aproximamos estabelecimentos e instituições sociais.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <ShieldCheck
                size={21}
                className="shrink-0 text-bluebrand"
              />
              <div>
                <h3 className="text-sm font-bold text-navy">
                  Mais transparência
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Acompanhe as etapas de cada doação.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-blue-100 p-4">
            <p className="text-xs leading-5 text-navy">
              Após o cadastro demonstrativo, a organização fica
              aguardando aprovação do administrador.
            </p>
          </div>
        </aside>
      </div>
    </Pagina>
  )
}
