import React from 'react';
import { Video, FileText, HelpCircle, Link as LinkIcon, Download, CheckCircle2 } from 'lucide-react';

const LESSON_ICONS = {
  VIDEO: <Video size={14} />,
  DOCUMENT: <FileText size={14} />,
  RICH_TEXT: <FileText size={14} />,
  QUIZ: <HelpCircle size={14} />,
  EXTERNAL_LINK: <LinkIcon size={14} />,
  DOWNLOAD: <Download size={14} />
};

export default function CurriculumTree({ sections, getLessons }) {
  if (sections.length === 0) return null;

  return (
    <div className="card p-6 sticky top-24 bg-slate-50 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
        <h3 className="font-bold text-slate-800 text-sm">Learner Preview</h3>
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Auto-generated</span>
      </div>
      
      <div className="space-y-4">
        {sections.map((section, idx) => {
          const lessons = getLessons(section);
          return (
            <div key={section.id} className="space-y-1">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <span className="text-slate-400">▼ Module {idx + 1}</span> {section.title}
              </h4>
              <div className="pl-2 border-l border-slate-200 ml-1.5 space-y-1">
                {lessons.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic pl-4 py-1">No lessons added</p>
                ) : (
                  lessons.map((lesson, lessonIdx) => {
                    const isLast = lessonIdx === lessons.length - 1;
                    return (
                      <div key={lesson.id} className="flex items-start gap-2 relative">
                        <div className="absolute -left-[5px] top-2.5 w-3 border-t border-slate-200" />
                        <div className="pl-4 flex items-center gap-2 py-1 w-full group">
                          <div className={`p-1.5 rounded flex-shrink-0 ${idx === 0 && lessonIdx === 0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                            {LESSON_ICONS[lesson.lessonType]}
                          </div>
                          <span className={`text-xs truncate ${idx === 0 && lessonIdx === 0 ? 'font-semibold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                            {lesson.title}
                          </span>
                          {idx === 0 && lessonIdx === 0 && <span className="ml-auto text-[9px] font-bold text-blue-600 uppercase tracking-wider">Current</span>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
