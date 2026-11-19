import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Building2, ClipboardList, Handshake, Package } from 'lucide-react'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { PerfilOrganizacao } from '../../components/PerfilOrganizacao/PerfilOrganizacao'
import { NegociacaoPainel } from '../../components/NegociacaoPainel/NegociacaoPainel'
import { botao, campo, Etiqueta, painel } from '../../components/Interface/Interface'
import type { DadosPainel, PerfilCliente } from '../../data/painelCliente'
import { atualizarNegociacao, carregarPainel, chavePainel, saldoPainel, salvarPainel, type AcaoNegociacao } from '../../services/painelCliente'
import { kg } from '../../data/calculos'

function carregarInicial() {
  try { return { dados: carregarPainel(), erro: '' } }
  catch { return { dados: null, erro: 'Não foi possível ler os dados locais. Verifique o armazenamento do navegador e tente novamente.' } }
}

export function PainelCliente() {
  const { tipo } = useParams()
  const [inicial] = useState(carregarInicial)
  const [dados, setDados] = useState<DadosPainel | null>(inicial.dados)
  const [erro, setErro] = useState(inicial.erro)
  const [mensagem, setMensagem] = useState('')
  const [aba, setAba] = useState('perfil')
  const [filtro, setFiltro] = useState('TODAS')
  const organizacaoId = tipo === 'estabelecimento' ? 1 : 2

  function recarregar() {
    try { setDados(carregarPainel()); setErro('') }
    catch { setErro('Não foi possível carregar o painel. Verifique se o armazenamento do navegador está disponível. Seus dados não foram apagados.') }
  }

  useEffect(() => {
    function sincronizar(evento: StorageEvent) {
      if (evento.key === chavePainel || evento.key === null) recarregar()
    }
    window.addEventListener('storage', sincronizar)
    return () => window.removeEventListener('storage', sincronizar)
  }, [])

  function gravar(alterar: (anteriores: DadosPainel) => DadosPainel, sucesso: string) {
    try {
      setDados(salvarPainel(alterar))
      setErro('')
      setMensagem(`${sucesso} Alteração salva somente neste navegador.`)
      return true
    } catch (falha) {
      setMensagem('')
      setErro(falha instanceof Error ? falha.message : 'Não foi possível salvar a alteração.')
      return false
    }
  }

  function salvarPerfil(perfil: PerfilCliente) {
    return gravar(anteriores => {
      if ([perfil.nome, perfil.responsavel, perfil.email, perfil.telefone, perfil.endereco, perfil.descricao].some(valor => !valor.trim()) || !/^\d{14}$/.test(perfil.cnpj)) throw new Error('Preencha os dados da organização e informe o CNPJ com 14 dígitos.')
      return { ...anteriores, organizacoes: anteriores.organizacoes.map(item => item.id === organizacaoId ? { ...item, nome: perfil.nome.trim(), responsavel: perfil.responsavel.trim(), email: perfil.email.trim(), telefone: perfil.telefone.trim(), endereco: perfil.endereco.trim(), descricao: perfil.descricao.trim(), cnpj: perfil.cnpj } : item) }
    }, 'Informações atualizadas.')
  }

  function atualizar(id: number, acao: AcaoNegociacao, motivo: string, valores?: number[], retiradaId?: number) {
    return gravar(anteriores => atualizarNegociacao(anteriores, id, organizacaoId, acao, motivo, valores, retiradaId), 'Negociação atualizada.')
  }

  const organizacao = dados?.organizacoes.find(item => item.id === organizacaoId)
  const estabelecimento = tipo === 'estabelecimento'
  const minhasOfertas = dados?.ofertas.filter(item => item.dono === organizacaoId) ?? []
  const minhasNecessidades = dados?.necessidades.filter(item => item.instituicao === organizacaoId) ?? []
  const negociacoes = dados?.negociacoes.filter(item => estabelecimento ? minhasOfertas.some(oferta => oferta.id === item.oferta) : item.instituicao === organizacaoId) ?? []
  const filtradas = negociacoes.filter(item => filtro === 'TODAS' || item.status === filtro)
  const abas = [{ id: 'perfil', nome: 'Minha organização', icone: Building2 }, { id: 'publicacoes', nome: 'Minhas publicações', icone: Package }, { id: 'negociacoes', nome: 'Negociações', icone: Handshake }]

  if (!['estabelecimento', 'instituicao'].includes(tipo ?? '')) return <MainLayout><main className="mx-auto max-w-6xl px-4 py-12"><h1 className="text-2xl font-bold">Painel não encontrado</h1><Link to="/" className="mt-4 inline-block text-bluebrand">Voltar ao início</Link></main></MainLayout>

  return <MainLayout>
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"><strong>Prévia do painel.</strong> Dados fictícios, salvos neste navegador. Sem login ou envio à API. Acompanhamento entre dispositivos e aprovação administrativa serão conectados ao Java.</div>
      {erro && <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">{erro}<button className="ml-3 font-bold underline" onClick={recarregar}>Tentar carregar novamente</button></div>}
      {mensagem && <p role="status" className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-900">{mensagem}</p>}
      {!dados && !erro && <p role="status">Carregando seu painel…</p>}
      {dados && !organizacao && <p role="alert" className={painel}>Organização não encontrada nos dados locais.</p>}
      {organizacao && dados && (organizacao.ativa && organizacao.aprovada ? <>
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-bluebrand">Área da organização</p><h1 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">Olá, {organizacao.nome}</h1><p className="mt-2 text-sm text-slate-600">Cuide das suas informações e acompanhe cada etapa da doação.</p></div><div className="flex items-center gap-2"><Etiqueta status={organizacao.papel}/><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">Aprovada</span></div></header>
        <div className="mb-7 grid gap-3 sm:grid-cols-3">{[
          { nome: 'Publicações', numero: estabelecimento ? minhasOfertas.length : minhasNecessidades.length, icone: Package },
          { nome: 'Solicitações pendentes', numero: negociacoes.filter(item => item.status === 'PENDENTE').length, icone: ClipboardList },
          { nome: 'Atendimentos em andamento', numero: negociacoes.filter(item => item.status === 'EM_ANDAMENTO').length, icone: Handshake },
        ].map(item => <div key={item.nome} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"><span className="rounded-xl bg-blue-50 p-3 text-bluebrand"><item.icone aria-hidden="true" size={22}/></span><div><p className="text-2xl font-extrabold text-navy">{item.numero}</p><p className="text-sm text-slate-600">{item.nome}</p></div></div>)}</div>
        <nav aria-label="Seções do painel" className="mb-6 flex flex-wrap gap-2">{abas.map(item => <button key={item.id} aria-pressed={aba === item.id} onClick={() => { setAba(item.id); setMensagem('') }} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${aba === item.id ? 'bg-navy text-white' : 'border border-slate-200 bg-white text-navy hover:bg-blue-50'}`}><item.icone aria-hidden="true" size={18}/>{item.nome}</button>)}</nav>
        {aba === 'perfil' && <PerfilOrganizacao key={organizacaoId} organizacao={organizacao} salvar={salvarPerfil}/>}
        {aba === 'publicacoes' && <section aria-labelledby="titulo-publicacoes"><h2 id="titulo-publicacoes" className="mb-2 text-xl font-bold">{estabelecimento ? 'Minhas ofertas de alimentos' : 'Minhas necessidades'}</h2><p className="mb-5 text-sm text-slate-600">{estabelecimento ? 'O saldo acompanha as quantidades confirmadas pelas duas organizações.' : 'Acompanhe os alimentos que sua instituição precisa receber.'} Publicações de teste separadas do catálogo público.</p><div className="grid gap-5 md:grid-cols-2">{estabelecimento ? minhasOfertas.map(oferta => <article key={oferta.id} className={painel}><Etiqueta status={oferta.status}/><h3 className="mt-4 text-xl font-bold">{oferta.titulo}</h3><p className="mt-2 text-sm text-slate-500">{oferta.local}</p>{oferta.itens.map((item, i) => <div key={item.nome} className="mt-4 border-t border-slate-100 pt-4"><p className="font-bold">{item.nome} · {kg(saldoPainel(dados, oferta.id, i))} disponíveis</p><p className="mt-1 text-sm text-slate-600">Quantidade inicial: {kg(item.quantidade)} · lote {item.lote}</p><p className="mt-1 text-sm text-slate-600">Validade: {item.validade.split('-').reverse().join('/')} · {item.conservacao}</p></div>)}<button className={`${botao} mt-5`} onClick={() => { setFiltro('TODAS'); setAba('negociacoes') }}>Acompanhar solicitações</button></article>) : minhasNecessidades.map(item => <article key={item.id} className={painel}><Etiqueta status={item.status}/><h3 className="mt-4 text-xl font-bold">{item.titulo}</h3><p className="mt-2 text-sm text-slate-600">{item.descricao}</p><p className="mt-3 text-sm">Campanha: {item.campanha || 'Sem campanha'}</p>{item.itens.map(alimento => <p key={alimento.nome} className="mt-4 border-t border-slate-100 pt-4 font-bold">{alimento.nome} · {kg(alimento.quantidade)} desejados</p>)}<button className={`${botao} mt-5`} onClick={() => { setFiltro('TODAS'); setAba('negociacoes') }}>Acompanhar minhas solicitações</button></article>)}</div>{!(estabelecimento ? minhasOfertas.length : minhasNecessidades.length) && <p className={painel}>Sua organização ainda não tem publicações.</p>}</section>}
        {aba === 'negociacoes' && <section aria-labelledby="titulo-negociacoes"><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><h2 id="titulo-negociacoes" className="text-xl font-bold">{estabelecimento ? 'Solicitações recebidas' : 'Minhas solicitações'}</h2><p className="mt-2 text-sm text-slate-600">O histórico registra quem atualizou e quando. Contato externo não altera o status automaticamente.</p></div><label className="text-sm font-bold">Filtrar por status<select className={campo} value={filtro} onChange={evento => setFiltro(evento.target.value)}>{['TODAS', 'PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CONCLUIDA_PARCIAL', 'CANCELADA', 'RECUSADA'].map(status => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select></label></div><div className="grid items-start gap-5 lg:grid-cols-2">{filtradas.map(pedido => <NegociacaoPainel key={`${organizacaoId}-${pedido.id}`} pedido={pedido} dados={dados} organizacaoId={organizacaoId} atualizar={atualizar}/>)}</div>{!filtradas.length && <p className={painel}>Nenhuma solicitação encontrada para este filtro.</p>}</section>}
      </> : <p className={painel}>{organizacao.ativa ? 'Seu cadastro aguarda aprovação administrativa.' : 'Esta organização está inativa e não pode acessar o painel.'}</p>)}
    </main>
  </MainLayout>
}
