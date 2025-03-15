
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Video, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface VideoUploaderProps {
  onVideoUploaded: (file: File, url: string) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Check if the file is a video
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (MP4, WebM, MOV, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Create a URL for the video
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
    
    // Simulate upload process (in a real app, you'd upload to a server)
    setTimeout(() => {
      setIsUploading(false);
      onVideoUploaded(file, videoURL);
      toast({
        title: "Video uploaded",
        description: `${file.name} has been added to the editor`,
      });
    }, 1500);
  };

  const clearVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 text-center",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          isUploading && "opacity-70 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {videoPreview ? (
          <div className="relative aspect-video">
            <video
              src={videoPreview}
              className="w-full h-full rounded object-contain bg-black"
              controls
            />
            <Button
              onClick={clearVideo}
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInput}
              className="sr-only"
              id="video-upload"
            />
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 rounded-full bg-muted p-4">
                {isUploading ? (
                  <div className="h-10 w-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <h3 className="mb-2 text-lg font-medium">Upload your video</h3>
              <p className="mb-4 text-sm text-muted-foreground max-w-xs mx-auto">
                Drag and drop your video file, or click to browse
              </p>
              <Button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="relative overflow-hidden"
                disabled={isUploading}
              >
                <Video className="mr-2 h-4 w-4" />
                Select Video
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Supports MP4, WebM, MOV (max 500MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
