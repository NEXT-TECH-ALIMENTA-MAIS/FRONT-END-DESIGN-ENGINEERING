import { useEffect, useState, type FormEvent } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, PackageCheck, Search } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { botao, campo, Etiqueta, painel } from '../../components/Interface/Interface'
import { kg } from '../../data/calculos'
import { listarNecessidadesApi, listarOfertasApi, listarOrganizacoes, solicitarOfertaApi, type NecessidadeApi, type OfertaApi, type OrganizacaoApi } from '../../services/painelApi'

export function PublicacoesApi({ tipo }: { tipo: 'ofertas' | 'necessidades' }) {
  const { id } = useParams()
  const [parametros, setParametros] = useSearchParams()
  const [lista, setLista] = useState<(OfertaApi | NecessidadeApi)[]>([])
  const [organizacoes, setOrganizacoes] = useState<OrganizacaoApi[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [instituicao, setInstituicao] = useState(0)
  const [quantidades, setQuantidades] = useState<Record<number, string>>({})
  const [tentativa, setTentativa] = useState(0)
  const [status, setStatus] = useState('TODOS')
  const [pagina, setPagina] = useState(0)

  useEffect(() => {
    let ativo = true
    Promise.all([tipo === 'ofertas' ? listarOfertasApi() : listarNecessidadesApi(), listarOrganizacoes()])
      .then(([publicacoes, orgs]) => { if (ativo) { setLista(publicacoes); setOrganizacoes(orgs); setErro('') } })
      .catch(falha => { if (ativo) setErro(falha.message) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [tipo, tentativa])

  function dono(item: OfertaApi | NecessidadeApi) {
    return organizacoes.find(org => org.id === ('organizacaoId' in item ? item.organizacaoId : item.instituicaoId))
  }
  const publicas = lista.filter(item => dono(item)?.statusConta === 'ATIVA' && dono(item)?.statusCadastro === 'APROVADO')
  const busca = parametros.get('busca') ?? ''
  const filtradas = publicas.filter(item => (status === 'TODOS' || item.status === status) && `${item.titulo} ${item.itens.map(alimento => alimento.alimento).join(' ')} ${dono(item)?.endereco ?? ''}`.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR')))
  const totalPaginas = Math.ceil(filtradas.length / 5)
  const paginaAtual = Math.min(pagina, Math.max(0, totalPaginas - 1))
  const itensDaPagina = filtradas.slice(paginaAtual * 5, paginaAtual * 5 + 5)
  const detalhe = publicas.find(item => item.id === Number(id))

  async function solicitar(evento: FormEvent) {
    evento.preventDefault()
    if (!detalhe || salvando) return
    setSalvando(true); setErro(''); setMensagem('')
    try {
      const itens = detalhe.itens.filter(item => Number(quantidades[item.id]) > 0).map(item => ({ itemOfertaId: item.id, quantidadeKg: Number(quantidades[item.id]) }))
      const criada = await solicitarOfertaApi(detalhe.id, instituicao, itens)
      setMensagem(`Solicitação #${criada.id} registrada pela API como ${criada.status}. Acompanhe no painel.`)
      setQuantidades({})
    } catch (falha) { setErro(falha instanceof Error ? falha.message : 'Não foi possível solicitar.') }
    finally { setSalvando(false) }
  }

  return <MainLayout><main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <h1 className="mb-5 font-display text-3xl font-extrabold text-navy">{id ? detalhe?.titulo ?? 'Detalhes da publicação' : tipo === 'ofertas' ? 'Ofertas de alimentos' : 'Necessidades das instituições'}</h1>
    {erro && <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">{erro}<button className="ml-3 underline" onClick={() => { setCarregando(true); setTentativa(tentativa + 1) }}>Consultar novamente</button></div>}
    {mensagem && <p role="status" className="mb-5 rounded-xl bg-green-50 p-4 text-green-800">{mensagem} <Link to="/painel" className="underline">Abrir painel</Link></p>}
    {carregando ? <p role="status">Consultando publicações…</p> : id ? detalhe ? <>
      <Link className="mb-5 inline-block text-bluebrand underline" to={`/${tipo}`}>Voltar à lista</Link>
      <div className="grid items-start gap-5 lg:grid-cols-2"><section className={painel}><Etiqueta status={detalhe.status}/><p className="my-4">{detalhe.descricao}</p>{detalhe.itens.map(item => <div key={item.id} className="mb-4 border-t border-slate-100 pt-4"><h2 className="font-bold">{item.alimento} · {kg('disponivelKg' in item ? item.disponivelKg : item.quantidadeKg)} {'disponivelKg' in item ? 'disponíveis' : 'desejados'}</h2>{'validade' in item && <p className="mt-2 text-sm text-slate-500">Lote: {item.lote || 'Não informado'} · validade: {item.validade || 'Não informada'} · {item.conservacao || 'Conservação não informada'}</p>}</div>)}</section>
      <section className={painel}><h2 className="text-xl font-bold">{dono(detalhe)?.nomeFantasia}</h2><p className="my-3">{dono(detalhe)?.endereco}</p><p className="break-words text-sm">{dono(detalhe)?.emailContato} · {dono(detalhe)?.telefone}</p>{dono(detalhe)?.emailContato && <a className={`${botao} mt-4`} href={`mailto:${dono(detalhe)?.emailContato}`}>Iniciar contato por e-mail</a>}<ol className="mt-5 list-decimal space-y-2 pl-5 text-sm"><li>Informe os alimentos e quantidades desejados.</li><li>Aguarde o estabelecimento e combine a retirada pelo contato informado.</li><li>Registre entrega e recebimento no painel após cada viagem.</li></ol></section></div>
      {tipo === 'ofertas' && detalhe.status !== 'FINALIZADO' && (import.meta.env.DEV ? <form onSubmit={solicitar} className={`${painel} mt-5`}><h2 className="text-xl font-bold">Solicitar alimentos</h2><p className="my-3 text-sm text-amber-900">Teste local de integração: escolher uma instituição não faz login. A solicitação será gravada pela API.</p><fieldset disabled={salvando} className="space-y-4"><label className="block text-sm font-bold">Instituição<select required className={campo} value={instituicao || ''} onChange={e => setInstituicao(Number(e.target.value))}><option value="">Selecione</option>{organizacoes.filter(org => org.tipo === 'INSTITUICAO' && org.statusConta === 'ATIVA' && org.statusCadastro === 'APROVADO').map(org => <option key={org.id} value={org.id}>{org.nomeFantasia}</option>)}</select></label>{detalhe.itens.map(item => <label key={item.id} className="block text-sm font-bold">{item.alimento} (kg)<input className={campo} type="number" min="0" max={item.quantidadeKg} step="0.001" value={quantidades[item.id] ?? ''} onChange={e => setQuantidades({ ...quantidades, [item.id]: e.target.value })}/></label>)}<button className={botao}>{salvando ? 'Enviando…' : 'Enviar solicitação'}</button></fieldset></form> : <p className={`${painel} mt-5`}>Solicitações pelo site aguardam a integração do login.</p>)}
    </> : !erro && <p className={painel}>Publicação não encontrada ou indisponível.</p> : <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-xl font-extrabold text-navy">{tipo === 'ofertas' ? 'Encontre alimentos para sua instituição' : 'Ajude instituições a realizar suas ações sociais'}</h2><p className="mt-1 text-sm text-slate-500">{tipo === 'ofertas' ? 'Explore as ofertas cadastradas por estabelecimentos.' : 'Explore as necessidades publicadas por instituições.'}</p></div><span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-bluebrand">Dados da API</span></div>
      <label className="relative block max-w-xl"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true"/><input className={`${campo} !mt-0 pl-10`} placeholder="Buscar alimento ou localização" value={busca} onChange={e => { setPagina(0); setParametros(e.target.value ? { busca: e.target.value } : {}) }} aria-label="Buscar publicações"/></label>
      <p className="mt-5 text-xs text-slate-500">Filtrar por status:</p><div className="mt-2 flex gap-2 overflow-x-auto pb-2" aria-label="Status das publicações">{['TODOS', 'DISPONIVEL', 'EM_ANDAMENTO', 'FINALIZADO'].map(opcao => <button key={opcao} type="button" onClick={() => { setPagina(0); setStatus(opcao) }} aria-pressed={status === opcao} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${status === opcao ? 'border-bluebrand bg-bluebrand text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-bluebrand hover:text-bluebrand'}`}>{opcao.replaceAll('_', ' ')}</button>)}</div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{itensDaPagina.map(item => <article key={item.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/8"><div className="flex h-43 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-5 text-center"><span className="font-display text-2xl font-extrabold text-bluebrand">{item.itens[0]?.alimento ?? (tipo === 'ofertas' ? 'Oferta' : 'Necessidade')}</span></div><div className="p-4 sm:p-5"><Etiqueta status={item.status}/><h3 className="mt-3 min-h-13 font-display text-base font-extrabold leading-snug text-navy">{item.titulo}</h3><p className="mt-1 text-sm text-slate-500">{dono(item)?.nomeFantasia ?? 'Organização'}</p><div className="my-4 h-px bg-slate-100"/><p className="flex items-center gap-2 text-xs text-slate-500"><MapPin size={15} className="shrink-0 text-bluebrand"/>{dono(item)?.endereco ?? 'Local não informado'}</p><p className="mt-2 flex items-start gap-2 text-xs text-slate-500"><PackageCheck size={15} className="mt-0.5 shrink-0 text-bluebrand"/><span>{item.itens.map(alimento => `${alimento.alimento}: ${kg('disponivelKg' in alimento ? alimento.disponivelKg : alimento.quantidadeKg)}`).join(' · ')}</span></p><Link to={`/${tipo}/${item.id}`} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-bluebrand hover:underline">Ver detalhes <ArrowUpRight size={17} aria-hidden="true"/></Link></div></article>)}</div>
      {!filtradas.length && !erro && <div className={`${painel} mt-5 text-center`}><p className="font-bold text-navy">Nenhuma publicação encontrada</p><p className="mt-1 text-sm text-slate-500">A API ainda não retornou publicações para este filtro.</p></div>}
      {totalPaginas > 1 && <nav className="mt-6 flex items-center justify-center gap-4" aria-label="Paginação das publicações"><button type="button" onClick={() => setPagina(Math.max(0, paginaAtual - 1))} disabled={paginaAtual === 0} aria-label="Página anterior" className="rounded-full border border-slate-200 bg-white p-2.5 text-navy disabled:opacity-40"><ChevronLeft size={20}/></button><span className="text-sm font-semibold text-slate-600">Página {paginaAtual + 1} de {totalPaginas}</span><button type="button" onClick={() => setPagina(Math.min(totalPaginas - 1, paginaAtual + 1))} disabled={paginaAtual === totalPaginas - 1} aria-label="Próxima página" className="rounded-full border border-slate-200 bg-white p-2.5 text-navy disabled:opacity-40"><ChevronRight size={20}/></button></nav>}
    </>}
  </main></MainLayout>
}
