import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { botao, campo, Etiqueta, painel } from '../../components/Interface/Interface'
import { PerfilApi } from '../../components/PerfilApi/PerfilApi'
import { NegociacaoApi } from '../../components/NegociacaoApi/NegociacaoApi'
import { AlimentosApi } from '../../components/AlimentosApi/AlimentosApi'
import { carregarPainelApi, salvarPerfilApi, type DadosApi, type PerfilApi as DadosPerfil } from '../../services/painelApi'
import { kg } from '../../data/calculos'

export function PainelApi() {
  const [dados, setDados] = useState<DadosApi | null>(null)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [organizacaoId, setOrganizacaoId] = useState(0)
  const [aba, setAba] = useState('perfil')
  const [filtro, setFiltro] = useState('TODAS')

  useEffect(() => {
    let ativo = true
    carregarPainelApi().then(resultado => { if (ativo) setDados(resultado) })
      .catch(falha => { if (ativo) setErro(falha.message) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [])

  async function atualizar() {
    const resultado = await carregarPainelApi()
    setDados(resultado)
  }
  async function recarregar() {
    setCarregando(true); setErro('')
    try { await atualizar() }
    catch (falha) { setErro(falha instanceof Error ? falha.message : 'Falha ao consultar a API.') }
    finally { setCarregando(false) }
  }
  async function salvar(perfil: DadosPerfil) {
    setSalvando(true); setErro(''); setMensagem('')
    try {
      const atualizada = await salvarPerfilApi(organizacaoId, {
        razaoSocial: perfil.razaoSocial.trim(), nomeFantasia: perfil.nomeFantasia.trim(),
        emailContato: perfil.emailContato.trim(), telefone: perfil.telefone?.trim() ?? '', endereco: perfil.endereco.trim(),
      })
      setDados(anterior => anterior ? { ...anterior, organizacoes: anterior.organizacoes.map(item => item.id === atualizada.id ? atualizada : item) } : anterior)
      setMensagem('Informações atualizadas pela API.')
      return true
    } catch (falha) { setErro(falha instanceof Error ? falha.message : 'Não foi possível salvar.'); return false }
    finally { setSalvando(false) }
  }

  const organizacao = dados?.organizacoes.find(item => item.id === organizacaoId)
  const estabelecimento = organizacao?.tipo === 'ESTABELECIMENTO'
  const minhasOfertas = dados?.ofertas.filter(item => item.organizacaoId === organizacaoId) ?? []
  const necessidades = dados?.necessidades.filter(item => item.instituicaoId === organizacaoId) ?? []
  const pedidos = dados?.solicitacoes.filter(item => estabelecimento ? minhasOfertas.some(oferta => oferta.id === item.ofertaId) : item.instituicaoId === organizacaoId) ?? []
  const filtrados = pedidos.filter(item => filtro === 'TODAS' || item.status === filtro)

  return <MainLayout><main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="font-display text-3xl font-extrabold text-navy">Painel da organização</h1><button className={botao} disabled={carregando || salvando} onClick={recarregar}>{carregando ? 'Atualizando…' : 'Atualizar dados'}</button></div>
    <p className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">Integração em validação: os dados abaixo vêm da API. A seleção de organização não é login. {import.meta.env.DEV ? 'Neste ambiente local, alterações são enviadas ao banco pela API.' : 'As alterações pelo painel aguardam autenticação no backend e estão desabilitadas nesta versão publicada.'}</p>
    {erro && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">{erro}</p>}
    {mensagem && <p role="status" className="mb-5 rounded-xl bg-green-50 p-4 text-green-800">{mensagem}</p>}
    {carregando && <p role="status" className="mb-5">Consultando organizações e negociações…</p>}
    {dados && <>
      <label className="mb-6 block max-w-lg text-sm font-bold">Organização para validar a integração<select className={campo} value={organizacaoId} disabled={salvando || carregando} onChange={e => { setOrganizacaoId(Number(e.target.value)); setMensagem(''); setAba('perfil') }}><option value={0}>Selecione uma organização</option>{dados.organizacoes.filter(item => item.statusConta === 'ATIVA').map(item => <option key={item.id} value={item.id}>{item.nomeFantasia} · {item.tipo}</option>)}</select></label>
      {!dados.organizacoes.some(item => item.statusConta === 'ATIVA') && <div className={painel}><p>Nenhuma organização ativa foi retornada pela API.</p><Link className="mt-3 inline-block font-bold text-bluebrand" to="/cadastro">Cadastrar organização</Link></div>}
      {organizacao && (organizacao.statusConta !== 'ATIVA' || organizacao.statusCadastro !== 'APROVADO' ? <p className={painel}>O painel requer uma organização ativa com cadastro aprovado.</p> : <>
        <h2 className="mb-5 text-xl font-bold text-navy">{organizacao.nomeFantasia}</h2>
        <nav className="mb-5 flex flex-wrap gap-3" aria-label="Seções do painel">{[{ id: 'perfil', texto: 'Minha organização' }, { id: 'publicacoes', texto: 'Minhas publicações' }, { id: 'negociacoes', texto: `Negociações (${pedidos.length})` }].map(item => <button key={item.id} disabled={salvando} aria-pressed={aba === item.id} className={`${botao} ${aba === item.id ? 'bg-navy' : ''}`} onClick={() => setAba(item.id)}>{item.texto}</button>)}</nav>
        {aba === 'perfil' && <PerfilApi key={organizacaoId} organizacao={organizacao} salvar={salvar} ocupado={salvando}/>}
        {aba === 'publicacoes' && <div className="grid gap-5 md:grid-cols-2">{estabelecimento ? minhasOfertas.map(oferta => <article key={oferta.id} className={painel}><Etiqueta status={oferta.status}/><h3 className="mt-3 text-xl font-bold">{oferta.titulo}</h3><p className="mt-2 text-sm">{oferta.descricao}</p>{oferta.itens.map(item => <div key={item.id} className="mt-4 border-t border-slate-100 pt-3"><p className="font-bold">{item.alimento} · {kg(item.disponivelKg)} disponíveis</p><p className="mt-2 text-sm text-slate-500">Lote: {item.lote || 'Não informado'} · validade: {item.validade || 'Não informada'}</p><p className="text-sm text-slate-500">{item.conservacao || 'Conservação não informada'}</p></div>)}</article>) : necessidades.map(item => <article key={item.id} className={painel}><Etiqueta status={item.status}/><h3 className="mt-3 text-xl font-bold">{item.titulo}</h3><p className="mt-2">{item.descricao}</p>{item.itens.map(alimento => <p className="mt-3" key={alimento.id}>{alimento.alimento} · {kg(alimento.quantidadeKg)} desejados</p>)}</article>)}{!(estabelecimento ? minhasOfertas.length : necessidades.length) && <p className={painel}>Nenhuma publicação desta organização.</p>}</div>}
        {aba === 'negociacoes' && <><label className="mb-5 block max-w-sm text-sm font-bold">Status<select className={campo} value={filtro} onChange={e => setFiltro(e.target.value)}>{['TODAS', 'PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CONCLUIDA_PARCIAL', 'CANCELADA', 'RECUSADA'].map(item => <option key={item}>{item}</option>)}</select></label><div className="grid items-start gap-5 lg:grid-cols-2">{filtrados.map(pedido => <NegociacaoApi key={`${organizacaoId}-${pedido.id}`} pedido={pedido} dados={dados} organizacaoId={organizacaoId} atualizar={atualizar}/>)}</div>{!filtrados.length && <p className={painel}>Nenhuma negociação para este filtro.</p>}</>}
      </>)}
    </>}
    {import.meta.env.DEV && <AlimentosApi/>}
  </main></MainLayout>
}
