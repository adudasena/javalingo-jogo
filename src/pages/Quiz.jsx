import React, { useMemo, useState } from 'react'
import data from '../data/questions.json'
import QuestionCard from '../components/QuestionCard'
import { getState, setState } from '../lib/storage'

export default function Quiz(){
  const s = getState()
  const bank = useMemo(()=> data.filter(q=> q.level === (s.level || 'beginner')).slice(0,5), [s.level])
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [win, setWin] = useState(0)

  function onAnswer(i){
    const q = bank[idx]
    const correct = i === q.answerIndex
    if(correct){
      const next = setState({ coins: s.coins + q.coins, xp: s.xp + q.xp })
      s.coins = next.coins; s.xp = next.xp
      setWin(w=>w+1)
    }
    if(idx+1 < bank.length) setIdx(idx+1)
    else setDone(true)
  }

  if(done){
    return (
      <div className="container">
        <div className="card">
          <h2>Fase concluída!</h2>
          <p>Acertos: {win}/{bank.length}</p>
          <p className="small">Você ganhou XP e moedas (salvos no navegador).</p>
          <a className="btn" href="/home">Voltar ao início</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Jogar – {s.level || 'beginner'}</h2>
        <QuestionCard q={bank[idx]} onAnswer={onAnswer} />
        <p className="small">Pergunta {idx+1} de {bank.length}</p>
      </div>
    </div>
  )
}
