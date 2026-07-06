import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import KnowledgeCheck from "./KnowledgeCheck";
import ScenarioLearning from "./ScenarioLearning";
import RichTextBlock from "./blocks/RichTextBlock";
import ImageBlock from "./blocks/ImageBlock";
import VideoBlock from "./blocks/VideoBlock";
import PdfBlock from "./blocks/PdfBlock";
import ResourceBlock from "./blocks/ResourceBlock";
import KeyPointsBlock from "./blocks/KeyPointsBlock";
import RecognisingNeglectLesson from "./neglect/RecognisingNeglectLesson";

function Block({ block, index }) {
  switch (block.type) {
    case "rich_text":
      return <RichTextBlock text={block.text} title={block.title} />;
    case "image":
      return <ImageBlock url={block.url} caption={block.caption} />;
    case "video":
      return <VideoBlock transcript={block.transcript} title={block.title} />;
    case "key_points":
      return <KeyPointsBlock points={block.points} />;
    case "pdf":
      return <PdfBlock url={block.url} title={block.title} />;
    case "resource":
      return <ResourceBlock title={block.title} fileType={block.fileType} />;
    case "scenario":
      return <ScenarioLearning lesson={{ title: block.title, scenario: block.scenario }} />;
    case "knowledge_check":
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Lightbulb size={13} className="text-amber-500" /> Knowledge Check
          </p>
          <KnowledgeCheck question={block.question} />
        </div>
      );
    default:
      return null;
  }
}

export default function LessonContent({ lesson, onPrev, onNext, isFirst, isLast, isCompleted }) {
  if (lesson.id === "2-2") {
    return <RecognisingNeglectLesson onPrev={onPrev} onNext={onNext} isFirst={isFirst} isLast={isLast} isCompleted={isCompleted} />;
  }
  const blocks = lesson.content || [];
  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">Lesson</p>
            <h1 className="font-heading font-bold text-2xl text-slate-900">{lesson.title}</h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">{lesson.duration} · {blocks.length} sections</p>
          </div>
          {blocks.map((b, i) => (
            <Block key={i} block={b} index={i} />
          ))}
          {blocks.length === 0 && (
            <p className="text-sm text-slate-400">No content available for this lesson yet.</p>
          )}
        </div>
      </div>

      {/* Previous / Next lesson */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="h-10 px-4 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <ChevronLeft size={16} /> Previous Lesson
        </button>
        <button
          onClick={onNext}
          disabled={isLast && !isCompleted}
          className="h-10 px-5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {isLast ? "Finish Course" : "Next Lesson"} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}