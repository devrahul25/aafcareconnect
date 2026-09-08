import React, { useState } from 'react';
import { HelpCircle, Trash2, CheckCircle2, Plus, GripVertical } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { toast } from '@/components/ui/use-toast';

export default function QuizModuleUI({ section, courseId }) {
  const queryClient = useQueryClient();
  const quiz = section.quizzes?.[0]; // Get the first quiz if exists
  
  const questions = quiz?.questions || [];

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
    onSuccess: () => {
      queryClient.invalidateQueries(['template', courseId]);
      if (!quiz) toast({ title: "Quiz initialized", description: "You can now add questions." });
    }
  });

  const addQuestionMutation = useMutation({
    mutationFn: (text) => apiClient.post(`/templates/quizzes/${quiz.id}/questions`, {
      question: text,
      sort_order: questions.length
    }),
    onSuccess: () => {
      setNewQuestionText("");
      queryClient.invalidateQueries(['template', courseId]);
      toast({ title: "Question added" });
    },
    onError: () => toast({ title: "Error", description: "Failed to add question", variant: "destructive" })
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId) => apiClient.delete(`/templates/quizzes/${quiz.id}/questions/${questionId}`),
    onSuccess: () => queryClient.invalidateQueries(['template', courseId])
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
              <QuestionEditor 
                key={q.id} 
                question={q} 
                index={idx} 
                quizId={quiz.id}
                courseId={courseId}
                onDelete={() => deleteQuestionMutation.mutate(q.id)}
              />
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

function QuestionEditor({ question, index, quizId, courseId, onDelete }) {
  const queryClient = useQueryClient();
  const [newAnswerText, setNewAnswerText] = useState("");

  const addAnswerMutation = useMutation({
    mutationFn: (text) => apiClient.post(`/templates/quizzes/${quizId}/questions/${question.id}/answers`, {
      text: text,
      is_correct: (question.answers?.length || 0) === 0,
      sort_order: question.answers?.length || 0
    }),
    onSuccess: () => {
      setNewAnswerText("");
      queryClient.invalidateQueries(['template', courseId]);
    },
    onError: () => toast({ title: "Error", description: "Failed to add answer", variant: "destructive" })
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: (answerId) => apiClient.delete(`/templates/quizzes/${quizId}/questions/${question.id}/answers/${answerId}`),
    onSuccess: () => queryClient.invalidateQueries(['template', courseId])
  });

  const toggleCorrectMutation = useMutation({
    mutationFn: (answerId) => apiClient.put(`/templates/quizzes/${quizId}/questions/${question.id}/answers/${answerId}`, {
      is_correct: true
    }),
    onSuccess: () => queryClient.invalidateQueries(['template', courseId])
  });

  const answers = question.answers || [];
  const hasCorrectAnswer = answers.some(a => a.is_correct);

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
      {/* Question Header */}
      <div className="flex justify-between items-start gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-start gap-2.5 flex-1">
          <span className="w-6 h-6 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <div>
            <h5 className="font-bold text-slate-900 text-sm leading-snug">
              {question.question}
            </h5>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-semibold text-slate-500">
                {answers.length} {answers.length === 1 ? 'Option' : 'Options'}
              </span>
              {hasCorrectAnswer ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 size={11} /> Correct answer defined
                </span>
              ) : answers.length > 0 ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  ⚠️ Click radio circle to mark correct answer
                </span>
              ) : null}
            </div>
          </div>
        </div>
        
        <button 
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          title="Delete Question"
        >
          <Trash2 size={15} />
        </button>
      </div>
      
      {/* Options List */}
      <div className="space-y-2 pt-1">
        {answers.map((ans, ansIdx) => {
          const letter = String.fromCharCode(65 + ansIdx);
          const isCorrect = ans.is_correct;

          return (
            <div 
              key={ans.id} 
              className={`flex items-center justify-between p-2.5 text-xs rounded-xl border transition-all ${
                isCorrect 
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium shadow-xs' 
                  : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div 
                onClick={() => !isCorrect && toggleCorrectMutation.mutate(ans.id)}
                className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
              >
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCorrect) toggleCorrectMutation.mutate(ans.id);
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isCorrect 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'border-2 border-slate-300 text-transparent hover:border-emerald-500'
                  }`}
                  title={isCorrect ? "Correct Answer" : "Click to mark as correct answer"}
                >
                  <CheckCircle2 size={14} className={isCorrect ? "block" : "hidden"} />
                </button>

                <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                  isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {letter}
                </span>

                <span className="flex-1 text-xs">{ans.text}</span>
              </div>

              <div className="flex items-center gap-2 pl-2">
                {isCorrect ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Correct Answer
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleCorrectMutation.mutate(ans.id)}
                    className="text-[10px] text-slate-400 hover:text-emerald-700 font-semibold px-2 py-0.5 rounded hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
                  >
                    Set as Correct
                  </button>
                )}

                <button 
                  onClick={() => deleteAnswerMutation.mutate(ans.id)}
                  className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Remove option"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2">
          <div className="flex items-center gap-2">
            <input 
              type="text"
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              placeholder={`Type Option ${String.fromCharCode(65 + answers.length)} text...`}
              className="flex-1 h-9 px-3 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newAnswerText.trim()) {
                  addAnswerMutation.mutate(newAnswerText.trim());
                }
              }}
            />
            <button 
              onClick={() => addAnswerMutation.mutate(newAnswerText.trim())}
              disabled={!newAnswerText.trim() || addAnswerMutation.isPending}
              className="h-9 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Plus size={13} /> Add Option
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
