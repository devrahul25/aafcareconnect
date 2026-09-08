import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { toast } from '@/components/ui/use-toast';
import { 
  X, Video, FileText, HelpCircle, Link as LinkIcon, Download, 
  Loader2, Trash2, CheckCircle2, Circle, UploadCloud, Plus, 
  Info, Check, Sparkles, AlertCircle, Percent
} from 'lucide-react';

export default function LessonConfigurator({ isOpen, onClose, courseId, sectionId, type, lesson, onSuccess }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(lesson?.title || '');
  const [passMark, setPassMark] = useState(lesson?.pass_mark || 80);
  const [url, setUrl] = useState(lesson?.s3_key || lesson?.content || lesson?.cloudfront_url || '');
  const [duration, setDuration] = useState(lesson?.duration_secs ? Math.round(lesson.duration_secs / 60) : '');
  const [uploadMode, setUploadMode] = useState('link'); // 'link' or 'upload'
  const [isUploading, setIsUploading] = useState(false);
  const [createdQuizLesson, setCreatedQuizLesson] = useState(null);
  const fileInputRef = useRef(null);

  const activeLesson = createdQuizLesson || lesson;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const fakeS3Url = `https://s3.amazonaws.com/aafcareconnect/uploads/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      setUrl(fakeS3Url);
      setIsUploading(false);
      toast({ title: "File uploaded successfully" });
    }, 1500);
  };

  const createInitialQuizMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/templates/${courseId}/sections/${sectionId}/quizzes`, {
        title: title.trim() || "Module Assessment Quiz",
        pass_mark: parseInt(passMark) || 80,
        sort_order: 0
      });
      return res.data;
    },
    onSuccess: (res) => {
      const created = res?.data || res;
      setCreatedQuizLesson(created);
      queryClient.invalidateQueries({ queryKey: ['template', courseId] });
      toast({ title: "Quiz initialized", description: "You can now add questions and options below." });
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || 'Failed to initialize quiz';
      toast({ title: 'Error', description: typeof errorMsg === 'string' ? errorMsg : 'Failed to create quiz', variant: 'destructive' });
    }
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      let endpoint = '';
      let payload = { title, sort_order: activeLesson?.sort_order || 0 };

      if (type === 'VIDEO') {
        endpoint = 'videos';
        payload.s3_key = url;
        if (duration && parseInt(duration) > 0) {
          payload.duration_secs = parseInt(duration) * 60;
        }
      } else if (type === 'DOCUMENT' || type === 'DOWNLOAD') {
        endpoint = 'documents';
        payload.s3_key = url || 'dummy-url';
        payload.file_type = type === 'DOWNLOAD' ? 'ZIP' : 'PDF';
      } else if (type === 'RICH_TEXT' || type === 'EXTERNAL_LINK') {
        endpoint = 'rich-text';
        payload.content = url;
      } else if (type === 'QUIZ') {
        endpoint = 'quizzes';
        payload.pass_mark = parseInt(passMark) || 80;
      }

      if (activeLesson?.id) {
        return apiClient.put(`/templates/${courseId}/sections/${sectionId}/${endpoint}/${activeLesson.id}`, payload);
      } else {
        return apiClient.post(`/templates/${courseId}/sections/${sectionId}/${endpoint}`, payload);
      }
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Lesson saved successfully.' });
      onSuccess();
    },
    onError: (err) => {
      const errorData = err.response?.data?.error;
      const errorMsg = typeof errorData === 'string' ? errorData : errorData?.message || 'Failed to save lesson';
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              {type === 'VIDEO' && <Video size={18} />}
              {(type === 'DOCUMENT' || type === 'RICH_TEXT') && <FileText size={18} />}
              {type === 'QUIZ' && <HelpCircle size={18} />}
              {type === 'EXTERNAL_LINK' && <LinkIcon size={18} />}
              {type === 'DOWNLOAD' && <Download size={18} />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {activeLesson ? 'Edit' : 'Create'} {type === 'QUIZ' ? 'Assessment Quiz' : type.replace('_', ' ')}
              </h3>
              <p className="text-xs text-slate-500">
                {type === 'QUIZ' ? 'Define quiz title, pass mark, and multiple-choice questions' : 'Configure lesson content and properties'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {/* Title & Basic Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={type === 'QUIZ' ? 'sm:col-span-2' : 'sm:col-span-3'}>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                {type === 'QUIZ' ? 'Quiz / Assessment Title' : 'Lesson Title'}
              </label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={type === 'QUIZ' ? 'e.g. Safeguarding Children Knowledge Check' : 'e.g. Introduction to Course'}
                className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white"
              />
            </div>

            {type === 'QUIZ' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Pass Mark (%)</span>
                  <span className="text-[11px] font-bold text-blue-600">{passMark}%</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="number" 
                    min="50"
                    max="100"
                    value={passMark}
                    onChange={e => setPassMark(e.target.value)}
                    className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold"
                  />
                  <div className="flex gap-1">
                    {[80, 100].map(pm => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPassMark(pm)}
                        className={`px-2 py-1 text-[10px] font-bold rounded border transition-colors ${Number(passMark) === pm ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                      >
                        {pm}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video / Document / Downloads / Rich Text options */}
          {(type === 'VIDEO' || type === 'DOCUMENT' || type === 'DOWNLOAD') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 block">File Source</label>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                  <button 
                    onClick={() => setUploadMode('link')}
                    className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-colors ${uploadMode === 'link' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    URL Link
                  </button>
                  <button 
                    onClick={() => setUploadMode('upload')}
                    className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-colors ${uploadMode === 'upload' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {uploadMode === 'link' ? (
                <input 
                  type="text" 
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://"
                  className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
              ) : (
                <div 
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer transition-colors ${isUploading ? 'bg-slate-50' : 'hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'}`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload}
                    accept={type === 'VIDEO' ? 'video/*' : type === 'DOWNLOAD' ? '.zip,.rar' : '.pdf,.doc,.docx'}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Loader2 size={24} className="animate-spin text-blue-600" />
                      <span className="text-sm font-medium">Uploading file...</span>
                    </div>
                  ) : url && url.includes('amazonaws.com') ? (
                    <div className="flex flex-col items-center gap-2 text-emerald-600">
                      <CheckCircle2 size={24} />
                      <span className="text-sm font-medium break-all">{url.split('/').pop()}</span>
                      <span className="text-xs text-slate-400 mt-1">Click to upload a different file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <UploadCloud size={24} className="text-slate-400 group-hover:text-blue-500" />
                      <span className="text-sm font-medium text-slate-700">Click to browse or drag and drop</span>
                      <span className="text-xs text-slate-400">
                        {type === 'VIDEO' ? 'MP4, WebM up to 500MB' : type === 'DOWNLOAD' ? 'ZIP, RAR up to 50MB' : 'PDF, DOCX up to 10MB'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {type === 'VIDEO' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Duration (minutes)</label>
              <input 
                type="number" 
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 5"
                className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          )}

          {type === 'EXTERNAL_LINK' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">External Link</label>
              <input 
                type="text" 
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://"
                className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          )}

          {type === 'RICH_TEXT' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Content</label>
              <textarea 
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Enter HTML or Rich Text content..."
                rows={6}
                className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          )}
          
          {/* QUIZ SECTION: Not initialized yet */}
          {type === 'QUIZ' && !activeLesson && (
            <div className="p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Ready to Build Quiz Questions?</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Click below to initialize your quiz container. You will then be able to add multiple-choice questions, set answer options, and select the correct answer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => createInitialQuizMutation.mutate()}
                disabled={!title.trim() || createInitialQuizMutation.isPending}
                className="h-10 px-5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                {createInitialQuizMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                Create Quiz & Add Questions
              </button>
            </div>
          )}

          {/* QUIZ SECTION: Live Question & Option Configurator */}
          {type === 'QUIZ' && activeLesson && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              
              {/* Guidance Info Banner */}
              <div className="flex items-start gap-3 p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
                <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-950">How to create multiple-choice questions:</span>
                  <p className="text-blue-800/90 mt-0.5">
                    1. Add a question below. 2. Add 2 or more options (A, B, C...). 3. Click the <strong>Radio Circle</strong> on the single correct answer to mark it in green.
                  </p>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {activeLesson.questions?.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <HelpCircle size={28} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No questions added yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Use the box below to add your first question.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeLesson.questions?.map((q, idx) => (
                      <QuestionEditor 
                        key={q.id} 
                        question={q} 
                        index={idx} 
                        quizId={activeLesson.id} 
                        courseId={courseId} 
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Question Input Card */}
              <AddQuestionForm 
                quizId={activeLesson.id} 
                courseId={courseId} 
                numQuestions={activeLesson.questions?.length || 0} 
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 px-6">
          <p className="text-xs text-slate-400">
            {type === 'QUIZ' && activeLesson?.questions?.length > 0 
              ? `${activeLesson.questions.length} Question${activeLesson.questions.length === 1 ? '' : 's'} configured` 
              : 'All changes sync automatically'}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={onClose} 
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button 
              onClick={() => saveMutation.mutate()} 
              disabled={
                title.trim().length < 2 || 
                ((type === 'VIDEO' || type === 'DOCUMENT' || type === 'DOWNLOAD') && !url.trim()) ||
                saveMutation.isPending
              }
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {saveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save & Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddQuestionForm({ quizId, courseId, numQuestions }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const addQuestionMutation = useMutation({
    mutationFn: (qText) => apiClient.post(`/templates/quizzes/${quizId}/questions`, {
      question: qText,
      sort_order: numQuestions
    }),
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ['template', courseId] });
      toast({ title: "Question added", description: "Now add answer options below." });
    },
    onError: (err) => {
      const errorData = err.response?.data?.error;
      const errorMsg = typeof errorData === 'string' ? errorData : errorData?.message || err.response?.data?.message || "Failed to add question";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    }
  });

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
      <span className="text-xs font-bold text-slate-700 block">Add New Question</span>
      <div className="flex items-center gap-2">
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Which of the following is a primary safeguarding responsibility?"
          className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text.trim()) {
              addQuestionMutation.mutate(text.trim());
            }
          }}
        />
        <button 
          onClick={() => addQuestionMutation.mutate(text.trim())}
          disabled={!text.trim() || addQuestionMutation.isPending}
          className="px-4 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs"
        >
          {addQuestionMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          Add Question
        </button>
      </div>
    </div>
  );
}

function QuestionEditor({ question, index, quizId, courseId }) {
  const queryClient = useQueryClient();
  const [newAnswerText, setNewAnswerText] = useState("");

  const deleteQuestionMutation = useMutation({
    mutationFn: () => apiClient.delete(`/templates/quizzes/${quizId}/questions/${question.id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', courseId] })
  });

  const addAnswerMutation = useMutation({
    mutationFn: (text) => apiClient.post(`/templates/quizzes/${quizId}/questions/${question.id}/answers`, {
      text: text,
      is_correct: (question.answers?.length || 0) === 0, // First answer is default correct if none exist
      sort_order: question.answers?.length || 0
    }),
    onSuccess: () => {
      setNewAnswerText("");
      queryClient.invalidateQueries({ queryKey: ['template', courseId] });
    },
    onError: (err) => {
      const errorData = err.response?.data?.error;
      const errorMsg = typeof errorData === 'string' ? errorData : errorData?.message || err.response?.data?.message || "Failed to add answer";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    }
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: (answerId) => apiClient.delete(`/templates/quizzes/${quizId}/questions/${question.id}/answers/${answerId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', courseId] })
  });

  const toggleCorrectMutation = useMutation({
    mutationFn: (answerId) => apiClient.put(`/templates/quizzes/${quizId}/questions/${question.id}/answers/${answerId}`, {
      is_correct: true
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', courseId] })
  });

  const handleAddTrueFalse = async () => {
    try {
      await apiClient.post(`/templates/quizzes/${quizId}/questions/${question.id}/answers`, { text: "True", is_correct: true, sort_order: 0 });
      await apiClient.post(`/templates/quizzes/${quizId}/questions/${question.id}/answers`, { text: "False", is_correct: false, sort_order: 1 });
      queryClient.invalidateQueries({ queryKey: ['template', courseId] });
      toast({ title: "True / False options added" });
    } catch (err) {
      toast({ title: "Error adding options", variant: "destructive" });
    }
  };

  const answers = question.answers || [];
  const hasCorrectAnswer = answers.some(a => a.is_correct);

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
      
      {/* Question Header */}
      <div className="flex justify-between items-start gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-start gap-2.5 flex-1">
          <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
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
                  <AlertCircle size={11} /> Click radio circle to mark correct answer
                </span>
              ) : null}
            </div>
          </div>
        </div>
        
        <button 
          type="button"
          onClick={() => { if(confirm('Delete this question?')) deleteQuestionMutation.mutate(); }}
          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          title="Delete Question"
        >
          <Trash2 size={15} />
        </button>
      </div>
      
      {/* Options List */}
      <div className="space-y-2 pt-1">
        {answers.map((ans, ansIdx) => {
          const letter = String.fromCharCode(65 + ansIdx); // A, B, C, D...
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
              {/* Radio Selection & Label */}
              <div 
                onClick={() => !isCorrect && toggleCorrectMutation.mutate(ans.id)}
                className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
              >
                {/* Radio icon */}
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
                  <Check size={11} strokeWidth={3} className={isCorrect ? "block" : "hidden"} />
                </button>

                {/* Letter badge */}
                <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                  isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {letter}
                </span>

                {/* Option text */}
                <span className="flex-1 text-xs">{ans.text}</span>
              </div>

              {/* Right: Badge & Trash */}
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
                  type="button"
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
        
        {/* Add Answer Form & Quick Templates */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center gap-2">
            <input 
              type="text"
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              placeholder={`Type Option ${String.fromCharCode(65 + answers.length)} text...`}
              className="flex-1 h-9 px-3 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newAnswerText.trim()) {
                  addAnswerMutation.mutate(newAnswerText.trim());
                }
              }}
            />
            <button 
              type="button"
              onClick={() => addAnswerMutation.mutate(newAnswerText.trim())}
              disabled={!newAnswerText.trim() || addAnswerMutation.isPending}
              className="h-9 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Plus size={13} /> Add Option
            </button>
          </div>

          {answers.length === 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Quick Template:</span>
              <button
                type="button"
                onClick={handleAddTrueFalse}
                className="text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Sparkles size={11} /> + True / False
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

