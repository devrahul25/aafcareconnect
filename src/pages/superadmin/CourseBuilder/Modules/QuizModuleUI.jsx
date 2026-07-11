import React, { useState } from 'react';
import { HelpCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { toast } from '@/components/ui/use-toast';

export default function QuizModuleUI({ section, courseId }) {
  const queryClient = useQueryClient();
  const quiz = section.quizzes?.[0]; // Get the first quiz if exists
  
  const [questions, setQuestions] = useState(
    quiz?.questions || []
  );

  const [newQuestionText, setNewQuestionText] = useState("");

  const saveQuizMutation = useMutation({
    mutationFn: async () => {
      if (!quiz) {
        // Create Quiz container first
        const newQuizRes = await apiClient.post(`/templates/${courseId}/sections/${section.id}/quizzes`, {
          title: section.title,
          pass_mark: 80
        });
        return newQuizRes.data;
      }
      return { data: quiz };
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(['template', courseId]);
      // If we just created the quiz, we might need to let the user add questions now.
      if (!quiz) toast({ title: "Quiz initialized", description: "You can now add questions." });
    }
  });

  const addQuestionMutation = useMutation({
    mutationFn: (text) => apiClient.post(`/templates/${courseId}/sections/${section.id}/quizzes/${quiz.id}/questions`, {
      question: text,
      sort_order: questions.length
    }),
    onSuccess: () => {
      setNewQuestionText("");
      queryClient.invalidateQueries(['template', courseId]);
      toast({ title: "Question added", description: "Remember to add answers to it!" });
    }
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId) => apiClient.delete(`/templates/${courseId}/sections/${section.id}/quizzes/${quiz.id}/questions/${questionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['template', courseId]);
    }
  });

  return (
    <div className="p-6 bg-slate-50 border-t border-slate-100">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Quiz Builder</h4>
              <p className="text-xs text-slate-500">Add questions and answers to evaluate learners.</p>
            </div>
          </div>
          {!quiz && (
            <button 
              onClick={() => saveQuizMutation.mutate()}
              disabled={saveQuizMutation.isPending}
              className="h-9 px-4 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              Initialize Quiz
            </button>
          )}
        </div>

        {quiz && (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
                <div className="flex justify-between items-start gap-4">
                  <h5 className="font-medium text-slate-900 text-sm">
                    <span className="text-slate-400 mr-2">{idx + 1}.</span> {q.question}
                  </h5>
                  <button 
                    onClick={() => deleteQuestionMutation.mutate(q.id)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                {/* Normally we'd render Answers here and have a mini UI to add answers */}
                <div className="pl-6 space-y-2">
                  {q.answers?.map((ans) => (
                    <div key={ans.id} className={`p-2 text-xs rounded-md border ${ans.is_correct ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
                      {ans.is_correct && <CheckCircle2 size={12} className="inline mr-1 text-emerald-500" />}
                      {ans.answer_text}
                    </div>
                  ))}
                  <div className="text-xs text-slate-400 italic">
                    (In a full implementation, you would add answers to this question here)
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <input 
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Type a new question..."
                className="flex-1 h-10 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-100 bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newQuestionText.trim()) {
                    addQuestionMutation.mutate(newQuestionText.trim());
                  }
                }}
              />
              <button 
                onClick={() => addQuestionMutation.mutate(newQuestionText.trim())}
                disabled={!newQuestionText.trim() || addQuestionMutation.isPending}
                className="h-10 px-4 text-sm font-semibold text-orange-600 bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                Add Question
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
