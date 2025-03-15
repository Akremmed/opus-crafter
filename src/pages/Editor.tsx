
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { analyzeVideoContent, segmentsToClips, VideoSegment, extractYoutubeId } from '@/utils/youtubeUtils';
import { exportVideo } from '@/utils/videoUtils';

// Importing our new components
import VideoSection from '@/components/VideoSection';
import ClipManager from '@/components/ClipManager';
import VideoSourceSelector from '@/components/VideoSourceSelector';
import ExportProgress from '@/components/ExportProgress';

interface TimelineClip {
  id: string;
  start: number;
  end: number;
  duration: number;
  left: number;
  width: number;
  transcript?: string;
}

const Editor: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [segments, setSegments] = useState<VideoSegment[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);
  const [showClipsHelp, setShowClipsHelp] = useState(false);
  const { toast } = useToast();

  // Video playback hooks
  useEffect(() => {
    if (!segments.length) return;
    
    // Find the current segment being played to show subtitles
    const currentSegment = segments.find(
      segment => currentTime >= segment.start && currentTime <= segment.end
    );
    
    setCurrentSubtitle(currentSegment?.transcript || null);
  }, [currentTime, segments]);

  // When clips are generated, show a help message
  useEffect(() => {
    if (clips.length > 0 && !showClipsHelp) {
      setShowClipsHelp(true);
      setTimeout(() => setShowClipsHelp(false), 10000); // Hide after 10 seconds
    }
  }, [clips]);

  const handleVideoUploaded = (file: File, url: string) => {
    setVideoFile(file);
    setVideoUrl(url);
    // Reset other states when a new video is uploaded
    setClips([]);
    setSegments([]);
    setCurrentSubtitle(null);
    setShowClipsHelp(false);
    
    // Set default clip for the entire duration (will be updated when duration is known)
    setDuration(0); // Will be updated by the video player
  };

  const handleYoutubeImport = async (youtubeUrl: string) => {
    setIsProcessing(true);
    setExportProgress(0);
    
    try {
      toast({
        title: "Processing YouTube Video",
        description: "Analyzing content and extracting interesting segments...",
      });
      
      // Validate the YouTube URL once more before processing
      const videoId = extractYoutubeId(youtubeUrl);
      if (!videoId) {
        throw new Error("Invalid YouTube URL");
      }
      
      console.log("Processing YouTube video with ID:", videoId);
      
      // Process the YouTube video
      const result = await analyzeVideoContent(youtubeUrl, (progress) => {
        setExportProgress(progress);
      });
      
      // Update video information
      setVideoUrl(result.videoUrl);
      setDuration(result.duration);
      setSegments(result.segments);
      
      // Convert segments to timeline clips
      const timelineClips = segmentsToClips(result.segments, result.duration);
      console.log("Generated clips:", timelineClips);
      setClips(timelineClips);
      
      toast({
        title: "Video Processed Successfully",
        description: `Found ${result.segments.length} interesting segments for shorts`,
        variant: "default",
      });
    } catch (error) {
      console.error("YouTube import error:", error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "There was an error processing the YouTube video.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setExportProgress(0);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    
    // If no clips have been created yet, create a default clip for the full duration
    if (clips.length === 0 && newDuration > 0) {
      const defaultClip = {
        id: '1',
        start: 0,
        end: newDuration,
        duration: newDuration,
        left: 0,
        width: 100,
      };
      setClips([defaultClip]);
    }
  };

  const handleClipChange = (newClips: TimelineClip[]) => {
    setClips(newClips);
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
          {/* Video Source Selector */}
          <VideoSourceSelector 
            videoUrl={videoUrl}
            onVideoUploaded={handleVideoUploaded}
            onYoutubeImport={handleYoutubeImport}
            isProcessing={isProcessing}
            exportProgress={exportProgress}
          />
          
          {/* Video Player */}
          <VideoSection 
            videoUrl={videoUrl}
            currentTime={currentTime}
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            currentSubtitle={currentSubtitle}
          />
          
          {/* Clip Manager */}
          <ClipManager 
            videoUrl={videoUrl}
            duration={duration}
            currentTime={currentTime}
            clips={clips}
            onClipChange={handleClipChange}
            onTimeUpdate={handleTimeUpdate}
            onExport={handleExportClick}
            showClipsHelp={showClipsHelp}
          />
          
          {/* Export Progress */}
          <ExportProgress 
            isExporting={isExporting}
            exportProgress={exportProgress}
          />
        </div>
      </main>
    </div>
  );
};

export default Editor;
