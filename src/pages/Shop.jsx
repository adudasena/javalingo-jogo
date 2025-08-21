import React from 'react'
import skins from '../data/skins.json'
import Mascot from '../components/Mascot'
import { getState, setState } from '../lib/storage'

export default function Shop(){
  const s = getState()
  function buy(id, price){
    if(s.ownedSkins.includes(id)) return setActive(id)
    if(s.coins < price) return alert('Moedas insuficientes. Jogue para ganhar mais!')
    const next = setState({ coins: s.coins - price, ownedSkins: [...s.ownedSkins, id], activeSkin: id })
    Object.assign(s, next)
  }
  function setActive(id){
    const next = setState({ activeSkin: id })
    Object.assign(s, next)
  }
  return (
    <div className="container">
      <div className="card">
        <h2>Loja de Skins</h2>
        <p className="small">Moedas: {s.coins}</p>
        <div className="list">
          {skins.map(sk => (
            <div className="card" key={sk.id}>
              <Mascot skin={sk.id} />
              <h3>{sk.name}</h3>
              <p className="small">{sk.price} 🪙</p>
              {s.ownedSkins.includes(sk.id) ?
                <button className="btn" onClick={()=>setActive(sk.id)} disabled={s.activeSkin===sk.id}>
                  {s.activeSkin===sk.id ? 'Ativo' : 'Ativar'}
                </button>
                :
                <button className="btn" onClick={()=>buy(sk.id, sk.price)}>Comprar</button>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
