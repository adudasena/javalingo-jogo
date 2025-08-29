import React from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import CoinCounter from '../components/CoinCounter'
import ProgressBar from '../components/ProgressBar'
import { getState } from '../lib/storage'
import { levelToLabel } from '../state/levels'

export default function Home() {
  const s = getState()
  const levelLabel = levelToLabel(s.level)
  const xpToNext = 100
  const pct = Math.min(100, Math.round(((s.xp ?? 0) % xpToNext) / xpToNext * 100))

  return (
    <div className="home-wrap">
      {/* HERO de página inteira */}
      <section className="home-hero card">
        <div className="home-hero-left">
          <h2>Bem-vindo(a), {s.user?.name || 'aluno(a)'}!</h2>
          <p className="small">Seu nível: <b>{levelLabel}</b></p>
          <div className="status-row">
            <CoinCounter coins={s.coins ?? 0} />
          </div>
        </div>

        <div className="home-hero-right">
          <Mascot skin={s.activeSkin} size={160} />
          <p className="small" style={{ textAlign: 'center' }}>
            {s.activeSkin === 'Ternin' ? 'Javali de Ternin' : 'Javali Clássico'}
          </p>
        </div>
      </section>

      {/* STATUS BAR */}
      <section className="status-bar card">
        <div className="status-items">
          <div className="status-item">
            <span className="label">Nível</span>
            <strong>{levelLabel}</strong>
          </div>

          <div className="status-item status-progress">
            <span className="label">Progresso</span>
            <ProgressBar value={pct} />
            <span className="small">{pct}% até o próximo nível</span>
          </div>

          <div className="status-item">
            <span className="label">Moedas</span>
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