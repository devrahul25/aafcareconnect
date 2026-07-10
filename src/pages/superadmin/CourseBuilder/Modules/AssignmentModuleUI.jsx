import React, { useState, useEffect } from 'react';
import { AlignLeft, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { toast } from '@/components/ui/use-toast';

export default function AssignmentModuleUI({ section, courseId }) {
  const queryClient = useQueryClient();
  const assignment = section.rich_text_lessons?.[0]; // Get the first rich text lesson if exists
  
  // The 'content' field is stored as JSON in Prisma
  const [question, setQuestion] = useState(
    assignment?.content?.question || ''
  );

  const saveMutation = useMutation({
    mutationFn: () => {
      if (assignment) {
        return apiClient.put(`/templates/${courseId}/sections/${section.id}/rich-text/${assignment.id}`, {
          title: section.title,
          content: { question },
        });
      } else {
        return apiClient.post(`/templates/${courseId}/sections/${section.id}/rich-text`, {
          title: section.title,
          content: { question },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['template', courseId]);
      toast({ title: "Saved", description: "Assignment updated." });
    }
  });

  return (
    <div className="p-6 bg-slate-50 border-t border-slate-100">
      <div className="max-w-2xl mx-auto space-y-4">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
            <AlignLeft size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Assignment prompt</h4>
            <p className="text-xs text-slate-500">Provide an open-ended question for learners to answer.</p>
          </div>
        </div>

        <textarea 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Describe a scenario where you would use..."
          className="w-full h-32 p-4 text-sm rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-purple-100 resize-none bg-white"
        />

        <div className="flex justify-end gap-2">
          {assignment && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 mr-4 font-medium">
              <CheckCircle2 size={14} /> Saved in database
            </span>
          )}
          <button 
            onClick={() => saveMutation.mutate()}
            disabled={!question || saveMutation.isPending}
            className="h-9 px-6 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Assignment'}
          </button>
        </div>

      </div>
    </div>
  );
}
