import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { aprovarOrganizacaoAdmin, listarOrganizacoesAdmin, sairAdmin, sessaoAdminAtual, type OrganizacaoAdmin } from '../../services/adminApi'
import { botao, painel } from '../../components/Interface/Interface'

export function PainelAdmin() {
  const navegar = useNavigate()
  const sessao = sessaoAdminAtual()
  const [organizacoes, setOrganizacoes] = useState<OrganizacaoAdmin[]>([])
  const [carregando, setCarregando] = useState(true)
  const [ocupado, setOcupado] = useState(0)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function atualizar() {
    if (!sessao) return
    setCarregando(true); setErro('')
    try {
      const listaOrganizacoes = await listarOrganizacoesAdmin(sessao.token)
      setOrganizacoes(listaOrganizacoes)
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar a área administrativa.')
      if (falha instanceof Error && falha.message.includes('Entre novamente')) navegar('/acesso')
    } finally { setCarregando(false) }
  }

  useEffect(() => {
    if (!sessao) { navegar('/acesso'); return }
    void atualizar()
  }, [])

  async function revisar(organizacao: OrganizacaoAdmin, aprovado: boolean) {
    if (!sessao) return
    setOcupado(organizacao.id); setErro(''); setMensagem('')
    try {
      const atualizada = await aprovarOrganizacaoAdmin(organizacao.id, aprovado, sessao.token)
      setOrganizacoes(lista => lista.map(item => item.id === atualizada.id ? atualizada : item))
      setMensagem(aprovado ? 'Organização aprovada.' : 'Cadastro reprovado.')
    } catch (falha) { setErro(falha instanceof Error ? falha.message : 'Não foi possível atualizar o cadastro.') }
    finally { setOcupado(0) }
  }

  async function encerrar() {
    if (sessao) await sairAdmin(sessao.token)
    navegar('/acesso')
  }

  return <MainLayout><main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-bluebrand">Área administrativa</p><h1 className="mt-1 font-display text-3xl font-extrabold text-navy">Olá, {sessao?.nome}</h1></div><button className={botao} onClick={encerrar}>Sair da conta</button></header>
    <p className="mb-5 rounded-xl bg-blue-50 p-4 text-sm text-navy">Revise os cadastros de organizações pendentes.</p>
    <button className="mb-5 text-sm font-bold text-bluebrand underline" onClick={() => void atualizar()}>Atualizar cadastros</button>
    {erro && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{erro}</p>}{mensagem && <p role="status" className="mb-4 rounded-xl bg-green-50 p-4 text-sm text-green-800">{mensagem}</p>}{carregando && <p role="status" className="mb-4">Carregando dados administrativos…</p>}
    {!carregando && <section className="space-y-4" aria-label="Cadastros de organizações">{organizacoes.filter(item => item.statusCadastro === 'PENDENTE').map(item => <article key={item.id} className={painel}><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-display text-xl font-bold text-navy">{item.nomeFantasia}</h2><p className="mt-1 text-sm text-slate-600">{item.razaoSocial} · {item.tipo === 'ESTABELECIMENTO' ? 'Estabelecimento' : 'Instituição'}</p><p className="mt-2 text-sm text-slate-600">CNPJ {item.cnpj} · {item.emailContato} · {item.telefone || 'Sem telefone'}</p><p className="mt-1 text-sm text-slate-600">{item.endereco}</p></div><div className="flex gap-2"><button disabled={ocupado === item.id} className={botao} onClick={() => void revisar(item, true)}>{ocupado === item.id ? 'Salvando…' : 'Aprovar'}</button><button disabled={ocupado === item.id} className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50" onClick={() => void revisar(item, false)}>Reprovar</button></div></div></article>)}{!organizacoes.some(item => item.statusCadastro === 'PENDENTE') && <p className={painel}>Não há cadastros pendentes.</p>}</section>}
  </main></MainLayout>
}
