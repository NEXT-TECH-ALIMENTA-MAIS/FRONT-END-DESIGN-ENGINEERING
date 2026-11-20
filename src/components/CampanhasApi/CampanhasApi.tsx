import { useEffect, useState, type FormEvent } from 'react'
import { consultarApi, enviarParaApi } from '../../services/api'
import { listarOrganizacoes, type OrganizacaoApi } from '../../services/painelApi'
import { botao, campo } from '../Interface/Interface'

type Alimento = { id: number; nome: string }
type Campanha = { id: number; nome: string }
type Meta = { alimentoId: number; quantidadeKg: number }

export function CampanhasApi() {
  const [instituicoes, setInstituicoes] = useState<OrganizacaoApi[]>([])
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [instituicaoId, setInstituicaoId] = useState('')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [alimentoId, setAlimentoId] = useState('')
  const [quantidadeKg, setQuantidadeKg] = useState('')
  const [metas, setMetas] = useState<Meta[]>([])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    let ativo = true
    Promise.all([listarOrganizacoes(), consultarApi<Alimento[]>('/api/alimentos')])
      .then(([organizacoes, listaAlimentos]) => {
        if (ativo) {
          setInstituicoes(organizacoes.filter(org =>
            org.tipo === 'INSTITUICAO' && org.statusConta === 'ATIVA' && org.statusCadastro === 'APROVADO'
          ))
          setAlimentos(listaAlimentos)
        }
      })
      .catch(falha => {
        if (ativo) setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar os dados da campanha.')
      })
    return () => { ativo = false }
  }, [])

  function adicionarMeta() {
    const id = Number(alimentoId)
    const quantidade = Number(quantidadeKg)
    if (!id || !Number.isFinite(quantidade) || quantidade <= 0 || metas.some(meta => meta.alimentoId === id)) return
    setMetas([...metas, { alimentoId: id, quantidadeKg: quantidade }])
    setAlimentoId('')
    setQuantidadeKg('')
    setErro('')
  }

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (salvando) return
    setErro('')
    setSucesso('')
    if (fim < inicio) { setErro('A data final deve ser igual ou posterior à inicial.'); return }
    if (!metas.length) { setErro('Adicione pelo menos uma meta de alimento.'); return }

    setSalvando(true)
    let campanhaCriada: Campanha | undefined
    try {
      campanhaCriada = await enviarParaApi<Campanha>('/api/campanhas', {
        instituicaoId: Number(instituicaoId), nome: nome.trim(), descricao: descricao.trim(), inicio, fim,
      })
      for (const meta of metas) {
        await enviarParaApi(`/api/campanhas/${campanhaCriada.id}/metas`, meta)
      }
      setSucesso(`Campanha “${campanhaCriada.nome}” cadastrada com ${metas.length} meta(s).`)
      setNome('')
      setDescricao('')
      setInicio('')
      setFim('')
      setMetas([])
    } catch (falha) {
      const motivo = falha instanceof Error ? falha.message : 'Não foi possível cadastrar a campanha.'
      setErro(campanhaCriada
        ? `A campanha #${campanhaCriada.id} foi criada, mas alguma meta não foi salva. ${motivo}`
        : motivo)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={cadastrar} className="mt-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">Instituição
          <select className={campo} value={instituicaoId} onChange={e => setInstituicaoId(e.target.value)} required>
            <option value="">Selecione a instituição</option>
            {instituicoes.map(org => <option key={org.id} value={org.id}>{org.nomeFantasia}</option>)}
          </select>
        </label>
        <label className="block text-sm font-bold">Nome da campanha
          <input className={campo} value={nome} onChange={e => setNome(e.target.value)} maxLength={150} required />
        </label>
      </div>
      <label className="block text-sm font-bold">Descrição e objetivo
        <textarea className={campo} value={descricao} onChange={e => setDescricao(e.target.value)} maxLength={1000} rows={2} required />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">Início
          <input className={campo} type="date" value={inicio} onChange={e => setInicio(e.target.value)} required />
        </label>
        <label className="block text-sm font-bold">Fim
          <input className={campo} type="date" value={fim} min={inicio || undefined} onChange={e => setFim(e.target.value)} required />
        </label>
      </div>
      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-bold">Metas de alimentos</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_9rem_auto] sm:items-end">
          <label className="block text-sm font-bold">Alimento
            <select className={campo} value={alimentoId} onChange={e => setAlimentoId(e.target.value)}>
              <option value="">Selecione</option>
              {alimentos.filter(alimento => !metas.some(meta => meta.alimentoId === alimento.id)).map(alimento =>
                <option key={alimento.id} value={alimento.id}>{alimento.nome}</option>
              )}
            </select>
          </label>
          <label className="block text-sm font-bold">Meta (kg)
            <input className={campo} type="number" min="0.001" step="0.001" value={quantidadeKg} onChange={e => setQuantidadeKg(e.target.value)} />
          </label>
          <button type="button" className={botao} onClick={adicionarMeta}>Adicionar meta</button>
        </div>
        {metas.map(meta => <div key={meta.alimentoId} className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span>{alimentos.find(item => item.id === meta.alimentoId)?.nome} · {meta.quantidadeKg} kg</span>
          <button type="button" className="font-bold text-red-700" onClick={() => setMetas(metas.filter(item => item.alimentoId !== meta.alimentoId))}>Remover</button>
        </div>)}
      </div>
      {erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}
      {sucesso && <p role="status" className="text-sm text-green-700">{sucesso}</p>}
      <button type="submit" disabled={salvando || !instituicoes.length} className={botao}>
        {salvando ? 'Cadastrando…' : 'Cadastrar campanha'}
      </button>
    </form>
  )
}
