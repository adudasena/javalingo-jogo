import React from 'react'
export default function CoinCounter({ coins=0 }){
  return <div className="badge">🪙 {coins} moedas</div>
}
