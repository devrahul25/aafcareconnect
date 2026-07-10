import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Link as LinkIcon, FileVideo, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { toast } from '@/components/ui/use-toast';

export default function VideoModuleUI({ section, courseId }) {
  const queryClient = useQueryClient();
  const video = section.videos?.[0];
  const [url, setUrl] = useState(video?.s3_key || '');
  const [mode, setMode] = useState('link'); // 'link' or 'upload'
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const saveMutation = useMutation({
    mutationFn: (videoUrl) => {
      const payloadUrl = videoUrl || url;
      if (video) {
        return apiClient.put(`/templates/${courseId}/sections/${section.id}/videos/${video.id}`, {
          title: section.title,
          s3_key: payloadUrl,
        });
      } else {
        return apiClient.post(`/templates/${courseId}/sections/${section.id}/videos`, {
          title: section.title,
          s3_key: payloadUrl,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['template', courseId]);
      toast({ title: "Saved", description: "Video link updated." });
    }
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate an upload process since there is no real S3 backend available yet
    setTimeout(() => {
      const fakeS3Url = `https://s3.amazonaws.com/aafcareconnect/videos/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      setUrl(fakeS3Url);
      saveMutation.mutate(fakeS3Url);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="p-6 bg-slate-50 border-t border-slate-100">
      <div className="max-w-xl mx-auto space-y-4 text-center">
        {!video?.s3_key ? (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 bg-white transition-colors hover:border-blue-400 relative">
            
            <div className="flex items-center justify-center gap-2 mb-6 bg-slate-100 p-1 rounded-lg w-max mx-auto">
              <button 
                onClick={() => setMode('link')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'link' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <div className="flex items-center gap-1.5"><LinkIcon size={14}/> URL Link</div>
              </button>
              <button 
                onClick={() => setMode('upload')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <div className="flex items-center gap-1.5"><FileVideo size={14}/> Upload File</div>
              </button>
            </div>

            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {mode === 'upload' ? <FileVideo size={24} /> : <UploadCloud size={24} />}
            </div>
            <h4 className="font-semibold text-slate-900 mb-1">
              {mode === 'upload' ? 'Upload Video File' : 'Link Video'}
            </h4>
            <p className="text-sm text-slate-500 mb-6">
              {mode === 'upload' ? 'Select an MP4 or WebM video file from your device' : 'Provide a link to the video (YouTube, Vimeo, or S3 URL)'}
            </p>
            
            {mode === 'link' ? (
              <div className="flex gap-2 max-w-sm mx-auto">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 h-9 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button 
                  onClick={() => saveMutation.mutate(url)}
                  disabled={!url || saveMutation.isPending}
                  className="h-9 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="max-w-sm mx-auto">
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full h-10 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                  ) : (
                    'Select File'
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card p-6 bg-white border border-emerald-100 shadow-sm flex flex-col items-center">
            <CheckCircle2 className="text-emerald-500 w-12 h-12 mb-3" />
            <h4 className="font-bold text-slate-900">Video Configured</h4>
            <p className="text-sm text-slate-500 mt-1 mb-4 truncate w-full max-w-xs">{video.s3_key}</p>
            
            <div className="flex gap-2 max-w-sm mx-auto w-full">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-9 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button 
                onClick={() => saveMutation.mutate(url)}
                disabled={!url || saveMutation.isPending}
                className="h-9 px-4 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
