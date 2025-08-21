import React from 'react'

export default function Mascot({ skin = 'classic', size = 80 }) {
  const bg = skin === 'pixel' ? '#38bdf8' : '#22c55e'
  const style = {
    width: size,
    height: size,
    borderRadius: 16,
    display: 'grid',
    placeItems: 'center',
    background: bg,
    color: '#04130a',
    fontWeight: 800
  }

  const label = skin === 'pixel' ? 'JAVALI PIXEL' : 'JAVALI'

  return (
    <div style={style} aria-label={'Mascote ' + skin}>
      <span style={{ textAlign: 'center' }}>🫎 {label}</span>
    </div>
  )
}
