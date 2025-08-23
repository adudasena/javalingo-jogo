
import React from "react";

export default function Missions() {
  // simulação de fases (true = desbloqueado, false = bloqueado)
  const fases = [
    { id: 1, unlocked: true },
    { id: 2, unlocked: false },
    { id: 3, unlocked: false },
    { id: 4, unlocked: false },
    { id: 5, unlocked: false },
    { id: 6, unlocked: false },
  ];

  return (
    <div className="missions-container">
      <h1>Missões</h1>
      <div className="missions-grid">
        {fases.map((fase) => (
          <div
            key={fase.id}
            className={`mission ${fase.unlocked ? "unlocked" : "locked"}`}
          >
            {fase.unlocked ? (
              <span className="emoji">🟢</span>
            ) : (
              <span className="emoji">🔒</span>
            )}
            <p>Fase {fase.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}