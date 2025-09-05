import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data/questions.json";
import { getState, setState } from "../lib/storage";
import QuestionCard from "../components/QuestionCard";
import { completeLevel } from "../state/progress.js";

export default function LevelTest() {
  const nav = useNavigate();
  const qs = useMemo(() => data.slice(0, 7), []); // agora são 7 perguntas
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const s = getState();

  // se já fez o teste, redireciona
  useEffect(() => {
    if (s.levelTestDone) nav("/home");
  }, [s.levelTestDone, nav]);

  function onAnswer(i) {
    if (i === qs[idx].answerIndex) setScore((v) => v + 1);
    if (idx + 1 < qs.length) setIdx(idx + 1);
    else finish();
  }

function finish() {
  let level = "beginner";
  if (score >= 6) level = "advanced";
  else if (score >= 3) level = "intermediate";

  setState({ level, levelTestDone: true });
  const user = s.user?.name || "demo";

  let end = 1;
  let startLevel = 1;

  if (level === "intermediate") {
    end = 10;
    startLevel = 10;
    alert("Você pode praticar até o nível 10 (iniciante). Seu nível inicial é o 11 (intermediário).");
  } else if (level === "advanced") {
    end = 32;
    startLevel = 32;
    alert("Você pode praticar até o nível 30 (intermediário). Seu nível inicial é o 31 (avançado).");
  } else {
    alert("Seu nível inicial é o 1 (iniciante).");
  }

  for (let n = 1; n <= end; n++) {
    completeLevel(n, user);
  }

  nav("/home");
}

  return (
    <div className="container">
      <div className="card">
        <h2>Teste de Nivelamento</h2>
        <p className="small">Responda 7 perguntas. No final, definimos seu nível automaticamente.</p>
        <QuestionCard q={qs[idx]} onAnswer={onAnswer} />
        <p className="small">Progresso: {idx + 1} / {qs.length}</p>
      </div>
    </div>
  );
}