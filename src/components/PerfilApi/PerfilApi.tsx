import { useState, type FormEvent } from 'react'
import { botao, campo, painel } from '../Interface/Interface'
import type { OrganizacaoApi, PerfilApi as DadosPerfil } from '../../services/painelApi'

type Props = { organizacao: OrganizacaoApi; salvar: (perfil: DadosPerfil) => Promise<boolean>; ocupado: boolean }
export function PerfilApi({ organizacao, salvar, ocupado }: Props) {
  const [editando, setEditando] = useState(false)
  const [dados, setDados] = useState<DadosPerfil>(organizacao)
  const campos = [
    { chave: 'razaoSocial', nome: 'Razão social', tipo: 'text' },
    { chave: 'nomeFantasia', nome: 'Nome fantasia', tipo: 'text' },
    { chave: 'emailContato', nome: 'E-mail', tipo: 'email' },
    { chave: 'telefone', nome: 'Telefone', tipo: 'tel' },
    { chave: 'endereco', nome: 'Endereço', tipo: 'text' },
  ] as const
  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (await salvar(dados)) setEditando(false)
  }
  return <section className={painel}>
    <div className="mb-5 flex flex-wrap justify-between gap-3"><h2 className="text-xl font-bold">Minha organização</h2>{!editando && import.meta.env.DEV && <button className={botao} onClick={() => { setDados(organizacao); setEditando(true) }}>Editar informações</button>}</div>
    <p className="mb-5 text-sm text-slate-500">CNPJ: {organizacao.cnpj} · {organizacao.tipo} · {organizacao.statusCadastro}</p>
    {editando ? <form onSubmit={enviar}><fieldset disabled={ocupado} className="grid gap-4 sm:grid-cols-2">
      {campos.map(item => <label className="text-sm font-bold" key={item.chave}>{item.nome}<input className={campo} type={item.tipo} required={item.chave !== 'telefone'} maxLength={item.chave === 'endereco' ? 250 : item.chave === 'telefone' ? 20 : 160} value={dados[item.chave] ?? ''} onChange={e => setDados({ ...dados, [item.chave]: e.target.value })}/></label>)}
      <div className="flex gap-3 sm:col-span-2"><button className={botao}>{ocupado ? 'Salvando…' : 'Salvar na API'}</button><button type="button" onClick={() => setEditando(false)}>Cancelar</button></div>
    </fieldset></form> : <dl className="grid gap-5 sm:grid-cols-2">{campos.map(item => <div key={item.chave} className="min-w-0"><dt className="text-sm text-slate-500">{item.nome}</dt><dd className="break-words font-semibold">{organizacao[item.chave] || 'Não informado'}</dd></div>)}</dl>}
  </section>
}
