import { Link, useParams } from 'react-router-dom'
import { Pagina, painel } from '../../components/Interface/Interface'
import { kg } from '../../data/calculos'
import type { Estado } from '../../data/estado'

export function DetalheNecessidade({necessidades,orgs}:Estado){const {id}=useParams();const n=necessidades.find(x=>x.id===Number(id)&&orgs.some(o=>o.id===x.instituicao&&o.ativa));if(!n)return <Pagina titulo="Necessidade não encontrada"><Link to="/necessidades">Voltar</Link></Pagina>;const org=orgs.find(o=>o.id===n.instituicao);return <Pagina titulo={n.titulo}><div className={painel}><p>{n.descricao}</p><ul className="my-4 list-disc pl-5">{n.itens.map((i,k)=><li key={k}>{i.nome}: {kg(i.quantidade)}</li>)}</ul><p>Campanha: {n.campanha||'Não vinculada'}</p><p className="mt-3">{org?.nome} · {org?.email} · {org?.telefone}</p></div></Pagina>}
