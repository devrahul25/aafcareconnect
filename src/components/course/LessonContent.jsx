import { ChevronLeft, ChevronRight } from "lucide-react";
import RichTextBlock from "./blocks/RichTextBlock";
import VideoBlock from "./blocks/VideoBlock";
import PdfBlock from "./blocks/PdfBlock";
import ResourceBlock from "./blocks/ResourceBlock";

function Block({ lesson }) {
  switch (lesson.type) {
    case "RICH_TEXT":
      return <RichTextBlock text={lesson.content} title={lesson.title} />;
    case "VIDEO":
      return <VideoBlock url={lesson.s3_key || lesson.cloudfront_url} title={lesson.title} />;
    case "DOCUMENT":
      return <PdfBlock url={lesson.s3_key || lesson.cloudfront_url} title={lesson.title} />;
    case "DOWNLOAD":
      return <ResourceBlock title={lesson.title} url={lesson.s3_key || lesson.cloudfront_url} fileType="download" />;
    default:
      return <p className="text-sm text-slate-400">Unsupported lesson type.</p>;
  }
}

export default function LessonContent({ lesson, onPrev, onNext, isFirst, isLast, isCompleted }) {
  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">Lesson</p>
            <h1 className="font-heading font-bold text-2xl text-slate-900">{lesson.title}</h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">{lesson.duration}</p>
          </div>
          <Block lesson={lesson} />
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