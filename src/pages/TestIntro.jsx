import React from "react";
import { useNavigate } from "react-router-dom";

export default function TestIntro() {
  const nav = useNavigate();
  return (
    <div className="container">
      <div className="card section-card">
        <h2>Teste de Nivelamento</h2>
        <p className="small">Responda 5 perguntas. No final, definimos seu nível e liberamos alguns níveis iniciais.</p>
        <ul className="intro-list">
          <li>✔️ 1 pergunta por vez</li>
          <li>✔️ Sem tempo máximo</li>
          <li>✔️ Desempenho melhor → mais níveis liberados</li>
        </ul>
        <button className="btn btn-primary" onClick={() => nav("/leveltest/play")}>
          Começar agora
        </button>
      </div>
    </div>
  );
}
