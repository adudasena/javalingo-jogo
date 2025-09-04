// src/pages/Signup.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { setState } from '../lib/storage'
import { Api } from '../lib/api'
import Mascot from '../components/Mascot'

export default function Signup(){
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setErr('')

    if (!name.trim()) return setErr('Informe seu nome.')
    if (!email.trim() || !email.includes('@')) return setErr('Informe um e-mail válido.')
    if (pass.length < 6) return setErr('Senha precisa ter ao menos 6 caracteres.')
    if (pass !== confirm) return setErr('As senhas não conferem.')

    try {
      // 🔗 chama o backend para cadastrar no SQLite
      const resp = await Api.post('/api/signup', { name, email, pass })
      const user = resp.user // { name, email }

      // garante que o pop-up do teste apareça para usuário novo
      try { localStorage.removeItem(`testeFeito_${user.name}`) } catch {}

      // cria sessão do app
      setState({ user, coins: 0, xp: 0, levelTestDone: false })

      nav('/home')
    } catch (e) {
      setErr(e.message || 'Não foi possível cadastrar.')
    }
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
          <input className="input" placeholder="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Senha (mín. 6)" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
          <input className="input" placeholder="Confirmar senha" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
          <button className="btn btn-primary btn-full btn-lg" disabled={!name.trim() || !email.trim() || !pass || !confirm}>Cadastrar</button>
          <p className="small" style={{textAlign:'center',marginTop:12}}>Já tem conta? <Link to="/login">Entrar</Link></p>
        </form>
      </div>
    </div>
  )
}
