import React from "react";
import { useNavigate } from "react-router-dom";
import { getState } from "../lib/storage";

export default function TestIntro() {
  const nav = useNavigate();
  const s = getState();
  const done = Boolean(s.levelTestDone);

  if (done) {
    return (
      <div className="container">
        <div className="card section-card">
          <h2>Teste de Nivelamento</h2>
          <p className="small">Você já realizou o teste. Resultados aplicados ao seu perfil.</p>
          <div className="row" style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <a className="btn" href="/missions">Ir para Missões</a>
            <a className="btn btn-ghost" href="/home">Voltar ao Início</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card section-card">
        <h2>Teste de Nivelamento</h2>
        <p className="small">Responda 5 perguntas. No final, definimos seu nível e liberamos níveis iniciais.</p>
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
