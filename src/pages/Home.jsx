// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Mascot from "../components/Mascot";
import CoinCounter from "../components/CoinCounter";
import ProgressBar from "../components/ProgressBar";
import { getState } from "../lib/storage";
import { levelToLabel } from "../state/levels";
import NivelamentoPopup from "../components/NivelamentoPopup";
import "../NivelamentoPopup.css";
import "../styles.css";

export default function Home() {
  const s = getState();
  const name = s.user?.name || "aluno(a)";
  const level = s.level ?? "beginner";
  const levelLabel = levelToLabel(level);
  const xpToNext = 100;
  const currentXP = s.xp ?? 0;
  const pct = Math.min(100, Math.round(((currentXP % xpToNext) / xpToNext) * 100));

  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const username = s.user?.name || "demo";
    const testeFeito = localStorage.getItem(`testeFeito_${username}`);
    if (!testeFeito && !s.levelTestDone) setShowPopup(true);
  }, []); // eslint-disable-line

  const featured = useMemo(
    () => [
      { id: "loops",   title: "Laços & Loops",    tag: "Básico",     xp: 20, to: "/missions?m=loops" },
      { id: "oo",      title: "POO: Classes",     tag: "Intermedi.", xp: 30, to: "/missions?m=poo" },
      { id: "streams", title: "Streams & Map",    tag: "Avançado",   xp: 40, to: "/missions?m=streams" },
    ],
    []
  );

  return (
    <div className="home-wrap">
      {/* REMOVIDO: nav/topbar local para não duplicar o menu */}

      {/* HERO */}
      <section className="card hero-card">
        <div className="hero-left">
          <h1 className="hero-title">
            Bem-vindo(a), <span className="hero-name">{name}</span>!
          </h1>
          <p className="hero-sub">Aprender Java nunca foi tão divertido! ✨</p>

          <div className="hero-cta-row">
            <Link className="btn btn-primary btn-lg" to="/missions">
              Começar a jogar
            </Link>
          </div>

          <div className="hero-progress">
            <span className="label">Rumo ao próximo nível</span>
            <ProgressBar value={pct} />
            <span className="small">{pct}% até o próximo nível</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="mascot-orb">
            <div className="orb glow"></div>
            <Mascot skin={s.activeSkin} size={180} />
            <div className="shine"></div>
          </div>
          <div className="hero-stats">
            <div className="pill">Nível: <b>{levelLabel}</b></div>
            <div className="pill"><CoinCounter coins={s.coins ?? 0} /></div>
          </div>
        </div>
      </section>

      {/* GRID PRINCIPAL */}
      <section className="home-grid">
        {/* Continuar */}
        <div className="card continue-card">
          <div className="continue-header">
            <h3>Continuar de onde parou</h3>
            <Link to="/missions" className="small">Ver todas →</Link>
          </div>
          {/* sem "Missão sugerida" */}
        </div>

        {/* Missões em destaque */}
        <div className="card featured-card">
          <div className="featured-header">
            <h3>Missões em destaque</h3>
          </div>
          <div className="featured-grid">
            {featured.map((m) => (
              <Link key={m.id} to={m.to} className="mission-card">
                <div className="tag">{m.tag}</div>
                <div className="title">{m.title}</div>
                <div className="xp">+{m.xp} XP</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ticker */}
      <div className="ticker">
        <div className="track">
          <span>
            💡 Dica: pratique todos os dias · 🏆 Complete missões para ganhar XP ·{" "}
            <img src="public/assets/coin.png" alt="JavaCoin" width="14" height="14" className="coin-inline" />
            Troque JavaCoins por skins ·{" "}
          </span>
          <span>
            💡 Dica: pratique todos os dias · 🏆 Complete missões para ganhar XP ·{" "}
            <img src="public/assets/coin.png" alt="JavaCoin" width="14" height="14" className="coin-inline" />
            Troque JavaCoins por skins ·{" "}
          </span>
        </div>
      </div>

      {/* Popup de nivelamento */}
      {showPopup && <NivelamentoPopup user={name} onClose={() => setShowPopup(false)} />}
    </div>
  );
}
