// @ts-nocheck
import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, Sparkles, Zap, Brain } from "lucide-react";
import confetti from "canvas-confetti";
import CircularProgress from "./CircularProgress";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Single card-based question with AI feedback
function QuestionCard({ q, qi, total, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const answered = selected !== null;
  const correct = answered && selected === q.correct;

  const handleSelect = async (oi) => {
    if (answered) return;
    setSelected(oi);
    setLoadingFeedback(true);
    const isCorrect = oi === q.correct;
    if (isCorrect) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 }, colors: ["#2563eb", "#10b981", "#f59e0b"] });
    }
    // Use the static explanation provided with the question.
    // AI-powered personalised feedback will be added in a future sprint.
    setAiFeedback(q.explanation);
    setLoadingFeedback(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-slate-50">
      <div className="max-w-2xl mx-auto w-full space-y-5 animate-fade-in">
        {/* Progress header */}
        <div className="flex items-center gap-3">
          <CircularProgress value={Math.round((qi / total) * 100)} size={44} />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Question {qi + 1} of {total}</p>
            <p className="text-xs text-slate-400">Final Assessment</p>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain size={16} className="text-blue-300" />
              </div>
              <p className="text-white font-semibold text-base leading-relaxed">{q.q}</p>
            </div>
          </div>

          {/* Answer options */}
          <div className="p-4 space-y-2.5">
            {q.options.map((opt, oi) => {
              const isSelected = selected === oi;
              const isCorrectOpt = oi === q.correct;
              let cls = "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer";
              if (answered) {
                if (isCorrectOpt) cls = "bg-emerald-50 border-emerald-400 text-emerald-900";
                else if (isSelected) cls = "bg-red-50 border-red-400 text-red-900";
                else cls = "bg-white border-slate-100 text-slate-400 opacity-60";
              } else if (isSelected) {
                cls = "bg-blue-50 border-blue-400 text-blue-900";
              }

              return (
                <button
                  key={oi}
                  onClick={() => handleSelect(oi)}
                  disabled={answered}
                  className={`w-full text-left text-sm font-medium px-4 py-3.5 rounded-xl border-2 flex items-center gap-3 transition-all duration-200 ${cls}`}
                >
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[11px] font-bold ${
                    answered && isCorrectOpt ? "border-emerald-500 bg-emerald-500 text-white" :
                    answered && isSelected ? "border-red-500 bg-red-500 text-white" :
                    isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-slate-400"
                  }`}>
                    {answered && isCorrectOpt ? <CheckCircle2 size={13} /> :
                     answered && isSelected && !isCorrectOpt ? <XCircle size={13} /> :
                     String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Feedback */}
        {answered && (
          <div className={`rounded-2xl p-4 border animate-fade-in ${correct ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${correct ? "bg-emerald-500" : "bg-amber-500"}`}>
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${correct ? "text-emerald-700" : "text-amber-700"}`}>
                  AI Coach · {correct ? "Well done!" : "Learning moment"}
                </p>
                {loadingFeedback ? (
                  <div className="flex items-center gap-1.5 h-5">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className={`w-1.5 h-1.5 rounded-full animate-bounce ${correct ? "bg-emerald-400" : "bg-amber-400"}`} style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed">{aiFeedback}</p>
                )}
              </div>
            </div>
            {!loadingFeedback && (
              <button
                onClick={() => onAnswer(selected === q.correct)}
                className={`mt-3 w-full h-9 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors ${correct ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-amber-500 text-white hover:bg-amber-400"}`}
              >
                {qi + 1 < total ? "Next Question" : "See Results"} <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Results screen
function ResultsScreen({ score, total, passMark, onRetry, onPass }) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= passMark;

  useMemo(() => {
    if (passed) {
      setTimeout(() => confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 }, colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"] }), 100);
    }
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
        <div className={`card p-8 text-center ${passed ? "border-emerald-200" : "border-slate-200"}`}>
          <div className="flex justify-center mb-5">
            <CircularProgress value={pct} size={96} stroke={7} />
          </div>
          <h2 className="font-heading font-bold text-2xl text-slate-900 mb-1">
            {passed ? "🎉 You passed!" : "Keep going — you've got this"}
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            <span className="font-bold text-slate-900">{score} / {total}</span> correct · Pass mark {passMark}%
          </p>
          {passed ? (
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl px-4 py-2.5 mb-4">
              <Award size={16} /> Certificate ready to download · <Zap size={14} className="text-amber-500" /> +300 XP earned
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 mb-4">
              Review the modules on questions you missed, then retake. You need {passMark - pct}% more to pass.
            </div>
          )}
          <div className="flex gap-3">
            {!passed && (
              <button onClick={onRetry} className="flex-1 h-10 text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                <RotateCcw size={14} /> Try Again
              </button>
            )}
            {passed && (
              <button onClick={() => onPass && onPass(pct)} className="flex-1 h-10 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 flex items-center justify-center gap-2 transition-colors">
                Get Certificate <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export — replaces FinalAssessment
export default function CardAssessment({ questions, passMark, courseTitle, onPass }) {
  const [seed, setSeed] = useState(() => Date.now());
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
     
  }, [seed, questions]);

  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState([]); // array of booleans
  const [done, setDone] = useState(false);

  const handleAnswer = (isCorrect) => {
    const next = [...results, isCorrect];
    setResults(next);
    if (current + 1 >= randomised.length) {
      setDone(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const retry = () => {
    setResults([]);
    setCurrent(0);
    setDone(false);
    setSeed(Date.now());
  };

  if (done) {
    const score = results.filter(Boolean).length;
    return <ResultsScreen score={score} total={randomised.length} passMark={passMark} onRetry={retry} onPass={onPass} />;
  }

  return (
    <QuestionCard
      key={current}
      q={randomised[current]}
      qi={current}
      total={randomised.length}
      onAnswer={handleAnswer}
    />
  );
}