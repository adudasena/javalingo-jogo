import React from "react";
import { useNavigate } from "react-router-dom";
import { getProgress } from "../state/progress.js";
import { getState } from "../lib/storage";

const TOTAL = 50;

export default function Missions() {
  const nav = useNavigate();
  const s = getState();
  const user = s.user?.name || "demo";
  const { highestUnlocked, completed } = getProgress(user);

  return (
    <div className="container">
      <div className="card section-card">
        <h2>Missões</h2>
        <p className="small">Conclua níveis para liberar os próximos.</p>

        <div className="levels-grid">
          {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => {
            const locked = n > highestUnlocked;
            const done = completed.includes(n);
            const milestone = [10, 20, 30, 40, 50].includes(n);

            return (
              <button
                key={n}
                className={`level-card ${locked ? "locked" : ""} ${done ? "done" : ""} ${
                  milestone ? "milestone" : ""
                }`}
                onClick={() => !locked && nav(`/quiz?level=${n}`)}
                title={locked ? "Complete o nível anterior para liberar" : `Entrar no nível ${n}`}
              >
                <div className="level-number">
                  Nível {n} {milestone ? "⭐" : ""}
                </div>
                {locked ? <span className="lock">🔒</span> : done ? <span className="check">✓</span> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
