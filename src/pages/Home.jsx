import React from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import CoinCounter from '../components/CoinCounter'
import { getState } from '../lib/storage'

export default function Home(){
  const s = getState()
  return (
    <div className="container">
      <div className="nav">
        <Link to="/home">Início</Link>
        <Link to="/leveltest">Teste</Link>
        <Link to="/quiz">Jogar</Link>
        <Link to="/shop">Loja</Link>
        <Link to="/profile">Perfil</Link>
      </div>
      <div className="card">
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>
            <h2>Bem-vindo(a), {s.user?.name || 'aluno(a)'}!</h2>
            <p className="small">Seu nível: <b>{s.level || 'Indefinido'}</b></p>
            <CoinCounter coins={s.coins} />
          </div>
          <Mascot skin={s.activeSkin} size={100} />
        </div>
        <hr/>
        <div className="row">
          <Link className="btn" to="/leveltest">Fazer teste de nivelamento</Link>
          <Link className="btn secondary" to="/quiz">Jogar 1ª fase</Link>
          <Link className="btn secondary" to="/shop">Abrir loja</Link>
          <Link className="btn secondary" to="/profile">Ver perfil</Link>
        </div>
      </div>
    </div>
  )
}
