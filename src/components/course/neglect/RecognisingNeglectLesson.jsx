import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import LearningObjectives from "./LearningObjectives";
import DimensionCards from "./DimensionCards";
import CaseStudy from "./CaseStudy";
import BranchingScenario from "./BranchingScenario";
import LessonCheck from "./LessonCheck";
import ReflectionSection from "./ReflectionSection";
import KeyTakeaways from "./KeyTakeaways";
import ResourcesSection from "./ResourcesSection";
import CompletionBadge from "./CompletionBadge";
import AiTutor from "./AiTutor";

const CPD_HOURS = 0.75;

const KC_DIMENSIONS = {
  q: "Emily arrives hungry, unwashed and consistently late for school. Which dimensions of neglect are most evident?",
  options: ["Physical and educational only", "Medical and supervisory", "Physical, educational and possibly medical", "Emotional only"],
  correct: 2,
  explanation: "Persistent hunger and dirty clothes point to physical neglect; chronic lateness or absence to educational neglect; missed healthcare could indicate medical neglect. Neglect often spans several dimensions at once.",
};

const KC_RECORDING = {
  q: "When recording Emily’s disclosure, you should…",
  options: ["Interpret what she likely meant", "Use her exact words with date, time and setting", "Summarise it in your own professional terms", "Omit anything that sounds unlikely"],
  correct: 1,
  explanation: "Record the child’s exact words, factually, with date/time/setting. Avoid interpretation or filtering — this keeps evidence robust for later decisions.",
};

export default function RecognisingNeglectLesson({ onPrev, onNext, isFirst, isLast, isCompleted }) {
  const [kc1, setKc1] = useState(false);
  const [kc2, setKc2] = useState(false);
  const [branchDone, setBranchDone] = useState(false);
  const [reflectSaved, setReflectSaved] = useState(false);

  const done = [kc1, kc2, branchDone, reflectSaved].filter(Boolean).length;
  const percent = Math.round((done / 4) * 100);
  const allDone = percent === 100;

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">Module 2 · Types of Abuse</p>
            <h1 className="font-heading font-bold text-2xl text-slate-900">Recognising Neglect</h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
              <Clock size={12} /> ~ 45 min · {CPD_HOURS} CPD hours · Premium interactive lesson
            </p>
          </div>

          <LearningObjectives />

          <section className="card p-6">
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-2">What is Neglect?</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Neglect is the persistent failure to meet a child’s basic physical and psychological needs, likely to result in the serious impairment of health or development. It is the most common category of abuse identified in the UK and is rarely a single event — it is cumulative and chronic. As a foster carer you are often closest to the child and best placed to notice the early pattern.
            </p>
          </section>

          <DimensionCards />
          <LessonCheck question={KC_DIMENSIONS} onAnswered={() => setKc1(true)} />

          <CaseStudy />

          <BranchingScenario onComplete={() => setBranchDone(true)} />

          <LessonCheck question={KC_RECORDING} onAnswered={() => setKc2(true)} />

          <ReflectionSection onSaved={() => setReflectSaved(true)} />

          <KeyTakeaways />

          <CompletionBadge percent={percent} completed={allDone} cpdHours={CPD_HOURS} />

          <ResourcesSection />
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between gap-3">
        <button onClick={onPrev} disabled={isFirst}
          className="h-10 px-4 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors">
          <ChevronLeft size={16} /> Previous Lesson
        </button>
        <button onClick={onNext} disabled={isLast && !isCompleted}
          className="h-10 px-5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors">
          {isLast ? "Finish Course" : "Next Lesson"} <ChevronRight size={16} />
        </button>
      </div>

      <AiTutor />
    </div>
  );
}