import { apiConfigurada } from '../services/api'
import { PublicacoesApi } from './PublicacoesApi/PublicacoesApi'
import { useState } from 'react'
import { PerfilContext } from '../context/PerfilContext'
import { Link, Route, Routes } from 'react-router-dom'
import { Pagina } from '../components/Interface/Interface'
import { necessidadesIniciais, ofertasIniciais, organizacoesIniciais, pedidosIniciais } from '../services/dadosDemonstracao'
import { Home } from './Home/Home'
import { Faq } from './Faq/Faq'
import { Acesso } from './Acesso/Acesso'
import { Cadastro } from './Cadastro/Cadastro'
import { ListaOfertas } from './ListaOfertas/ListaOfertas'
import { DetalheOferta } from './DetalheOferta/DetalheOferta'
import { DetalheOfertaExemplo } from './DetalheOfertaExemplo/DetalheOfertaExemplo'
import { ListaNecessidades } from './ListaNecessidades/ListaNecessidades'
import { DetalheNecessidade } from './DetalheNecessidade/DetalheNecessidade'
import { PainelCliente } from './PainelCliente/PainelCliente'
import { EntradaPainel } from './EntradaPainel/EntradaPainel'
import { Painel } from './Painel/Painel'
import { Retiradas } from './Retiradas/Retiradas'
import { Sobre } from './Sobre/Sobre'
import { Contato } from './Contato/Contato'
import { PainelAdmin } from './PainelAdmin/PainelAdmin'
import { Integrantes } from './Integrantes/Integrantes'

export function Demonstracao() {
  const [orgs, setOrgs] = useState(organizacoesIniciais)
  const [ofertas, setOfertas] = useState(ofertasIniciais)
  const [pedidos, setPedidos] = useState(pedidosIniciais)
  const [necessidades, setNecessidades] = useState(necessidadesIniciais)
  const [perfil, setPerfil] = useState(0)

  const atual = orgs.find(o => o.id === perfil && o.ativa)

  const estado = {
    orgs, setOrgs,
    ofertas, setOfertas,
    pedidos, setPedidos,
    necessidades, setNecessidades,
    atual, setPerfil
  }

  return (
    <PerfilContext.Provider value={{ organizacao: atual, sair: () => setPerfil(0) }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/acesso" element={<Acesso {...estado} />} />
        <Route path="/admin" element={<PainelAdmin />} />
        <Route path="/cadastro" element={<Cadastro {...estado} />} />
        <Route path="/ofertas" element={apiConfigurada ? <PublicacoesApi key="ListaOfertas" tipo="ofertas" /> : <ListaOfertas {...estado} />} />
        <Route path="/ofertas/exemplo/:id" element={<DetalheOfertaExemplo />} />
        <Route path="/ofertas/:id" element={apiConfigurada ? <PublicacoesApi key="DetalheOferta" tipo="ofertas" /> : <DetalheOferta {...estado} />} />
        <Route path="/necessidades" element={apiConfigurada ? <PublicacoesApi key="ListaNecessidades" tipo="necessidades" /> : <ListaNecessidades {...estado} />} />
        <Route path="/necessidades/:id" element={apiConfigurada ? <PublicacoesApi key="DetalheNecessidade" tipo="necessidades" /> : <DetalheNecessidade {...estado} />} />
        <Route path="/painel/:tipo" element={<PainelCliente />} />
        <Route path="/painel" element={<EntradaPainel />} />
        <Route path="/demonstracao/painel" element={<Painel {...estado} />} />
        <Route path="/retiradas/:id" element={<Retiradas {...estado} />} />
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
  )
}