import { apiConfigurada, enviarParaApi } from '../../services/api'
import type { OrganizacaoApi } from '../../services/painelApi'

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
import { Pagina, botao, campo, painel } from '../../components/Interface/Interface'
import type { Estado } from '../../data/estado'
import type { Papel } from '../../data/modelos'
import { novoId } from '../../data/calculos'

type CampoCadastro = 'nome' | 'cnpj' | 'email' | 'telefone' | 'senha' | 'confirmarSenha'
type ErrosCadastro = Partial<Record<CampoCadastro, string>>
type MensagemCadastro = { tipo: 'erro' | 'sucesso'; texto: string } | null

function formatarCnpj(valor: string) {
  const numero = valor.replace(/\D/g, '').slice(0, 14)

  return numero
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function formatarTelefone(valor: string) {
  const numero = valor.replace(/\D/g, '').slice(0, 11)

  if (numero.length <= 2) return numero ? `(${numero}` : ''

  if (numero.length <= 6) {
    return `(${numero.slice(0, 2)}) ${numero.slice(2)}`
  }

  const inicio = numero.length === 11 ? 7 : 6

  return `(${numero.slice(0, 2)}) ${numero.slice(2, inicio)}-${numero.slice(inicio)}`
}

function validarCnpj(valor: string) {
  const numero = valor.replace(/\D/g, '')

  if (numero.length !== 14 || /^(\d)\1{13}$/.test(numero)) {
    return false
  }

  function calcularDigito(base: string, pesos: number[]) {
    const soma = pesos.reduce(
      (total, peso, indice) => total + Number(base[indice]) * peso,
      0
    )

    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const primeiro = calcularDigito(
    numero.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  )

  const segundo = calcularDigito(
    numero.slice(0, 13),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  )

  return primeiro === Number(numero[12]) &&
    segundo === Number(numero[13])
}

function ErroCampo({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null

  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-red-600">
      {texto}
    </p>
  )
}

export function Cadastro({ orgs, setOrgs }: Estado) {
  const [nome, setNome] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [login, setLogin] = useState('')
  const [endereco, setEndereco] = useState('')
  const [tipoDetalhe, setTipoDetalhe] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [cnpj, setCnpj] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [papel, setPapel] = useState<Papel>('ESTABELECIMENTO')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erros, setErros] = useState<ErrosCadastro>({})
  const [mensagem, setMensagem] = useState<MensagemCadastro>(null)

  function limparErro(campoAtual: CampoCadastro) {
    setErros(anterior => ({
      ...anterior,
      [campoAtual]: undefined
    }))
    setMensagem(null)
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (salvando) return

    const novosErros: ErrosCadastro = {}
    const numero = cnpj.replace(/\D/g, '')
    const telefoneNumero = telefone.replace(/\D/g, '')
    const emailNormalizado = email.trim().toLowerCase()

    if (!nome.trim()) {
      novosErros.nome = 'Informe o nome da organização.'
    }

    if (!validarCnpj(numero)) {
      novosErros.cnpj = 'Informe um CNPJ válido.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      novosErros.email = 'Informe um e-mail válido.'
    }

    if (![10, 11].includes(telefoneNumero.length)) {
      novosErros.telefone = 'Informe um telefone com DDD válido.'
    }

    if (senha.length < 8 || !/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
      novosErros.senha = 'A senha deve ter pelo menos 8 caracteres, uma letra e um número.'
    }

    if (!confirmarSenha) {
      novosErros.confirmarSenha = 'Confirme sua senha.'
    } else if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem.'
    }

    if (!apiConfigurada && orgs.some(org => org.cnpj.replace(/\D/g, '') === numero)) {
      novosErros.cnpj = 'Este CNPJ já está cadastrado.'
    }

    if (!apiConfigurada && orgs.some(org => org.email.toLowerCase() === emailNormalizado)) {
      novosErros.email = 'Este e-mail já está cadastrado.'
    }

    setErros(novosErros)

    if (Object.keys(novosErros).length > 0) {
      setMensagem({
        tipo: 'erro',
        texto: 'Corrija os campos destacados para continuar.'
      })
      return
    }

    if (apiConfigurada) {
      if (!razaoSocial.trim() || !login.trim() || !endereco.trim() || !tipoDetalhe.trim() || senha.length > 100) {
        setMensagem({ tipo: 'erro', texto: 'Informe razão social, login, endereço e ramo de atuação. A senha deve ter até 100 caracteres.' })
        return
      }
      setSalvando(true)
      try {
        const criada = await enviarParaApi<OrganizacaoApi>('/api/organizacoes', {
          cnpj: numero, tipo: papel, razaoSocial: razaoSocial.trim(), nomeFantasia: nome.trim(),
          login: login.trim(), senha, emailContato: emailNormalizado, telefone: telefoneNumero,
          endereco: endereco.trim(), tipoDetalhe: tipoDetalhe.trim(),
        })
        setMensagem({ tipo: 'sucesso', texto: 'Cadastro #' + criada.id + ' confirmado pela API. Aguarde aprovação administrativa. O login ainda depende da implementação de autenticação no Java.' })
        setSenha(''); setConfirmarSenha('')
      } catch (falha) {
        setMensagem({ tipo: 'erro', texto: falha instanceof Error ? falha.message : 'Não foi possível cadastrar.' })
      } finally { setSalvando(false) }
      return
    }

    setOrgs(anterior => [
      ...anterior,
      {
        id: novoId(),
        nome: nome.trim(),
        cnpj: numero,
        email: emailNormalizado,
        telefone: telefoneNumero,
        papel,
        aprovada: false,
        ativa: true
      }
    ])

    setMensagem({
      tipo: 'sucesso',
      texto: 'Cadastro demonstrativo realizado! Sua organização está aguardando aprovação.'
    })

    setNome('')
    setCnpj('')
    setEmail('')
    setTelefone('')
    setSenha('')
    setConfirmarSenha('')
    setErros({})
  }

  const estiloErro = (nomeCampo: CampoCadastro) =>
    erros[nomeCampo] ? 'border-red-500' : ''

  return (
    <Pagina titulo="Cadastre sua organização" aviso={apiConfigurada ? "Cadastro conectado à API Java. O acesso depende de aprovação e da implementação do login." : undefined}>
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

          {mensagem && (
            <p
              role={mensagem.tipo === 'erro' ? 'alert' : 'status'}
              className={`mb-5 rounded-lg p-4 text-sm ${
                mensagem.tipo === 'sucesso'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {mensagem.texto}
            </p>
          )}

          <form onSubmit={enviar} noValidate className="space-y-5">
            <fieldset disabled={salvando} className="space-y-5">
            {apiConfigurada && <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold">Razão social<input required maxLength={160} className={campo} value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)}/></label>
              <label className="text-sm font-bold">Login da organização<input required maxLength={160} autoComplete="username" className={campo} value={login} onChange={e => setLogin(e.target.value)}/></label>
              <label className="text-sm font-bold">Endereço<input required maxLength={250} className={campo} value={endereco} onChange={e => setEndereco(e.target.value)}/></label>
              <label className="text-sm font-bold">Ramo de atuação<input required maxLength={40} placeholder="Ex.: PADARIA ou ONG" className={campo} value={tipoDetalhe} onChange={e => setTipoDetalhe(e.target.value)}/></label>
            </div>}
            <div>
              <label htmlFor="tipo-organizacao" className="block text-sm font-bold text-navy">
                Tipo de organização
              </label>

              <select
                id="tipo-organizacao"
                value={papel}
                onChange={evento => setPapel(evento.target.value as Papel)}
                className={campo}
              >
                <option value="ESTABELECIMENTO">Estabelecimento doador</option>
                <option value="INSTITUICAO">Instituição receptora</option>
              </select>
            </div>

            <div>
              <label htmlFor="nome-organizacao" className="block text-sm font-bold text-navy">
                Nome da organização
              </label>

              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-4 text-slate-400" />
                <input
                  id="nome-organizacao"
                  type="text"
                  value={nome}
                  onChange={evento => {
                    setNome(evento.target.value)
                    limparErro('nome')
                  }}
                  placeholder="Nome da organização"
                  className={`${campo} pl-10 ${estiloErro('nome')}`}
                  aria-invalid={!!erros.nome}
                  aria-describedby={erros.nome ? 'erro-nome' : undefined}
                />
              </div>
              <ErroCampo id="erro-nome" texto={erros.nome} />
            </div>

            <div>
              <label htmlFor="cnpj-cadastro" className="block text-sm font-bold text-navy">
                CNPJ
              </label>

              <input
                id="cnpj-cadastro"
                type="text"
                inputMode="numeric"
                value={cnpj}
                onChange={evento => {
                  setCnpj(formatarCnpj(evento.target.value))
                  limparErro('cnpj')
                }}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                className={`${campo} ${estiloErro('cnpj')}`}
                aria-invalid={!!erros.cnpj}
                aria-describedby={erros.cnpj ? 'erro-cnpj' : undefined}
              />
              <ErroCampo id="erro-cnpj" texto={erros.cnpj} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email-cadastro" className="block text-sm font-bold text-navy">
                  E-mail
                </label>

                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-4 text-slate-400" />
                  <input
                    id="email-cadastro"
                    type="email"
                    value={email}
                    onChange={evento => {
                      setEmail(evento.target.value)
                      limparErro('email')
                    }}
                    placeholder="contato@exemplo.com"
                    autoComplete="email"
                    className={`${campo} pl-10 ${estiloErro('email')}`}
                    aria-invalid={!!erros.email}
                    aria-describedby={erros.email ? 'erro-email' : undefined}
                  />
                </div>
                <ErroCampo id="erro-email" texto={erros.email} />
              </div>

              <div>
                <label htmlFor="telefone-cadastro" className="block text-sm font-bold text-navy">
                  Telefone
                </label>

                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-4 text-slate-400" />
                  <input
                    id="telefone-cadastro"
                    type="tel"
                    value={telefone}
                    onChange={evento => {
                      setTelefone(formatarTelefone(evento.target.value))
                      limparErro('telefone')
                    }}
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                    className={`${campo} pl-10 ${estiloErro('telefone')}`}
                    aria-invalid={!!erros.telefone}
                    aria-describedby={erros.telefone ? 'erro-telefone' : undefined}
                  />
                </div>
                <ErroCampo id="erro-telefone" texto={erros.telefone} />
              </div>
            </div>

            <div>
              <label htmlFor="senha-cadastro" className="block text-sm font-bold text-navy">
                Senha
              </label>

              <div className="relative">
                <LockKeyhole size={18} className="absolute left-3 top-4 text-slate-400" />
                <input
                  id="senha-cadastro"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={evento => {
                    setSenha(evento.target.value)
                    limparErro('senha')
                  }}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  className={`${campo} pl-10 pr-12 ${estiloErro('senha')}`}
                  aria-invalid={!!erros.senha}
                  aria-describedby={erros.senha ? 'erro-senha' : undefined}
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={mostrarSenha}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-bluebrand"
                >
                  {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Mínimo de 8 caracteres, incluindo letra e número.
              </p>
              <ErroCampo id="erro-senha" texto={erros.senha} />
            </div>

            <div>
              <label htmlFor="confirmar-senha" className="block text-sm font-bold text-navy">
                Confirmar senha
              </label>

              <div className="relative">
                <LockKeyhole size={18} className="absolute left-3 top-4 text-slate-400" />
                <input
                  id="confirmar-senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={evento => {
                    setConfirmarSenha(evento.target.value)
                    limparErro('confirmarSenha')
                  }}
                  placeholder="Repita sua senha"
                  autoComplete="new-password"
                  className={`${campo} pl-10 ${estiloErro('confirmarSenha')}`}
                  aria-invalid={!!erros.confirmarSenha}
                  aria-describedby={erros.confirmarSenha ? 'erro-confirmar' : undefined}
                />
              </div>
              <ErroCampo id="erro-confirmar" texto={erros.confirmarSenha} />
            </div>

            <button type="submit" className={`${botao} w-full gap-2 py-3`}>
              {salvando ? 'Cadastrando…' : 'Cadastrar organização'}
              <ArrowRight size={17} />
            </button>

            <p className="text-center text-xs leading-5 text-slate-500">
              {apiConfigurada ? 'O cadastro será enviado à API. A senha não é armazenada no navegador.' : 'Ambiente demonstrativo. Não utilize dados pessoais ou senhas reais. O cadastro não é enviado à API.'}
            </p>
            </fieldset>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-slate-600">
              Já possui uma conta?{' '}
              <Link to="/acesso" className="font-bold text-bluebrand hover:underline">
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
            {[
              {
                icone: CheckCircle2,
                titulo: 'Reduza o desperdício',
                descricao: 'Compartilhe alimentos próprios para consumo.'
              },
              {
                icone: HeartHandshake,
                titulo: 'Conecte organizações',
                descricao: 'Aproximamos estabelecimentos e instituições sociais.'
              },
              {
                icone: ShieldCheck,
                titulo: 'Mais transparência',
                descricao: 'Acompanhe as etapas de cada doação.'
              }
            ].map(item => (
              <div key={item.titulo} className="flex gap-3">
                <item.icone size={21} className="shrink-0 text-bluebrand" />
                <div>
                  <h3 className="text-sm font-bold text-navy">{item.titulo}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-blue-100 p-4">
            <p className="text-xs leading-5 text-navy">
              Após o cadastro, a organização fica aguardando
              aprovação do administrador.
            </p>
          </div>
        </aside>
      </div>
    </Pagina>
  )
}
