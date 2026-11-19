import { useState, type FormEvent } from 'react'

export function Contato() {
  const [enviado, setEnviado] = useState(false)

  function enviarMensagem(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const formulario = evento.currentTarget
    const dados = new FormData(formulario)

    const nome = String(dados.get('nome') ?? '').trim()
    const email = String(dados.get('email') ?? '').trim()
    const assunto = String(dados.get('assunto') ?? '').trim()
    const mensagem = String(dados.get('mensagem') ?? '').trim()

    if (!nome || !email || !assunto || !mensagem) {
      setEnviado(false)
      return
    }

    // Simulação de envio: nenhum dado é enviado à API.
    formulario.reset()
    setEnviado(true)
  }
  return()}