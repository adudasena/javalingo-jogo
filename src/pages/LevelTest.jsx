import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placement from "../data/placement.json";
import { getState, setState } from "../lib/storage";
import QuestionCard from "../components/QuestionCard";
import { completeLevel } from "../state/progress.js"; // ✅ usa o que já existe

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function LevelTest() {
  const nav = useNavigate();

  const qs = useMemo(() => {
    try {
      const arr = Array.isArray(placement) ? placement : [];
      return shuffle(arr).slice(0, 7);
    } catch (e) {
      console.error("Erro carregando placement.json", e);
      return [];
    }
  }, []);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const s = getState();

  useEffect(() => {
    if (s.levelTestDone) nav("/home");
  }, [s.levelTestDone, nav]);

  function onAnswer(i) {
    const cur = qs[idx];
    if (!cur) return;

    if (i === cur.answerIndex) setScore((v) => v + 1);
    if (idx + 1 < qs.length) setIdx(idx + 1);
    else finish();
  }

  function finish() {
    // 0–2 iniciante, 3–5 intermediário, 6–7 avançado
    let level = "beginner";
    if (score >= 6) level = "advanced";
    else if (score >= 3) level = "intermediate";

    setState({ ...s, level, levelTestDone: true });

    const user = s?.user?.name || "demo";
    const end = level === "beginner" ? 10 : level === "intermediate" ? 30 : 50;

    // ✅ solução imediata: marcar como concluídos para liberar o acesso
    for (let n = 1; n <= end; n++) {
      try {
        completeLevel(n, user);
      } catch (e) {
        console.warn("completeLevel falhou no nível", n, e);
      }
    }

    if (level === "beginner") {
      alert("Seu nível inicial é o 1 (iniciante). Você pode praticar até o nível 10.");
    } else if (level === "intermediate") {
      alert("Você pode praticar até o nível 30 (intermediário). Seu nível inicial é o 11.");
    } else {
      alert("Você pode praticar até o nível 50 (avançado). Seu nível inicial é o 31.");
    }

    nav("/home");
  }

  if (!qs.length) {
    return (
      <div className="container">
        <div className="card">
          <h2>Teste de Nivelamento</h2>
          <p className="small" style={{ color: "#ef4444" }}>
            Não foi possível carregar as perguntas do teste (placement.json).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Teste de Nivelamento</h2>
        <p className="small">Responda 7 perguntas. No final, definimos seu nível automaticamente.</p>
        {qs[idx] && <QuestionCard q={qs[idx]} onAnswer={onAnswer} />}
        <p className="small">Progresso: {idx + 1} / {qs.length}</p>
      </div>
    </div>
  );
}
