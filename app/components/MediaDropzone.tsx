'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Check, Copy, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MediaDropzoneProps {
  bucketName?: string;
  currentUrl?: string;
  name?: string;
  label?: string;
  onUploadComplete?: (url: string) => void;
}

export default function MediaDropzone({
  bucketName = 'hero-images',
  currentUrl = '',
  name = 'image_url',
  label = 'Media Asset Dropzone',
  onUploadComplete
}: MediaDropzoneProps) {
  const [imageUrl, setImageUrl] = useState(currentUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    try {
      setIsUploading(true);
      setStatusMessage(null);

      if (!supabase) {
        throw new Error('Supabase client is not available.');
      }

      const fileExt = file.name.split('.').pop() || 'png';
      const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setImageUrl(publicUrl);
      if (onUploadComplete) onUploadComplete(publicUrl);
      setStatusMessage('Upload successful!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMessage(`Upload failed: ${msg}. You can paste an image URL directly below.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleCopyUrl = () => {
    if (!imageUrl) return;
    navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 font-mono">
      <input type="hidden" name={name} value={imageUrl} />

      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-accent">
        <span>{label}</span>
        {imageUrl && (
          <button
            type="button"
            onClick={handleCopyUrl}
            className="flex items-center gap-1 text-action hover:underline cursor-none"
          >
            {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
            <span>{copied ? 'Copied URL' : 'Copy URL'}</span>
          </button>
        )}
      </div>

      {/* Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none bg-card/30 backdrop-blur-md ${
          isDragging
            ? 'border-action bg-action/5 scale-[1.01]'
            : 'border-border-custom/50 hover:border-action'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadFile(file);
          }}
        />

        {isUploading ? (
          <div className="py-6 flex flex-col items-center gap-2 text-action">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Transmitting to Supabase Storage...
            </span>
          </div>
        ) : imageUrl ? (
          <div className="space-y-3 flex flex-col items-center w-full">
            <div className="relative max-h-40 rounded-lg overflow-hidden border border-border-custom/60 group">
              {/* Image thumbnail */}
              <Image
                src={imageUrl}
                alt="Asset preview"
                width={200}
                height={160}
                unoptimized
                className="max-h-40 w-auto object-cover rounded"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageUrl('');
                  if (onUploadComplete) onUploadComplete('');
                }}
                aria-label="Remove image"
                className="absolute top-2 right-2 p-1 rounded-full bg-background/90 text-action hover:bg-action hover:text-background transition-all"
              >
                <X size={12} />
              </button>
            </div>
            <p className="text-[9px] text-accent">
              Click or drag another image to replace.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-2 flex flex-col items-center text-accent">
            <UploadCloud size={28} className="text-action opacity-70" />
            <div className="text-[10px] font-bold tracking-widest uppercase text-foreground">
              Drag & Drop Image or Click to Browse
            </div>
            <p className="text-[8px] text-accent/70">
              Direct client upload to Supabase bucket ({bucketName})
            </p>
          </div>
        )}
      </div>

      {/* Manual URL Input Fallback */}
      <div className="space-y-1">
        <label className="text-[8px] font-bold text-accent uppercase tracking-widest">
          Or Enter Direct Image URL
        </label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            if (onUploadComplete) onUploadComplete(e.target.value);
          }}
          placeholder="https://images.unsplash.com/... or storage URL"
          className="w-full bg-background/50 border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action text-foreground font-mono"
        />
      </div>

      {/* Status Message Feedback */}
      {statusMessage && (
        <div className={`p-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
          statusMessage.includes('successful')
            ? 'bg-action/10 text-action border border-action/20'
            : 'bg-red-500/10 text-red-500 border border-red-500/20'
        }`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}
