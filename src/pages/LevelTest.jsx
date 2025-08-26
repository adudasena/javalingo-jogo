import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data/questions.json";
import { getState, setState } from "../lib/storage";
import QuestionCard from "../components/QuestionCard";
import { completeLevel } from "../state/progress.js";

export default function LevelTest() {
  const nav = useNavigate();
  const qs = useMemo(() => data.slice(0, 5), []);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const s = getState();

  // se já fez o teste, manda para a intro bloqueada
  useEffect(() => {
    if (s.levelTestDone) nav("/leveltest");
  }, [s.levelTestDone, nav]);

  function onAnswer(i) {
    if (i === qs[idx].answerIndex) setScore((v) => v + 1);
    if (idx + 1 < qs.length) setIdx(idx + 1);
    else finish();
  }

  function finish() {
    const ratio = score / qs.length;
    const level = ratio >= 0.8 ? "advanced" : ratio >= 0.5 ? "intermediate" : "beginner";

    // trava futuras tentativas
    setState({ level, levelTestDone: true });

    // libera alguns níveis iniciais conforme desempenho
    const liberarAte = level === "advanced" ? 5 : level === "intermediate" ? 3 : 1;
    for (let n = 1; n <= liberarAte; n++) completeLevel(n);

    nav("/home");
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Teste de Nivelamento</h2>
        <p className="small">Responda 5 perguntas. No final, definimos seu nível automaticamente.</p>
        <QuestionCard q={qs[idx]} onAnswer={onAnswer} />
        <p className="small">Progresso: {idx + 1} / {qs.length}</p>
      </div>
    </div>
  );
}
