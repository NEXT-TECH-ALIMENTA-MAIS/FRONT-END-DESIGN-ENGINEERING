import { useState } from 'react'
import { PerfilContext } from '../context/PerfilContext'
import { Link, Route, Routes } from 'react-router-dom'
import { Pagina } from '../components/Interface/Interface'
import { necessidadesIniciais, ofertasIniciais, organizacoesIniciais, pedidosIniciais } from '../services/dadosDemonstracao'
import { Home } from './Home/Home'
import { Acesso } from './Acesso/Acesso'
import { Cadastro } from './Cadastro/Cadastro'
import { ListaOfertas } from './ListaOfertas/ListaOfertas'
import { DetalheOferta } from './DetalheOferta/DetalheOferta'
import { DetalheOfertaExemplo } from './DetalheOfertaExemplo/DetalheOfertaExemplo'
import { ListaNecessidades } from './ListaNecessidades/ListaNecessidades'
import { DetalheNecessidade } from './DetalheNecessidade/DetalheNecessidade'
import { Painel } from './Painel/Painel'
import { Retiradas } from './Retiradas/Retiradas'
import { Sobre } from './Sobre/Sobre'

export function Demonstracao() {
  const [orgs, setOrgs] = useState(organizacoesIniciais)
  const [ofertas, setOfertas] = useState(ofertasIniciais)
  const [pedidos, setPedidos] = useState(pedidosIniciais)
  const [necessidades, setNecessidades] = useState(necessidadesIniciais)
  const [perfil, setPerfil] = useState(0)
  const atual = orgs.find(o => o.id === perfil && o.ativa)
  const estado = { orgs, setOrgs, ofertas, setOfertas, pedidos, setPedidos, necessidades, setNecessidades, atual, setPerfil }
  
  return (
    <PerfilContext.Provider value={atual}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acesso" element={<Acesso {...estado} />} />
        <Route path="/cadastro" element={<Cadastro {...estado} />} />
        <Route path="/ofertas" element={<ListaOfertas {...estado} />} />
        <Route path="/ofertas/exemplo/:id" element={<DetalheOfertaExemplo />} />
        <Route path="/ofertas/:id" element={<DetalheOferta {...estado} />} />
        <Route path="/necessidades" element={<ListaNecessidades {...estado} />} />
        <Route path="/necessidades/:id" element={<DetalheNecessidade {...estado} />} />
        <Route path="/painel" element={<Painel {...estado} />} />
        <Route path="/retiradas/:id" element={<Retiradas {...estado} />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route
          path="*"
          element={
            <Pagina titulo="Página não encontrada">
              <Link to="/">Voltar ao início</Link>
            </Pagina>
          }
        />
      </Routes>
    </PerfilContext.Provider>
  );
}

