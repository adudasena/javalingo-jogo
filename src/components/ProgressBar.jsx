import React from 'react'
export default function ProgressBar({ value=0 }){
  return (<div className="progress" aria-label="Progresso">
    <div style={{ width: `${Math.min(100, Math.max(0,value))}%`}}></div>
  </div>)
}
