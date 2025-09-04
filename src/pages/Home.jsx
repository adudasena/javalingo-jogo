import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Mascot from "../components/Mascot";
import CoinCounter from "../components/CoinCounter";
import ProgressBar from "../components/ProgressBar";
import { getState, setState } from "../lib/storage";
import { levelToLabel } from "../state/levels";
import NivelamentoPopup from "../components/NivelamentoPopup";
import "../NivelamentoPopup.css";
import "../styles.css";

export default function Home() {
  const s = getState();
  const name = s.user?.name || "aluno(a)";
  const level = s.level;
  const levelLabel = levelToLabel(level);
  const xpToNext = 100;
  const currentXP = s.xp ?? 0;
  const pct = Math.min(100, Math.round(((currentXP % xpToNext) / xpToNext) * 100));
  const hasLevel = s.level !== "indefinido";

  // popup de nivelamento
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const username = s.user?.name || "demo";
    const testeFeito = localStorage.getItem(`testeFeito_${username}`);
    if (!testeFeito) setShowPopup(true);
  }, []);

  // missões destaque (demo)
  const featured = useMemo(
    () => [
      { id: "loops",   title: "Laços & Loops",    tag: "Básico",    xp: 20, to: "/missions?m=loops" },
      { id: "oo",      title: "POO: Classes",     tag: "Intermedi.", xp: 30, to: "/missions?m=poo" },
      { id: "streams", title: "Streams & Map",    tag: "Avançado",  xp: 40, to: "/missions?m=streams" },
    ],
    []
  );

  // feed (demo)
  const recent = s.recent || [
    { t: "Concluiu 'Tipos Primitivos'", when: "há 1h" },
    { t: "Ganhou 30 XP", when: "há 1h" },
    { t: "Abriu a missão 'Laços & Loops'", when: "ontem" },
  ];

  // ações
  function claimDaily() {
    if (s.dailyClaimed) return;
    setState({ coins: (s.coins ?? 0) + 25, dailyClaimed: true });
    spawnConfetti();
  }

  // confetti simples
  function spawnConfetti() {
    const root = document.body;
    for (let i = 0; i < 24; i++) {
      const el = document.createElement("i");
      el.className = "confetti";
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDelay = Math.random() * 0.25 + "s";
      root.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }
  }

  if (showPopup) return <NivelamentoPopup user={name} onClose={() => setShowPopup(false)} />;

  return (
    <div className="home-wrap">
      {/* HERO */}
      <section className="card hero-card">
        <div className="hero-left">
          <h1 className="hero-title">
            Bem-vindo(a), <span className="hero-name">{name}</span>!
          </h1>
          <p className="hero-sub">Aprender Java nunca foi tão divertido! ✨</p>

          <div className="hero-cta-row">
            <Link className="btn btn-primary btn-lg" to="/missions">Começar a jogar</Link>
            <button
              className="btn btn-ghost btn-lg"
              onClick={claimDaily}
              disabled={s.dailyClaimed}
              title={s.dailyClaimed ? "Já coletado hoje" : "Ganhe 25 JavaCoins"}
            >
              {s.dailyClaimed ? "Diária coletada" : "Coletar diária +25🪙"}
            </button>
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

          <Link to="/missions" className="continue-body">
            <div className="continue-info">
              <div className="badge">Missão sugerida</div>
              <b>Variáveis & Tipos</b>
              <span className="small">Ganhe +15 XP</span>
            </div>
            <div className="continue-xp">
              <ProgressBar value={(pct + 20) % 100} />
            </div>
          </Link>
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

        {/* Painel de Progresso */}
        <div className="card progress-card">
          <h3>Seu progresso</h3>
          <ul className="progress-list">
            <li><span className="label">Nível</span><b>{levelLabel}</b></li>
            {hasLevel && (
              <li className="row">
                <span className="label">XP</span>
                <div className="grow">
                  <ProgressBar value={pct} />
                  <span className="small">{currentXP} / {Math.ceil(currentXP / 100) * 100} XP</span>
                </div>
              </li>
            )}
            <li className="row">
              <span className="label">JavaCoins</span>
              <CoinCounter coins={s.coins ?? 0} />
            </li>
            <li className="row">
              <span className="label">Ações</span>
              <div className="actions">
                <Link className="btn btn-accent" to="/missions">Jogar</Link>
                <Link className="btn btn-ghost" to="/shop">Loja</Link>
                <Link className="btn btn-ghost" to="/profile">Perfil</Link>
              </div>
            </li>
          </ul>
        </div>

        {/* Feed */}
        <div className="card feed-card">
          <h3>Atividade recente</h3>
          <ul className="feed">
            {recent.map((r, i) => (
              <li key={i}>
                <span className="dot" />
                <div>
                  <b>{r.t}</b>
                  <div className="small">{r.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ticker divertido */}
      <div className="ticker">
        <div className="track">
          <span>💡 Dica: pratique todos os dias · 🏆 Complete missões para ganhar XP · 🪙 Troque JavaCoins por skins · </span>
          <span>💡 Dica: pratique todos os dias · 🏆 Complete missões para ganhar XP · 🪙 Troque JavaCoins por skins · </span>
        </div>
      </div>
    </div>
  );
}
