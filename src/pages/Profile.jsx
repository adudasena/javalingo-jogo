import React from 'react'
import { getState, reset, setState } from '../lib/storage'
import ProgressBar from '../components/ProgressBar'
import Mascot from '../components/Mascot'

export default function Profile(){
  const s = getState()
  const xpToNext = 100
  const pct = Math.min(100, Math.round((s.xp % xpToNext) / xpToNext * 100))

  function simulateProgress(){
    // pequena simulação para o vídeo (mostra barra andando)
    setState({ xp: s.xp + 15 })
    location.reload()
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Perfil</h2>
        <div className="row">
          <Mascot skin={s.activeSkin} />
          <div>
            <p><b>{s.user?.name || 'Aluno(a)'}</b></p>
            <p className="small">Nível: {s.level || 'Indefinido'} | XP: {s.xp}</p>
            <ProgressBar value={pct} />
            <p className="small">Progresso até o próximo nível (simulado): {pct}%</p>
          </div>
        </div>
        <hr/>
        <div className="row">
          <button className="btn secondary" onClick={simulateProgress}>+15 XP (demo)</button>
          <button className="btn" onClick={()=>{ reset(); location.href='/' }}>Resetar tudo</button>
        </div>
      </div>
    </div>
  )
}
