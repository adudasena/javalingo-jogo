import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getState, setState } from '../lib/storage'

export default function Login(){
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(e){
    e.preventDefault()
    setState({ user: { name, email } })
    nav('/home')
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Javalingo</h1>
        <p className="small">Aprenda Java jogando! Faça login para começar.</p>
        <form onSubmit={handleSubmit} className="row">
          <input placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} required />
          <input placeholder="Seu e-mail" value={email} onChange={e=>setEmail(e.target.value)} required />
          <button className="btn">Entrar</button>
        </form>
        <hr/>
        <p className="small">Dica: no vídeo, mostre que o progresso fica salvo mesmo recarregando a página.</p>
      </div>
    </div>
  )
}
