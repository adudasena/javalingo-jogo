import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { setState } from '../lib/storage'
import Mascot from '../components/Mascot'
import BackgroundFX from '../components/BackgroundFX'

// "Banco" local (mock) — apenas para demo/estudo
const USERS_KEY = 'javalingo_users'

// util: carregar/salvar usuários no localStorage
function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function saveUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list))
}

export default function Login(){
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  // (opcional) semear um usuário demo na 1ª execução
  useEffect(() => {
    const users = loadUsers()
    if (users.length === 0) {
      users.push({ name: 'demo', email: 'demo@unifil', pass: '123456' })
      saveUsers(users)
    }
  }, [])

  function handleSubmit(e){
    e.preventDefault()
    setErr('')

    // validações básicas
    if (!name.trim()) {
      setErr('Por favor, informe o usuário!')
      return
    }
    if (!pass) {
      setErr('Por favor, informe a senha!')
      return
    }

    // autenticação no "banco" local
    const users = loadUsers()
    const user = users.find(u =>
      u.name.toLowerCase() === name.trim().toLowerCase() && u.pass === pass
    )

    if (!user) {
      setErr('Usuário ou senha inválidos!')
      return
    }

    // login ok: salva sessão no storage global do app e navega
    setState({
      user: { name: user.name, email: user.email },
      coins: 0,
      xp: 0
    })
    nav('/home')
  }

  return (
    <div className="page login-page">
      {/* Fundo animado especial para login */}
      <BackgroundFX variant="login" />

      <div className="container">
        <div className="card login-card" style={{maxWidth:420, margin:'40px auto'}}>
          <h1 className="header-title" style={{textAlign:'center'}}>JavaLingo</h1>

          <div style={{display:'grid',placeItems:'center',margin:'18px 0 22px'}}>
            <div className="avatar">
              <Mascot skin="classic" size={160}/>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="input-row">
            {err && (
              <p className="small" style={{color:'crimson',textAlign:'center',marginBottom:8}}>
                {err}
              </p>
            )}

            <input
              className="input"
              placeholder="Usuário"
              value={name}
              onChange={e=>setName(e.target.value)}
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
              disabled={!name.trim() || !pass}
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
