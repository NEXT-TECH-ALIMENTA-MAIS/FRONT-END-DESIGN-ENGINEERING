import { useState, type FormEvent } from 'react'
import { Pagina, Mensagem, botao, campo, painel } from '../../components/Interface/Interface'
import type { Papel } from '../../data/modelos'
import { textoCampo } from '../../components/Formulario/Formulario'
import type { Estado } from '../../data/estado'
import { novoId } from '../../data/calculos'

export function Cadastro({orgs,setOrgs}: Estado) {
 const [nome,setNome]=useState('');const [email,setEmail]=useState('');const [telefone,setTelefone]=useState('');const [cnpj,setCnpj]=useState('');const [papel,setPapel]=useState<Papel>('ESTABELECIMENTO');const [mensagem,setMensagem]=useState('')
 function enviar(e:FormEvent){e.preventDefault();const numero=cnpj.replace(/\D/g,'');if(numero.length!==14){setMensagem('Informe um CNPJ com 14 dígitos.');return}if(orgs.some(o=>o.cnpj===numero||o.email.toLowerCase()===email.toLowerCase())){setMensagem('CNPJ ou e-mail já cadastrado na demonstração.');return}setOrgs([...orgs,{id:novoId(),nome,email,telefone,cnpj:numero,papel,aprovada:false,ativa:true}]);setMensagem('Cadastro fictício criado. Aguardando aprovação do administrador.');setNome('');setEmail('');setTelefone('');setCnpj('')}
 return <Pagina titulo="Cadastro de organização"><Mensagem texto={mensagem}/><form onSubmit={enviar} className={`${painel} max-w-xl space-y-4`}><label className="block text-sm font-bold">Tipo de organização<select className={campo} value={papel} onChange={e=>setPapel(e.target.value as Papel)}><option value="ESTABELECIMENTO">Estabelecimento</option><option value="INSTITUICAO">Instituição</option></select></label>{textoCampo('Nome da organização',nome,setNome)}{textoCampo('CNPJ',cnpj,setCnpj)}{textoCampo('E-mail',email,setEmail,'email')}{textoCampo('Telefone',telefone,setTelefone,'tel')}<button className={botao}>Cadastrar na demonstração</button><p className="text-xs text-slate-500">A aprovação é simulada no painel administrativo. Não informe dados reais.</p></form></Pagina>
}
