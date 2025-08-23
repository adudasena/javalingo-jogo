import React from 'react'

export default function Mascot({ skin = 'classic', size = 120 }) {
  // Escolhe a imagem de acordo com a skin
  const src =
    skin === 'Ternin'
      ? '/assets/javalingoimagem.png'
      : '/assets/javalingoimagem.png'

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={src}
        alt={`Mascote ${skin}`}
        style={{
          width: size,
          height: size,
          objectFit: 'contain'
        }}
      />
      <p>{skin === 'Ternin' ? 'Javali De Ternin' : 'Javali Clássico'}</p>
    </div>
  )
}