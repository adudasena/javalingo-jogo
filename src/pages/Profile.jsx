// src/pages/Profile.jsx
import React, { useMemo, useState } from "react";
import Mascot from "../components/Mascot";
import ProgressBar from "../components/ProgressBar";
import { getState, setState, reset as hardReset } from "../lib/storage";
import { levelToLabel } from "../state/levels";

export default function Profile() {
  const s = getState();

  // ---- dados básicos / fallbacks ----
  const name = s.user?.name || "Aluno(a)";
  const level = s.level || 1;
  const coins = s.coins ?? 0;
  const streak = s.streak ?? 0;
  const missionsDone = s.missionsDone ?? 0;
  const currentXP = s.xp || 0;

  // ---- XP e progresso até próximo nível ----
  const xpToNext = 100;
  const pct = Math.min(100, Math.round(((currentXP % xpToNext) / xpToNext) * 100));

  // ---- UI state ----
  const [showEdit, setShowEdit] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [skinIdx, setSkinIdx] = useState(0);
  const skins = useMemo(
    () => s.ownedSkins || ["javali_classic", "javali_space", "javali_steampunk"],
    [s.ownedSkins]
  );

  // ---- skins ----
  function setActiveSkin(idx) {
    const skin = skins[(idx + skins.length) % skins.length];
    setState({ activeSkin: skin });
    // feedback visual rápido
    document.documentElement.style.setProperty("--ring", "rgba(255,255,255,.6)");
    setTimeout(
      () => document.documentElement.style.setProperty("--ring", "rgba(124,58,237,.45)"),
      600
    );
  }
  function prevSkin() {
    const next = (skinIdx - 1 + skins.length) % skins.length;
    setSkinIdx(next);
    setActiveSkin(next);
  }
  function nextSkin() {
    const next = (skinIdx + 1) % skins.length;
    setSkinIdx(next);
    setActiveSkin(next);
  }

  // ---- sessão ----
  function logout() {
    setState({ user: null });
    location.href = "/";
  }
  function confirmHardReset() {
    hardReset();
    location.href = "/";
  }

  // ---- conquistas/atividade demo ----
  const achievements = [
    { id: "first_steps", label: "Primeiros Passos", unlocked: currentXP >= 10 },
    { id: "streak3", label: "Streak 3 dias", unlocked: streak >= 3 },
    { id: "lvl5", label: "Nível 5", unlocked: level >= 5 },
    { id: "coins500", label: "500 JavaCoins", unlocked: coins >= 500 },
    { id: "missions10", label: "10 missões", unlocked: missionsDone >= 10 },
    { id: "quiz_fast", label: "Relâmpago (quiz)", unlocked: false },
  ];

  return (
    <div className="container">
      {/* HERO */}
      <div className="card profile-hero">
        <div className="hero-left">
          <h2 className="profile-title">
            <span className="sparkle">Perfil 🚀</span>
          </h2>

          <div className="profile-name-row">
            <span className="profile-name">{name}</span>
            <span className="badge">
              Nível {level} · {levelToLabel?.(level) || "Iniciante"}
            </span>
          </div>

          <div className="stats-grid">
            <div className="stat">
              <span className="label">JavaCoins</span>
              <strong> !!! {coins}</strong>
            </div>
            <div className="stat">
              <span className="label">Streak</span>
              <strong>🔥 {streak}d</strong>
            </div>
            <div className="stat">
              <span className="label">Missões</span>
              <strong>✅ {missionsDone}</strong>
            </div>
          </div>

          <div className="status-bar">
            <span className="label">Progresso até o próximo nível</span>
            <ProgressBar value={pct} />
          </div>

          <div className="actions-row" style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => setShowEdit(true)}>
              Editar perfil
            </button>
          </div>
        </div>

        {/* AVATAR + RING */}
        <div className="hero-right">
          <div className="avatar-ring">
            <svg className="ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" className="ring-bg" />
              <circle
                cx="60" cy="60"
                r="52"
                className="ring-fg"
                style={{
                  strokeDasharray: `${(pct / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`,
                }}
              />
            </svg>
            <Mascot skin={s.activeSkin} />
          </div>

          <div className="skin-switch">
            <button className="btn btn-ghost" onClick={prevSkin}>◀</button>
            <span className="small">
              Skin: <b>{s.activeSkin || skins[skinIdx]}</b>
            </span>
            <button className="btn btn-ghost" onClick={nextSkin}>▶</button>
          </div>
        </div>
      </div>

      {/* SOMENTE CONQUISTAS */}
      <div className="grid-3">
        <div className="card section-card">
          <h3>Conquistas</h3>
          <div className="badges-grid">
            {achievements.map((a) => (
              <div key={a.id} className={`badge-tile ${a.unlocked ? "on" : "off"}`}>
                <div className="icon">{a.unlocked ? "🏆" : "🔒"}</div>
                <div className="label">{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AÇÕES FINAIS */}
      <div className="card actions-footer">
        <div className="left" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            onClick={() =>
              navigator.clipboard.writeText(`${name} chegou ao nível ${level} no JavaLingo!`)
            }
          >
            Compartilhar
          </button>
        </div>
        <div className="right" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-accent" onClick={logout}>Sair</button>
          <button className="btn btn-ghost" onClick={() => setShowAdvanced(true)}>Opções avançadas</button>
        </div>
      </div>

      {/* MODAL: Editar perfil */}
      {showEdit && (
        <div className="popup-overlay" onClick={() => setShowEdit(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Editar perfil</h3>
            <div className="input-row" style={{ marginTop: 12 }}>
              <label className="small">Nome</label>
              <input
                defaultValue={name}
                onBlur={(e) =>
                  setState({ user: { ...(s.user || {}), name: e.target.value } })
                }
              />
            </div>
            <div className="popup-actions">
              <button className="btn btn-ghost" onClick={() => setShowEdit(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Avançado (reset escondido) */}
      {showAdvanced && (
        <div className="popup-overlay" onClick={() => setShowAdvanced(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Opções avançadas</h3>
            <p className="small">Estas ações são irreversíveis.</p>
            <div className="popup-actions">
              <button className="btn btn-ghost" onClick={() => setShowAdvanced(false)}>Cancelar</button>
              <button
                className="btn"
                style={{ background: "#ef4444", color: "#fff" }}
                onClick={confirmHardReset}
              >
                Resetar progresso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
