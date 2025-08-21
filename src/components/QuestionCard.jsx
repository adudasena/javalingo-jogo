import React from 'react'
export default function QuestionCard({ q, onAnswer }){
  if(!q) return null
  return (
    <div className="card">
      <h3>{q.q}</h3>
      <div className="list">
        {q.options.map((opt, idx) => (
          <button key={idx} className="btn secondary" onClick={()=>onAnswer(idx)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
