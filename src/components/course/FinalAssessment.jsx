import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, RotateCcw, Award, ListChecks, ArrowRight } from "lucide-react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FinalAssessment({ questions, passMark, courseTitle, onPass }) {
  const [seed, setSeed] = useState(() => Date.now());
  // randomise question order AND answer order (mapped back to original correct index)
  const randomised = useMemo(() => {
    const ordered = shuffle(questions);
    return ordered.map((q) => {
      const opts = q.options.map((text, idx) => ({ text, originalIdx: idx }));
      const shuffled = shuffle(opts);
      return {
        q: q.q,
        explanation: q.explanation,
        options: shuffled.map((o) => o.text),
        correct: shuffled.findIndex((o) => o.originalIdx === q.correct),
      };
    });
    // re-randomize when seed changes (retry)
     
  }, [seed, questions]);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = randomised.every((q, i) => answers[i] !== undefined);
  const score = randomised.reduce((n, q, i) => (answers[i] === q.correct ? n + 1 : n), 0);
  const scorePercent = randomised.length ? Math.round((score / randomised.length) * 100) : 0;
  const passed = scorePercent >= passMark;

  const select = (qi, oi) => {
    if (submitted) return;
    setAnswers({ ...answers, [qi]: oi });
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
    setSeed(Date.now());
  };

  // ── Results screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Result header */}
          <div className={`card p-6 text-center ${passed ? "border-emerald-200" : "border-red-200"}`}>
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 ${passed ? "bg-emerald-50" : "bg-red-50"}`}>
              {passed ? <Award size={32} className="text-emerald-600" /> : <XCircle size={32} className="text-red-600" />}
            </div>
            <h2 className="font-heading font-bold text-2xl text-slate-900 mb-1">
              {passed ? "Congratulations — you passed!" : "Almost there"}
            </h2>
            <p className="text-slate-500 text-sm">
              You scored <span className="font-bold text-slate-900">{score} / {randomised.length}</span> ({scorePercent}%) · Pass mark {passMark}%
            </p>
            {passed ? (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                <Award size={14} /> Certificate ready to download
              </div>
            ) : (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-semibold">
                <RotateCcw size={14} /> Review the modules and try again
              </div>
            )}
          </div>

          {/* Summary breakdown */}
          <div className="card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5"><ListChecks size={13} /> Question Review</p>
            <div className="space-y-3">
              {randomised.map((q, i) => {
                const ok = answers[i] === q.correct;
                return (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                    {ok ? <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{q.q}</p>
                      {!ok && (
                        <>
                          <p className="text-xs text-red-600 mt-1">Your answer: {q.options[answers[i]]}</p>
                          <p className="text-xs text-emerald-700">Correct: {q.options[q.correct]}</p>
                        </>
                      )}
                      <p className="text-xs text-slate-500 mt-1">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!passed && (
              <button onClick={retry} className="flex-1 h-10 text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                <RotateCcw size={14} /> Retry Assessment
              </button>
            )}
            {passed && (
              <button onClick={() => onPass && onPass()} className="flex-1 h-10 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 flex items-center justify-center gap-2 transition-colors">
                Continue to Certificate <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Assessment form ─────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><ListChecks size={16} className="text-white" /></div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Final Assessment</p>
              <h2 className="font-heading font-bold text-slate-900 text-base">Safeguarding Children Level 2 — MCQ</h2>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
            <span>{randomised.length} questions</span>
            <span>Pass mark: {passMark}%</span>
            <span>{courseTitle}</span>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          {randomised.map((q, qi) => (
            <div key={qi} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
              <p className="text-sm font-semibold text-slate-900 mb-3">
                <span className="text-slate-400 font-normal mr-1">{qi + 1}.</span> {q.q}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  return (
                    <button
                      key={oi}
                      onClick={() => select(qi, oi)}
                      className={`w-full text-left text-sm font-medium px-3 py-2.5 rounded-lg border flex items-center gap-3 transition-all ${
                        selected
                          ? "bg-blue-50 border-blue-400 text-blue-900"
                          : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                      }`}>
                        {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-slate-500">
              {Object.keys(answers).length} / {randomised.length} answered
            </p>
            <button
              onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className="h-10 px-6 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              Submit Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}