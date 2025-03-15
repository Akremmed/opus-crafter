
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import VideoUploader from '@/components/VideoUploader';
import VideoPlayer from '@/components/VideoPlayer';
import Timeline from '@/components/Timeline';
import Controls from '@/components/Controls';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportVideo } from '@/utils/videoUtils';

interface TimelineClip {
  id: string;
  start: number;
  end: number;
  duration: number;
  left: number;
  width: number;
}

const Editor: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();

  const handleVideoUploaded = (file: File, url: string) => {
    setVideoFile(file);
    setVideoUrl(url);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  const handleClipChange = (newClips: TimelineClip[]) => {
    setClips(newClips);
  };

  const handleSplitClick = () => {
    // The Timeline component will handle the actual splitting logic
  };

  const handleExportClick = async () => {
    if (!videoUrl || clips.length === 0) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // In a real app, you would use clips information to trim the video
      // For now, we'll just simulate the export process
      await exportVideo(
        videoUrl,
        clips[0].start,
        clips[0].end,
        (progress) => setExportProgress(progress)
      );
      
      toast({
        title: "Export Completed",
        description: "Your video has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your video.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-10 px-4 sm:px-6 container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link 
              to="/"
              className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-display font-medium mt-2">Video Editor</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Video Player or Uploader */}
          <div className="glass-card p-4 overflow-hidden">
            {videoUrl ? (
              <VideoPlayer 
                src={videoUrl}
                currentTime={currentTime}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
              />
            ) : (
              <VideoUploader onVideoUploaded={handleVideoUploaded} />
            )}
          </div>
          
          {/* Controls */}
          <Controls 
            onSplit={handleSplitClick}
            onExport={handleExportClick}
            hasVideo={!!videoUrl}
          />
          
          {/* Timeline */}
          {videoUrl && (
            <div className="glass-card p-4">
              <Timeline 
                duration={duration} 
                onClipChange={handleClipChange}
              />
            </div>
          )}
          
          {/* Export Progress */}
          {isExporting && (
            <div className="glass-card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Exporting Video...</h3>
                <span className="text-sm text-muted-foreground">{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Editor;
