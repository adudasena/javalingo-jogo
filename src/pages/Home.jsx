import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import CoinCounter from '../components/CoinCounter'
import ProgressBar from '../components/ProgressBar'
import { getState } from '../lib/storage'
import { levelToLabel } from '../state/levels'
import NivelamentoPopup from '../components/NivelamentoPopup'
import '../NivelamentoPopup.css'

export default function Home() {
  const s = getState()
  const levelLabel = levelToLabel(s.level)
  const xpToNext = 100
  const pct = Math.min(100, Math.round(((s.xp ?? 0) % xpToNext) / xpToNext * 100))

  const slogan = 'Aprender Java nunca foi tão divertido!'
  const hasLevel = s.level !== 'indefinido'

  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const username = s.user?.name || 'demo'
    const testeFeito = localStorage.getItem(`testeFeito_${username}`)
    if (!testeFeito) {
      setShowPopup(true)
    }
  }, [])

  if (showPopup) {
    return <NivelamentoPopup user={s.user?.name || 'demo'} onClose={() => setShowPopup(false)} />
  }

  return (
    <div className="home-wrap" style={{
      background: 'radial-gradient(circle at center, #004000 0%, #011d01ff 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Slogan + Nome */}
      <section className="slogan card" style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#bbf7d0'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
          Bem-vindo(a), {s.user?.name || 'aluno(a)'}!
        </h1>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{slogan}</p>
      </section>

      {/* HERO com mascote e status */}
      <section className="home-hero card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div className="home-hero-left">
          <p className="small">Seu nível: <b>{levelLabel}</b></p>
          <div className="status-row">
            <CoinCounter coins={s.coins ?? 0} />
          </div>
        </div>

        <div className="home-hero-right" style={{ textAlign: 'center' }}>
          <Mascot skin={s.activeSkin} size={160} />
          <p className="small">
            {s.activeSkin === 'Ternin' ? 'Javali de Ternin' : 'Javali Clássico'}
          </p>
        </div>
      </section>

      {/* STATUS BAR */}
      <section className="status-bar card" style={{ marginTop: '20px' }}>
        <div className="status-items">
          <div className="status-item">
            <span className="label">Nível</span>
            <strong>{levelLabel}</strong>
          </div>

          {hasLevel && (
            <div className="status-item status-progress">
              <span className="label">Progresso</span>
              <ProgressBar value={pct} />
              <span className="small">{pct}% até o próximo nível</span>
            </div>
          )}

          <div className="status-item">
            <span className="label">JavaCoins</span>
            <CoinCounter coins={s.coins ?? 0} />
          </div>

          <div className="status-actions">
            <Link className="btn btn-accent" to="/missions">Jogar</Link>
            <Link className="btn btn-ghost" to="/shop">Loja</Link>
            <Link className="btn btn-ghost" to="/profile">Perfil</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
