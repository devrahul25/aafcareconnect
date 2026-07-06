import { useState } from "react";
import { CheckCircle2, AlertTriangle, Lightbulb, Users } from "lucide-react";

export default function ScenarioLearning({ lesson }) {
  const s = lesson.scenario;
  const [chosen, setChosen] = useState(null);
  const answered = chosen !== null;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Scenario banner */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center"><Users size={16} className="text-white" /></div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">Scenario-Based Learning</p>
              <h2 className="font-heading font-bold text-slate-900 text-base">{lesson.title}</h2>
            </div>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-3">
            <p className="text-sm text-slate-800 leading-relaxed">{s.prompt}</p>
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5"><Lightbulb size={12} className="text-amber-500" /> Consider the safeguarding priorities before choosing your response.</p>
        </div>

        {/* Responses */}
        <div className="card p-5 space-y-2.5">
          <p className="text-sm font-semibold text-slate-900 mb-1">What should the foster carer do?</p>
          {s.responses.map((r, i) => {
            const showCorrect = answered && r.correct;
            const showWrong = answered && i === chosen && !r.correct;
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => setChosen(i)}
                className={`w-full text-left text-sm font-medium px-3 py-2.5 rounded-lg border flex items-start gap-3 transition-all ${
                  showCorrect
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : showWrong
                    ? "bg-red-50 border-red-300 text-red-800"
                    : answered
                    ? "bg-white border-slate-200 text-slate-500"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <span className="flex-1">{r.text}</span>
                {showCorrect && <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />}
                {showWrong && <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div className={`card p-5 border-l-4 ${s.responses[chosen].correct ? "border-l-emerald-500" : "border-l-amber-500"}`}>
            <div className="flex items-start gap-3">
              {s.responses[chosen].correct
                ? <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                : <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />}
              <div>
                <p className="font-heading font-bold text-slate-900 mb-1">{s.responses[chosen].correct ? "Correct" : "Not the best first step"}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{s.responses[chosen].feedback}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}