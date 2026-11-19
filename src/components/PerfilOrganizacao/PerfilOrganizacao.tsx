import { useState, type FormEvent } from 'react'
import { Building2, Pencil } from 'lucide-react'
import type { PerfilCliente } from '../../data/painelCliente'
import { botao, campo, painel } from '../Interface/Interface'

type Props = { organizacao: PerfilCliente; salvar: (perfil: PerfilCliente) => boolean }

const campos = [
  { chave: 'nome', nome: 'Nome da organização', tipo: 'text' },
  { chave: 'cnpj', nome: 'CNPJ (14 dígitos)', tipo: 'text' },
  { chave: 'responsavel', nome: 'Responsável pelo contato', tipo: 'text' },
  { chave: 'email', nome: 'E-mail', tipo: 'email' },
  { chave: 'telefone', nome: 'Telefone', tipo: 'tel' },
  { chave: 'endereco', nome: 'Endereço e localização', tipo: 'text' },
] as const

export function PerfilOrganizacao({ organizacao, salvar }: Props) {
  const [editando, setEditando] = useState(false)
  const [formulario, setFormulario] = useState(organizacao)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (salvar(formulario)) setEditando(false)
  }

  return <section className={painel} aria-labelledby="titulo-perfil">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 id="titulo-perfil" className="flex items-center gap-2 text-xl font-bold text-navy"><Building2 aria-hidden="true" size={22}/> Dados da organização</h2>
      {!editando && <button className="flex items-center gap-2 text-sm font-bold text-bluebrand" onClick={() => { setFormulario(organizacao); setEditando(true) }}><Pencil size={16} aria-hidden="true"/> Editar informações</button>}
    </div>
    {editando ? <form onSubmit={enviar} className="grid gap-4 sm:grid-cols-2">
      {campos.map(item => <label key={item.chave} className="text-sm font-bold">{item.nome}
        <input required maxLength={item.chave === 'cnpj' ? 14 : 160} pattern={item.chave === 'cnpj' ? '[0-9]{14}' : undefined} type={item.tipo} className={campo} value={formulario[item.chave]} onChange={evento => setFormulario({ ...formulario, [item.chave]: evento.target.value })}/>
      </label>)}
      <label className="text-sm font-bold sm:col-span-2">Descrição da organização<textarea required maxLength={500} rows={3} className={campo} value={formulario.descricao} onChange={evento => setFormulario({ ...formulario, descricao: evento.target.value })}/></label>
      <p className="text-sm text-slate-500 sm:col-span-2">Tipo de organização e aprovação são dados administrativos e não podem ser alterados aqui.</p>
      <div className="flex flex-wrap gap-3 sm:col-span-2"><button className={botao}>Salvar informações</button><button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold" onClick={() => setEditando(false)}>Cancelar edição</button></div>
    </form> : <>
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{campos.map(item => <div key={item.chave} className="min-w-0"><dt className="text-sm text-slate-500">{item.nome}</dt><dd className="mt-1 break-words font-semibold">{organizacao[item.chave]}</dd></div>)}</dl>
      <p className="mt-6 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-600">{organizacao.descricao}</p>
    </>}
  </section>
}
