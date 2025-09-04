// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getState, setState } from '../lib/storage'
import Mascot from '../components/Mascot'
import BackgroundFX from '../components/BackgroundFX'
import { Api } from '../lib/api'   // <- usa a API http://localhost:4000

export default function Login(){
  const nav = useNavigate()
  const [nameOrEmail, setNameOrEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setErr('')

    if (!nameOrEmail.trim()) return setErr('Por favor, informe o usuário ou e-mail!')
    if (!pass) return setErr('Por favor, informe a senha!')

    try {
      // chama o backend Node+SQLite
      const data = await Api.post('/api/login', { nameOrEmail, pass })
      const user = data.user

      // Se o teste ainda não foi concluído no estado atual, garante que o pop-up volte a aparecer
      const prev = getState()
      if (!prev.levelTestDone) {
        try { localStorage.removeItem(`testeFeito_${user.name}`) } catch {}
      }

      // cria sessão do app
      setState({ user, coins: 0, xp: 0 })
      nav('/home')
    } catch (e) {
      setErr(e.message || 'Não foi possível entrar.')
    }
  }

  return (
    <div className="page login-page">
      {/* Fundo animado especial para login */}
      <BackgroundFX variant="login" />

      <div className="container">
        <div className="card login-card" style={{maxWidth:420, margin:'40px auto'}}>
          <h1 className="header-title" style={{textAlign:'center'}}>JavaLingo</h1>

          <div style={{display:'grid',placeItems:'center',margin:'18px 0 22px'}}>
            <div className="avatar"><Mascot skin="classic" size={160}/></div>
          </div>

          <form onSubmit={handleSubmit} className="input-row">
            {err && (
              <p className="small" style={{color:'crimson',textAlign:'center',marginBottom:8}}>
                {err}
              </p>
            )}

            <input
              className="input"
              placeholder="Usuário ou e-mail"
              value={nameOrEmail}
              onChange={e=>setNameOrEmail(e.target.value)}
            />

            <input
              className="input"
              placeholder="Senha"
              type="password"
              value={pass}
              onChange={e=>setPass(e.target.value)}
            />

            <button
              className="btn btn-accent btn-full btn-lg"
              type="submit"
              disabled={!nameOrEmail.trim() || !pass}
            >
              Entrar
            </button>

            <p className="small" style={{textAlign:'center', marginTop:10}}>
              <Link to="/signup" className="btn btn-ghost" style={{display:'inline-block', padding:'6px 10px'}}>
                Cadastrar-se
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
