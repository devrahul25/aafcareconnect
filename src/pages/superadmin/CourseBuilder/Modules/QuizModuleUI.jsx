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
      is_correct: question.answers?.length === 0, // Default first answer to correct
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
    mutationFn: (answerId) => apiClient.patch(`/templates/quizzes/${quizId}/questions/${question.id}/answers/${answerId}`, {
      is_correct: true // Currently simplistic: marking one as correct
    }),
    onSuccess: () => queryClient.invalidateQueries(['template', courseId])
  });

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <h5 className="font-medium text-slate-900 text-sm">
          <span className="text-slate-400 mr-2">{index + 1}.</span> {question.question}
        </h5>
        <button 
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
          title="Delete Question"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="pl-6 space-y-2 mt-2">
        {question.answers?.map((ans) => (
          <div key={ans.id} className={`flex items-center justify-between p-2 text-xs rounded-md border group transition-colors ${ans.is_correct ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => !ans.is_correct && toggleCorrectMutation.mutate(ans.id)}
                className={`flex-shrink-0 ${ans.is_correct ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'} transition-colors`}
                title={ans.is_correct ? "Correct Answer" : "Mark as correct"}
              >
                <CheckCircle2 size={16} />
              </button>
              <span>{ans.text}</span>
            </div>
            <button 
              onClick={() => deleteAnswerMutation.mutate(ans.id)}
              className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        
        <div className="flex items-center gap-2 mt-2">
          <input 
            type="text"
            value={newAnswerText}
            onChange={(e) => setNewAnswerText(e.target.value)}
            placeholder="Add an answer option..."
            className="flex-1 h-8 px-2 text-xs rounded-md border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newAnswerText.trim()) {
                addAnswerMutation.mutate(newAnswerText.trim());
              }
            }}
          />
          <button 
            onClick={() => addAnswerMutation.mutate(newAnswerText.trim())}
            disabled={!newAnswerText.trim() || addAnswerMutation.isPending}
            className="h-8 px-3 text-xs font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            Add Option
          </button>
        </div>
      </div>
    </div>
  );
}
