import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { setState } from '../lib/storage'
import Mascot from '../components/Mascot'

export default function Signup(){
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')

  function handleSubmit(e){
    e.preventDefault()
    if (!name.trim()) return setErr('Informe seu nome.')
    if (!email.trim() || !email.includes('@')) return setErr('Informe um e‑mail válido.')
    if (pass.length < 6) return setErr('Senha precisa ter ao menos 6 caracteres.')
    if (pass !== confirm) return setErr('As senhas não conferem.')

    setState({ user:{ name: name.trim(), email: email.trim() }, coins:0, xp:0 })
    nav('/home')
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'20px auto'}}>
        <h1 className="header-title">Criar conta</h1>
        <div style={{display:'grid',placeItems:'center',margin:'14px 0 18px'}}>
          <div className="avatar"><Mascot skin="classic" size={140}/></div>
        </div>

        <form onSubmit={handleSubmit} className="input-row">
          {err && <p className="small" style={{color:'crimson',textAlign:'center',marginBottom:8}}>{err}</p>}
          <input className="input" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="E‑mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Senha (mín. 6)" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
          <input className="input" placeholder="Confirmar senha" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
          <button className="btn btn-primary btn-full btn-lg" disabled={!name.trim() || !email.trim() || !pass || !confirm}>Cadastrar</button>
          <p className="small" style={{textAlign:'center',marginTop:12}}>Já tem conta? <Link to="/login">Entrar</Link></p>
        </form>
      </div>
    </div>
  )
}
