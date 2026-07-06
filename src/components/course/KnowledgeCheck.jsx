import { useState } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export default function KnowledgeCheck({ question }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const isCorrect = answered && selected === question.correct;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-3 last:mb-0">
      <p className="text-sm font-semibold text-slate-900 mb-3">{question.q}</p>
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const showCorrect = answered && i === question.correct;
          const showWrong = answered && i === selected && i !== question.correct;
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => setSelected(i)}
              className={`w-full text-left text-sm font-medium px-3 py-2 rounded-lg border flex items-center justify-between gap-2 transition-all ${
                showCorrect
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : showWrong
                  ? "bg-red-50 border-red-300 text-red-800"
                  : answered
                  ? "bg-white border-slate-200 text-slate-500"
                  : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <span>{opt}</span>
              {showCorrect && <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />}
              {showWrong && <XCircle size={16} className="text-red-600 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`mt-3 flex items-start gap-2 p-3 rounded-lg text-sm ${isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
          {isCorrect ? <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" /> : <Info size={15} className="flex-shrink-0 mt-0.5" />}
          <div>
            <p className="font-bold mb-0.5">{isCorrect ? "Correct!" : "Try again"}</p>
            <p className="font-normal leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}

      {!answered && (
        <p className="text-[11px] text-slate-400 mt-2">Select the best answer to check your understanding.</p>
      )}
    </div>
  );
}