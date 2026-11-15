import { campo } from '../Interface/Interface'

export const textoCampo = (nome: string, valor: string, alterar: (valor: string) => void, tipo = 'text') => <label className="block text-sm font-bold text-navy">{nome}<input className={campo} type={tipo} value={valor} onChange={e=>alterar(e.target.value)} required /></label>
