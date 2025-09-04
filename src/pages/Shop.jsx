// src/pages/Shop.jsx
import React, { useState } from 'react'
import skins from '../data/skins.json'
import Mascot from '../components/Mascot'
import { getState, setState } from '../lib/storage'

export default function Shop() {
  // Estado reativo da sessão (usa storage como fonte, mas força re-render)
  const [session, setSession] = useState(getState())
  const items = Array.isArray(skins) ? skins : []

  const [toast, setToast] = useState(null) // { title, body }
  const [busy, setBusy] = useState(false)

  function refresh() {
    setSession(getState())
  }

  function showToast(title, body) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  function buy(id, price) {
    if (busy) return
    setBusy(true)

    // já tenho? só ativar
    if (session.ownedSkins.includes(id)) {
      setActive(id)
      showToast('Skin ativada!', 'Você já possuía essa skin, ativamos pra você.')
      setBusy(false)
      return
    }

    // saldo insuficiente
    if ((session.coins ?? 0) < price) {
      alert('Moedas insuficientes. Jogue para ganhar mais!')
      setBusy(false)
      return
    }

    // compra e ativa
    setState({
      coins: (session.coins ?? 0) - price,
      ownedSkins: [...session.ownedSkins, id],
      activeSkin: id
    })
    refresh()

    const sk = items.find(x => x.id === id)
    showToast('Compra concluída 🎉', `Você conquistou: ${sk?.name || id}!`)
    setBusy(false)
  }

  function setActive(id) {
    if (session.activeSkin === id) return
    setState({ activeSkin: id })
    refresh()
    const sk = items.find(x => x.id === id)
    showToast('Skin ativada', `${sk?.name || id} agora está ativa.`)
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Loja de Skins</h2>

        {/* saldo do jogador com ícone */}
        <p className="small" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img
            src="/assets/coin.png"
            alt="Moeda JavaLingo"
            width="18"
            height="18"
            style={{ display: 'inline-block' }}
          />
          {session.coins}
        </p>

        {items.length === 0 ? (
          <div className="card" style={{ marginTop: 12 }}>
            <p>Nenhum item encontrado.</p>
            <p className="small">
              Verifique se <code>src/data/skins.json</code> é um array válido e se os PNGs estão em <code>/public/assets/</code>.
            </p>
          </div>
        ) : (
          <div className="list">
            {items.map((sk) => {
              const owned = session.ownedSkins.includes(sk.id)
              const active = session.activeSkin === sk.id
              const canBuy = (session.coins ?? 0) >= sk.price

              return (
                <div className="card" key={sk.id}>
                  <Mascot skin={sk.id} size={140} />
                  <h3>{sk.name}</h3>

                  {/* preço com ícone */}
                  <p className="small" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <img
                      src="/assets/coin.png"
                      alt="Moeda JavaLingo"
                      width="18"
                      height="18"
                      style={{ display: 'inline-block' }}
                    />
                    {sk.price}
                  </p>

                  {owned ? (
                    <button
                      className="btn"
                      onClick={() => setActive(sk.id)}
                      disabled={active || busy}
                      title={active ? 'Já está ativa' : 'Ativar esta skin'}
                    >
                      {active ? 'Ativo' : 'Ativar'}
                    </button>
                  ) : (
                    <button
                      className="btn btn-accent"
                      onClick={() => buy(sk.id, sk.price)}
                      disabled={!canBuy || busy}
                      title={canBuy ? 'Comprar esta skin' : 'Moedas insuficientes'}
                    >
                      {canBuy ? 'Comprar' : 'Sem moedas'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Toast simples */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            zIndex: 99,
            maxWidth: 340
          }}
        >
          <div
            className="card"
            style={{
              padding: 14,
              border: '1px solid rgba(255,255,255,.18)',
              boxShadow: '0 14px 34px rgba(0,0,0,.35)'
            }}
          >
            <strong style={{ display: 'block', marginBottom: 6 }}>{toast.title}</strong>
            <span className="small">{toast.body}</span>
            <div style={{ marginTop: 10, textAlign: 'right' }}>
              <button className="btn btn-ghost" onClick={() => setToast(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
