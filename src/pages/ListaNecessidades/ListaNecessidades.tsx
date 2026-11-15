import { Link } from 'react-router-dom'
import { Pagina, painel } from '../../components/Interface/Interface'
import { kg, rotulo } from '../../data/calculos'
import type { Estado } from '../../data/estado'

export function ListaNecessidades({necessidades,orgs}:Estado){const lista=necessidades.filter(n=>orgs.some(o=>o.id===n.instituicao&&o.ativa));return <Pagina titulo="Necessidades das instituições">{lista.length?<div className="grid gap-4 md:grid-cols-2">{lista.map(n=><div className={painel} key={n.id}><h2 className="text-lg font-bold">{n.titulo}</h2><p className="my-2 text-sm text-slate-500">{rotulo(orgs.find(o=>o.id===n.instituicao))}</p><p>{n.itens.map(i=>`${i.nome}: ${kg(i.quantidade)}`).join(' · ')}</p><Link className="mt-4 inline-block font-bold text-bluebrand" to={`/necessidades/${n.id}`}>Ver detalhes →</Link></div>)}</div>:<p className={painel}>Ainda não há necessidades publicadas nesta demonstração.</p>}</Pagina>}
