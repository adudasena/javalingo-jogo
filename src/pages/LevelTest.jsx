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
    const ratio = score / qs.length;

    let level = "beginner";
    if (score >= 6) level = "advanced";
    else if (score >= 3) level = "intermediate";

    // trava futuras tentativas
    setState({ level, levelTestDone: true });

    // nome do usuário atual
    const user = s.user?.name || "demo";

    // define faixa de níveis liberados
    let start = 1;
    let end = 10;

    if (level === "intermediate") {
      start = 11;
      end = 30;
    } else if (level === "advanced") {
      start = 31;
      end = 50;
    }

    // libera níveis correspondentes
    for (let n = start; n <= end; n++) {
      completeLevel(n, user);
    }

    alert(`Teste finalizado! Seu nível é: ${level.toUpperCase()}. Você agora tem acesso aos níveis de ${start} a ${end}.`);
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
