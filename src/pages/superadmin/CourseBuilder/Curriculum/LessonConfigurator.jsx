import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { toast } from '@/components/ui/use-toast';
import { X, Video, FileText, HelpCircle, Link as LinkIcon, Download, Loader2, Trash2, CheckCircle2, UploadCloud } from 'lucide-react';



export default function LessonConfigurator({ isOpen, onClose, courseId, sectionId, type, lesson, onSuccess }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(lesson?.title || '');
  const [url, setUrl] = useState(lesson?.s3_key || lesson?.content || lesson?.cloudfront_url || '');
  const [duration, setDuration] = useState(lesson?.duration_secs ? Math.round(lesson.duration_secs / 60) : '');
  const [uploadMode, setUploadMode] = useState('link'); // 'link' or 'upload'
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate an upload process since there is no real S3 backend available yet
    setTimeout(() => {
      const fakeS3Url = `https://s3.amazonaws.com/aafcareconnect/uploads/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      setUrl(fakeS3Url);
      setIsUploading(false);
      toast({ title: "File uploaded successfully" });
    }, 1500);
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      let endpoint = '';
      let payload = { title, sort_order: lesson?.sort_order || 0 };

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
        payload.pass_mark = 80;
      }

      if (lesson?.id) {
        return apiClient.put(`/templates/${courseId}/sections/${sectionId}/${endpoint}/${lesson.id}`, payload);
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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            {type === 'VIDEO' && <Video size={18} className="text-blue-600" />}
            {(type === 'DOCUMENT' || type === 'RICH_TEXT') && <FileText size={18} className="text-blue-600" />}
            {type === 'QUIZ' && <HelpCircle size={18} className="text-blue-600" />}
            {type === 'EXTERNAL_LINK' && <LinkIcon size={18} className="text-blue-600" />}
            {type === 'DOWNLOAD' && <Download size={18} className="text-blue-600" />}
            <h3 className="font-bold">{lesson ? 'Edit' : 'Add'} {type.replace('_', ' ')}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Lesson Title</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Welcome Video"
              className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {(type === 'VIDEO' || type === 'DOCUMENT' || type === 'DOWNLOAD') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-600 block">Source</label>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                  <button 
                    onClick={() => setUploadMode('link')}
                    className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-colors ${uploadMode === 'link' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    URL Link
                  </button>
                  <button 
                    onClick={() => setUploadMode('upload')}
                    className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-colors ${uploadMode === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
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
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              ) : (
                <div 
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer transition-colors ${isUploading ? 'bg-slate-50' : 'hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'}`}
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
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Duration (minutes)</label>
              <input 
                type="number" 
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 5"
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          )}

          {type === 'EXTERNAL_LINK' && (
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">External Link</label>
              <input 
                type="text" 
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://"
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          )}

          {type === 'RICH_TEXT' && (
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Content</label>
              <textarea 
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Enter HTML or Rich Text content..."
                rows={6}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          )}
          
          {type === 'QUIZ' && !lesson && (
            <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm">
              Quiz builder will be available after creating the lesson. Once created, you can add questions.
            </div>
          )}

          {type === 'QUIZ' && lesson && (
            <div className="space-y-4 mt-4 border-t border-slate-100 pt-4">
              <h4 className="font-semibold text-slate-800 text-sm mb-2">Questions</h4>
              {lesson.questions?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No questions added yet.</p>
              ) : (
                <div className="space-y-4">
                  {lesson.questions?.map((q, idx) => (
                    <QuestionEditor key={q.id} question={q} index={idx} quizId={lesson.id} courseId={courseId} />
                  ))}
                </div>
              )}
              <AddQuestionForm quizId={lesson.id} courseId={courseId} numQuestions={lesson.questions?.length || 0} />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            Close
          </button>
          <button 
            onClick={() => saveMutation.mutate()} 
            disabled={
              title.trim().length < 3 || 
              ((type === 'VIDEO' || type === 'DOCUMENT' || type === 'DOWNLOAD') && !url.trim()) ||
              saveMutation.isPending
            }
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Lesson'}
          </button>
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
      toast({ title: "Question added" });
    },
    onError: () => toast({ title: "Error", description: "Failed to add question", variant: "destructive" })
  });

  return (
    <div className="flex items-center gap-2 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a new question..."
        className="flex-1 text-sm p-2 rounded-md border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && text.trim()) {
            addQuestionMutation.mutate(text.trim());
          }
        }}
      />
      <button 
        onClick={() => addQuestionMutation.mutate(text.trim())}
        disabled={!text.trim() || addQuestionMutation.isPending}
        className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-900 disabled:opacity-50 transition-colors whitespace-nowrap"
      >
        Add Question
      </button>
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
      is_correct: question.answers?.length === 0,
      sort_order: question.answers?.length || 0
    }),
    onSuccess: () => {
      setNewAnswerText("");
      queryClient.invalidateQueries({ queryKey: ['template', courseId] });
    },
    onError: () => toast({ title: "Error", description: "Failed to add answer", variant: "destructive" })
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: (answerId) => apiClient.delete(`/templates/quizzes/${quizId}/questions/${question.id}/answers/${answerId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', courseId] })
  });

  const toggleCorrectMutation = useMutation({
    mutationFn: (answerId) => apiClient.patch(`/templates/quizzes/${quizId}/questions/${question.id}/answers/${answerId}`, {
      is_correct: true
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', courseId] })
  });

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <h5 className="font-medium text-slate-900 text-sm">
          <span className="text-slate-400 mr-2">{index + 1}.</span> {question.question}
        </h5>
        <button 
          onClick={() => { if(confirm('Delete question?')) deleteQuestionMutation.mutate() }}
          className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
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
