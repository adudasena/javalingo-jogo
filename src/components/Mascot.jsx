import React from 'react'
import skins from '../data/skins.json'

// mapeia ids
const SKIN_ASSETS = {
  classic: '/public/assets/javalingoimagem.png',
  flamejante: '/public/assets/javali-fogo-mascote.png',
  comp_unifil: '/public/assets/javalingo-compunifil.png',
  unifil: '/public/assets/javalingo-unifil.png',
  hacker: '/public/assets/javalingo-hacker.png',
  dev_senior: '/public/assets/javalingo-devsenior.png',
  universitario: '/public/assets/javalingo-universitario.png' ,
  malandro: '/public/assets/javalingo-malandro.png'
}

export default function Mascot({ skin = 'classic', size = 120 }) {
  const src = SKIN_ASSETS[skin] || SKIN_ASSETS.classic
  const skinData = Array.isArray(skins) ? skins.find(sk => sk.id === skin) : null
  const displayName = skinData ? skinData.name : `Mascote ${skin}`

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={src}
        alt={displayName}
        onError={(e) => {
          console.warn('Imagem não encontrada para', skin, '→ usando classic')
          e.currentTarget.src = SKIN_ASSETS.classic
        }}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
      <p>{displayName}</p>
    </div>
  )
}
