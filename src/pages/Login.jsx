import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { setState } from '../lib/storage'
import Mascot from '../components/Mascot'

export default function Login(){
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')

  function handleSubmit(e){
    e.preventDefault()
    if(!name.trim()) return
    setState({ user:{ name, email:`${name}@demo` }, coins:0, xp:0 })
    nav('/home')
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'20px auto'}}>
        <h1 className="header-title">JavaLingo</h1>

        <div style={{display:'grid',placeItems:'center',margin:'14px 0 18px'}}>
          <div className="avatar">
            <Mascot skin="classic" size={160}/>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="input-row">
          <input className="input" placeholder="Usuário" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Senha" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
          <button className="btn btn-primary btn-full btn-lg">Login</button>
          <p className="small" style={{textAlign:'center'}}>Cadastrar-se</p>
        </form>
      </div>
    </div>
  )
}
