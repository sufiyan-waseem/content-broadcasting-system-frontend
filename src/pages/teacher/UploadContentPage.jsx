import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadContent } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Upload, ImageIcon, X, Calendar } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  rotationDuration: z.coerce.number().min(1, 'Must be at least 1 minute').optional(),
}).refine((d) => new Date(d.endTime) > new Date(d.startTime), {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export default function UploadContentPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const handleFile = useCallback((f) => {
    setFileError('');
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError('Only JPG, PNG, and GIF files are allowed.');
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setFileError(`File size must not exceed ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const mutation = useMutation({
    mutationFn: (formData) => uploadContent(formData),
    onSuccess: () => {
      toast({ title: 'Success!', description: 'Content uploaded successfully. Awaiting approval.' });
      reset();
      setFile(null);
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: ['myContent'] });
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: err.response?.data?.message || 'Something went wrong.',
      });
    },
  });

  const onSubmit = (data) => {
    if (!file) { setFileError('Please select a file.'); return; }
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v); });
    fd.append('file', file);
    mutation.mutate(fd);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Upload className="w-6 h-6" /> Upload Content
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Upload educational content for approval</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" placeholder="e.g. Chapter 5 – Photosynthesis" {...register('title')} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input id="subject" placeholder="e.g. Biology, Mathematics" {...register('subject')} />
          {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Brief description of this content..." rows={3} {...register('description')} />
        </div>

        {/* File Upload - Drag & Drop */}
        <div className="space-y-2">
          <Label>File *</Label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'
            }`}
          >
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.gif" className="hidden" onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="preview" className="max-h-40 max-w-full rounded-lg mx-auto object-contain" />
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }} className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/80">
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs text-muted-foreground mt-2">{file?.name}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="text-sm font-medium text-foreground">Drop your image here or click to browse</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, GIF up to {MAX_SIZE_MB}MB</p>
              </div>
            )}
          </div>
          {fileError && <p className="text-xs text-destructive">{fileError}</p>}
        </div>

        {/* Times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime" className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Start Time *</Label>
            <Input id="startTime" type="datetime-local" {...register('startTime')} />
            {errors.startTime && <p className="text-xs text-destructive">{errors.startTime.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime" className="flex items-center gap-1"><Calendar className="w-3 h-3" /> End Time *</Label>
            <Input id="endTime" type="datetime-local" {...register('endTime')} />
            {errors.endTime && <p className="text-xs text-destructive">{errors.endTime.message}</p>}
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <Label htmlFor="rotationDuration">Rotation Duration (minutes)</Label>
          <Input id="rotationDuration" type="number" min="1" placeholder="e.g. 30" {...register('rotationDuration')} />
          {errors.rotationDuration && <p className="text-xs text-destructive">{errors.rotationDuration.message}</p>}
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          {mutation.isPending ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading...</span>
          ) : (
            <span className="flex items-center gap-2"><Upload className="w-4 h-4" />Upload Content</span>
          )}
        </Button>
      </form>
      <Toaster />
    </div>
  );
}
