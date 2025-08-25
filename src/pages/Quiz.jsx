import React, { useMemo, useState } from 'react'
import data from '../data/questions.json'
import QuestionCard from '../components/QuestionCard'
import { getState, setState } from '../lib/storage'
import { completeLevel } from '../state/progress'

function getQueryLevel() {
  const url = new URL(window.location.href)
  const n = Number(url.searchParams.get('level'))
  return Number.isFinite(n) && n >= 1 && n <= 30 ? n : 1
}

export default function Quiz(){
  const s = getState()
  const currentLevel = getQueryLevel()

  // mantém sua filtragem por level (beginner/intermediate/advanced) se quiser,
  // mas como agora tem "Nível 1..30", vamos pegar 5 perguntas quaisquer
  // ou, se você já marca `q.level`, pode mapear currentLevel -> dificuldade aqui.
  const bank = useMemo(()=> data.slice(0,5), [])
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [win, setWin] = useState(0)

  function onAnswer(i){
    const q = bank[idx]
    const correct = i === q.answerIndex
    if(correct){
      const next = setState({ coins: s.coins + (q.coins ?? 0), xp: s.xp + (q.xp ?? 10) })
      s.coins = next.coins; s.xp = next.xp
      setWin(w=>w+1)
    }
    if(idx+1 < bank.length) setIdx(idx+1)
    else {
      completeLevel(currentLevel)        // marca conclusão e libera o próximo
      setDone(true)
    }
  }

  if(done){
    return (
      <div className="container">
        <div className="card">
          <h2>Nível {currentLevel} concluído!</h2>
          <p>Acertos: {win}/{bank.length}</p>
          <p className="small">Recompensas aplicadas. Próximo nível liberado 🎉</p>
          <a className="btn" href="/missions">Voltar às Missões</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card section-card">
        <h2>Jogar — Nível {currentLevel}</h2>
        <QuestionCard q={bank[idx]} onAnswer={onAnswer} />
        <p className="small">Pergunta {idx+1} de {bank.length}</p>
      </div>
    </div>
  )
}
