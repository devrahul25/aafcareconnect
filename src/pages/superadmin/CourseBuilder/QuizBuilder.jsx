import React from "react";
import { HelpCircle, Plus } from "lucide-react";

export default function QuizBuilder({ course, setSaveStatus }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Assessments & Quizzes</h2>
          <p className="text-sm text-slate-500 mt-1">Manage quizzes attached to this course.</p>
        </div>
        <button className="h-9 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={16} /> Add Quiz
        </button>
      </div>

      <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
          <HelpCircle size={24} />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No quizzes yet</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mb-6">Create multiple-choice quizzes to assess learner knowledge at the end of modules.</p>
      </div>
    </div>
  );
}
