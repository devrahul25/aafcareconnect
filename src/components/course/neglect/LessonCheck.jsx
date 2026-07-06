import { useState } from "react";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

export default function LessonCheck({ question, onAnswered }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const isCorrect = answered && selected === question.correct;

  const choose = (i) => {
    if (answered) return;
    setSelected(i);
    onAnswered?.(i === question.correct, i);
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-2">
        <Lightbulb size={13} className="text-amber-500" /> Knowledge Check
      </p>
      <div className="card p-5">
        <p className="text-sm font-semibold text-slate-900 mb-3">{question.q}</p>
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const show = answered;
            const isSel = selected === i;
            const correct = i === question.correct;
            return (
              <button key={i} onClick={() => choose(i)} disabled={answered}
                className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all flex items-center justify-between
                  ${!show ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50" : ""}
                  ${show && correct ? "bg-emerald-50 border-emerald-300 text-emerald-800" : ""}
                  ${show && isSel && !correct ? "bg-red-50 border-red-300 text-red-800" : ""}
                  ${show && !isSel && !correct ? "border-slate-200 text-slate-400" : ""}`}>
                <span>{opt}</span>
                {show && correct && <CheckCircle2 size={16} className="text-emerald-600" />}
                {show && isSel && !correct && <XCircle size={16} className="text-red-600" />}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`mt-3 rounded-lg p-3 ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            <p className="font-bold text-xs mb-0.5">{isCorrect ? "Correct" : "Not quite"}</p>
            <p className="text-xs text-slate-600">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}