import React, { useMemo, useState } from 'react'
import data from '../data/questions.json'
import QuestionCard from '../components/QuestionCard'
import { getState, setState } from '../lib/storage'
import { completeLevel } from '../state/progress.js'

function getQueryLevel() {
  const url = new URL(window.location.href)
  const n = Number(url.searchParams.get('level'))
  return Number.isFinite(n) && n >= 1 && n <= 50 ? n : 1
}

export default function Quiz() {
  const s = getState()
  const currentLevel = getQueryLevel()
  const user = s.user?.name || 'demo' // ✅ captura do usuário

  // pega as questões da fase atual; se faltar, completa com genéricas (sem levelId)
  const bank = useMemo(() => {
    const byLevel = data.filter(q => q.levelId === currentLevel)
    const fallback = data.filter(q => q.levelId == null)
    const mix = [...byLevel, ...fallback]
    return mix.slice(0, 5)
  }, [currentLevel])

  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [win, setWin] = useState(0)

  function onAnswer(i) {
    const q = bank[idx]
    const wasCorrect = i === q.answerIndex

    // recompensa só quando acerta
    if (wasCorrect) {
      const next = setState({
        coins: s.coins + (q.coins ?? 0),
        xp: s.xp + (q.xp ?? 10)
      })
      s.coins = next.coins; s.xp = next.xp
      setWin(w => w + 1)
    }

    const isLast = idx + 1 === bank.length
    if (!isLast) {
      setIdx(idx + 1)
      return
    }

    // regra de aprovação: 70% ou mais
    const finalWins = wasCorrect ? win + 1 : win
    const ratio = finalWins / bank.length
    const aprovado = ratio >= 0.7

    if (aprovado) {
      completeLevel(currentLevel, user) // ✅ passa o nome do usuário
    }
    setDone(true)
  }

  if (done) {
    const ratio = win / bank.length
    const aprovado = ratio >= 0.7

    return (
      <div className="container">
        <div className="card">
          <h2>Nível {currentLevel} {aprovado ? 'concluído!' : 'não concluído'}</h2>
          <p>Acertos: {win}/{bank.length} ({Math.round(ratio * 100)}%)</p>

          {aprovado ? (
            <>
<p className="small">Recompensas aplicadas. Próximo nível liberado 🎉</p>

<div className="javali-orbit-container">
  <div className="javali-orbit">
    <img
      src="/assets/javalingo-no-foguete.png"
      alt="Javali voando ao redor do botão"
      style={{ width: '100%', height: 'auto' }}
    />
  </div>
  <a className="btn-rocket" href={`/quiz?level=${currentLevel + 1}`}>
    🚀 Ir para o próximo nível
  </a>
</div>

<a className="btn btn-ghost" href="/missions" style={{ marginTop: 20 }}>
  Voltar às Missões
</a>
            </>
          ) : (
            <>
              <p className="small">É preciso atingir pelo menos 70% para liberar o próximo nível.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a className="btn" href={`/quiz?level=${currentLevel}`}>Tentar novamente</a>
                <a className="btn btn-ghost" href="/missions">Voltar às Missões</a>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card section-card">
        <h2>Jogar — Nível {currentLevel}</h2>
        <QuestionCard q={bank[idx]} onAnswer={onAnswer} />
        <p className="small">Pergunta {idx + 1} de {bank.length}</p>
      </div>
    </div>
  )
}
