import { useState } from "react";
import { GitBranch, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";

const STEPS = [
  {
    prompt: "Emily arrives hungry and in dirty clothes again today. What is your first action?",
    options: [
      { text: "Provide Emily with food and clean clothes today, record factually what you observed, and inform your SSW/DSL the same day.", correct: true,
        feedback: "Correct. You meet Emily’s immediate needs, record factually (not your interpretation), and escalate the same day — the Recognise, Respond, Record, Report sequence." },
      { text: "Wait two weeks to see if it becomes a clear pattern before acting.", correct: false,
        feedback: "Not appropriate. Neglect is cumulative and a pattern is already evident. Delay risks Emily’s health and welfare — act and escalate now." },
      { text: "Ask Emily directly why her parents don’t feed her.", correct: false,
        feedback: "Not appropriate. Avoid leading or investigative questioning — that is not the carer’s role and can compromise any later enquiry. Record and escalate instead." },
      { text: "Confront Emily’s birth family about her appearance.", correct: false,
        feedback: "Not appropriate. Confronting birth family is not your role and can place Emily at greater risk. Concerns go through your SSW/DSL." },
    ],
  },
  {
    prompt: "Emily later tells you, ‘I don’t want to go home this weekend.’ What do you do next?",
    options: [
      { text: "Listen calmly, reassure her, record her exact words, and escalate to your SSW/DSL the same day — without promising secrecy.", correct: true,
        feedback: "Correct. Provide emotional safety, use her exact words, never promise secrecy, and report the same day — best practice for a disclosure." },
      { text: "Tell Emily she has to go home as normal.", correct: false,
        feedback: "Not appropriate. A child’s expressed reluctance is a safeguarding signal — do not dismiss it. Record and escalate through your SSW/DSL." },
      { text: "Promise to keep her words secret so she feels safe talking to you.", correct: false,
        feedback: "Not appropriate. Never promise a child secrecy — be honest that you must share concerns to help keep her safe." },
      { text: "Wait and see if she mentions it again next week.", correct: false,
        feedback: "Not appropriate. Safeguarding concerns must be acted on promptly — delay risks the child. Record and report the same day." },
    ],
  },
];

export default function BranchingScenario({ onComplete }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    setAnswers((a) => [...a, STEPS[step].options[i].correct]);
  };

  const nextStep = () => {
    if (step + 1 < STEPS.length) {
      setStep(step + 1);
      setPicked(null);
    } else {
      setDone(true);
      onComplete?.();
    }
  };

  const restart = () => {
    setStep(0); setPicked(null); setAnswers([]); setDone(false);
  };

  if (done) {
    const correctCount = answers.filter(Boolean).length;
    return (
      <section className="card p-6 border-l-4 border-l-emerald-400">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={22} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900">Branching Scenario Complete</h2>
            <p className="text-xs text-slate-500">You answered {correctCount} of {STEPS.length} steps correctly.</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          By following the Recognise → Respond → Record → Report sequence you kept Emily’s welfare at the centre and stayed within your role as a foster carer.
        </p>
        <button onClick={restart} className="h-9 px-4 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 inline-flex items-center gap-2">
          <RotateCcw size={14} /> Try again
        </button>
      </section>
    );
  }

  const cur = STEPS[step];
  return (
    <section className="card p-6 border-l-4 border-l-violet-400">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
          <GitBranch size={18} className="text-violet-600" />
        </div>
        <h2 className="font-heading font-bold text-lg text-slate-900">Interactive Branching Scenario</h2>
        <span className="ml-auto text-xs font-semibold text-slate-400">Step {step + 1} / {STEPS.length}</span>
      </div>
      <div className="rounded-xl bg-violet-50/50 border border-violet-100 p-4 mb-4">
        <p className="text-sm font-semibold text-slate-900">{cur.prompt}</p>
      </div>
      <div className="space-y-2">
        {cur.options.map((o, i) => {
          const show = picked !== null;
          const isSel = picked === i;
          const correct = o.correct;
          return (
            <button key={i} onClick={() => choose(i)} disabled={picked !== null}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all
                ${!show ? "border-slate-200 hover:border-violet-300 hover:bg-violet-50/40" : ""}
                ${show && correct ? "bg-emerald-50 border-emerald-300 text-emerald-800" : ""}
                ${show && isSel && !correct ? "bg-red-50 border-red-300 text-red-800" : ""}
                ${show && !isSel && !correct ? "border-slate-200 text-slate-400" : ""}`}>
              {o.text}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className={`mt-3 rounded-lg p-3 ${cur.options[picked].correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          <p className="font-bold text-xs mb-0.5">{cur.options[picked].correct ? "Good choice" : "Not the best choice"}</p>
          <p className="text-xs text-slate-600">{cur.options[picked].feedback}</p>
          <button onClick={nextStep} className="mt-3 h-8 px-3 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 inline-flex items-center gap-1.5">
            {step + 1 < STEPS.length ? <>Next step <ArrowRight size={13} /></> : <>Finish scenario <CheckCircle2 size={13} /></>}
          </button>
        </div>
      )}
    </section>
  );
}