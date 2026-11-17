import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CardOferta } from '../../components/CardOferta/CardOferta'
import { Etiqueta, Pagina, campo, painel } from '../../components/Interface/Interface'
import { kg, rotulo, saldo } from '../../data/calculos'
import { ofertas as ofertasIlustrativas } from '../../data/ofertas'
import type { Estado } from '../../data/estado'

const categorias = ['Todos', 'Frutas', 'Hortaliças', 'Padaria', 'Não perecíveis']
const ITENS_POR_PAGINA = 5

export function ListaOfertas({ ofertas, orgs, pedidos }: Estado) {
  const [parametros, setParametros] = useSearchParams()
  const busca = parametros.get('busca') || ''
  const setBusca = (valor: string) => {
    setPagina(0)
    setParametros(valor ? { busca: valor } : {})
  }
  const [categoria, setCategoria] = useState('Todos')
  const [pagina, setPagina] = useState(0)

  const resultados = useMemo(() => ofertasIlustrativas.filter(oferta => {
    const combinaCategoria = categoria === 'Todos' || oferta.categoria === categoria
    const texto = `${oferta.titulo} ${oferta.estabelecimento} ${oferta.localizacao} ${oferta.categoria}`.toLocaleLowerCase('pt-BR')
    return combinaCategoria && texto.includes(busca.toLocaleLowerCase('pt-BR'))
  }), [busca, categoria])

  const quantidadePaginas = Math.ceil(resultados.length / ITENS_POR_PAGINA)
  const paginaAtual = Math.min(pagina, Math.max(0, quantidadePaginas - 1))
  const itensDaPagina = resultados.slice(paginaAtual * ITENS_POR_PAGINA, (paginaAtual + 1) * ITENS_POR_PAGINA)
  const ofertasDaDemonstracao = ofertas.filter(oferta =>
    orgs.some(org => org.id === oferta.dono && org.ativa) &&
    `${oferta.titulo} ${oferta.local} ${oferta.itens.map(item => item.nome).join(' ')}`
      .toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR')),
  )

  const selecionarCategoria = (nome: string) => {
    setPagina(0)
    setCategoria(nome)
  }

  return <Pagina titulo="Ofertas de alimentos">
    <section aria-labelledby="titulo-ofertas">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="titulo-ofertas" className="font-display text-xl font-extrabold text-navy">Encontre alimentos para sua instituição</h2>
          <p className="mt-1 text-sm text-slate-500">Explore as ofertas ilustrativas da demonstração.</p>
        </div>
        <span className="w-fit rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-bluebrand">Dados fictícios</span>
      </div>

      <label className="relative mt-5 block max-w-xl">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input className={`${campo} !mt-0 pl-10`} placeholder="Buscar alimento ou localização" value={busca} onChange={e => setBusca(e.target.value)} aria-label="Buscar alimento ou localização" />
      </label>

      <p className="mt-5 text-xs text-slate-500">Filtrar os exemplos por categoria:</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-2" aria-label="Categorias de ofertas">
        {categorias.map(nome => <button key={nome} type="button" onClick={() => selecionarCategoria(nome)} aria-pressed={categoria === nome} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${categoria === nome ? 'border-bluebrand bg-bluebrand text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-bluebrand hover:text-bluebrand'}`}>{nome}</button>)}
      </div>

      {itensDaPagina.length ? <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {itensDaPagina.map(oferta => <CardOferta key={oferta.id} oferta={oferta} />)}
      </div> : <div className={`${painel} mt-5 text-center`}><p className="font-bold text-navy">Nenhuma oferta encontrada</p><p className="mt-1 text-sm text-slate-500">Tente buscar outro alimento ou selecione outra categoria.</p></div>}

      {quantidadePaginas > 1 && <nav className="mt-6 flex items-center justify-center gap-4" aria-label="Paginação das ofertas">
        <button type="button" onClick={() => setPagina(Math.max(0, paginaAtual - 1))} disabled={paginaAtual === 0} aria-label="Página anterior" className="rounded-full border border-slate-200 bg-white p-2.5 text-navy transition hover:border-bluebrand hover:text-bluebrand disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={20}/></button>
        <span className="text-sm font-semibold text-slate-600">Página {paginaAtual + 1} de {quantidadePaginas}</span>
        <button type="button" onClick={() => setPagina(Math.min(quantidadePaginas - 1, paginaAtual + 1))} disabled={paginaAtual === quantidadePaginas - 1} aria-label="Próxima página" className="rounded-full border border-slate-200 bg-white p-2.5 text-navy transition hover:border-bluebrand hover:text-bluebrand disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={20}/></button>
      </nav>}
      <p className="mt-4 text-center text-xs text-slate-500">Estas ofertas são exemplos visuais e não estão disponíveis para retirada.</p>
    </section>

    {ofertasDaDemonstracao.length > 0 && <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="font-display text-xl font-extrabold text-navy">Ofertas criadas nesta demonstração</h2>
      <p className="mt-1 text-sm text-slate-500">Essas ofertas são temporárias e desaparecem ao atualizar a página.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{ofertasDaDemonstracao.map(o => <article key={o.id} className={painel}>
        <Etiqueta status={o.status}/><h3 className="mt-3 text-lg font-bold text-navy">{o.titulo}</h3>
        <p className="mt-2 text-sm text-slate-500">{rotulo(orgs.find(x => x.id === o.dono))} · {o.local}</p>
        <p className="mt-3 text-sm">{o.itens.map((item, i) => `${item.nome}: ${kg(saldo(o, pedidos, i))} disponíveis`).join(' · ')}</p>
        <Link className="mt-4 inline-block font-bold text-bluebrand" to={`/ofertas/${o.id}`}>Ver detalhes →</Link>
      </article>)}</div>
    </section>}
  </Pagina>
}
