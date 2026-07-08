import { Sparkles } from 'lucide-react';

/**
 * ComingSoonFeature — placeholder for AI-powered features that will be
 * re-implemented with a real LLM integration in a future sprint.
 */
export default function ComingSoonFeature({ label = 'AI Feature', description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
        <Sparkles size={22} className="text-blue-500" />
      </div>
      <div>
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="mt-1 text-sm text-slate-500">
          {description || 'This feature is coming soon. AI-powered capabilities are being integrated.'}
        </p>
      </div>
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
        Coming Soon
      </span>
    </div>
  );
}
