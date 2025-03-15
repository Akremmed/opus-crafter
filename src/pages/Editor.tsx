
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import VideoUploader from '@/components/VideoUploader';
import VideoPlayer from '@/components/VideoPlayer';
import Timeline from '@/components/Timeline';
import Controls from '@/components/Controls';
import Subtitles from '@/components/Subtitles';
import YoutubeImport from '@/components/YoutubeImport';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, ArrowLeft, Youtube, Upload, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportVideo } from '@/utils/videoUtils';
import { analyzeVideoContent, segmentsToClips, VideoSegment } from '@/utils/youtubeUtils';

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
  const [activeTab, setActiveTab] = useState('upload');
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

  const handleVideoUploaded = (file: File, url: string) => {
    setVideoFile(file);
    setVideoUrl(url);
    // Reset other states when a new video is uploaded
    setClips([]);
    setSegments([]);
    setCurrentSubtitle(null);
  };

  const handleYoutubeImport = async (youtubeUrl: string) => {
    setIsProcessing(true);
    
    try {
      toast({
        title: "Processing YouTube Video",
        description: "Analyzing content and extracting interesting segments...",
      });
      
      // Process the YouTube video
      const result = await analyzeVideoContent(youtubeUrl, (progress) => {
        setExportProgress(progress);
      });
      
      setVideoUrl(result.videoUrl);
      setDuration(result.duration);
      setSegments(result.segments);
      
      // Convert segments to timeline clips
      const timelineClips = segmentsToClips(result.segments, result.duration);
      setClips(timelineClips);
      
      toast({
        title: "Video Processed Successfully",
        description: `Found ${result.segments.length} interesting segments for shorts`,
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "There was an error processing the YouTube video.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
          {/* Tabs for Upload or YouTube Import */}
          {!videoUrl && (
            <div className="glass-card p-4">
              <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Video
                  </TabsTrigger>
                  <TabsTrigger value="youtube" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube Import
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload">
                  <VideoUploader onVideoUploaded={handleVideoUploaded} />
                </TabsContent>
                
                <TabsContent value="youtube">
                  <YoutubeImport 
                    onVideoImported={handleYoutubeImport}
                    isProcessing={isProcessing}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Video Player or Uploader */}
          {videoUrl && (
            <div className="glass-card p-4 overflow-hidden relative">
              <VideoPlayer 
                src={videoUrl}
                currentTime={currentTime}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
              />
              <Subtitles text={currentSubtitle} isVisible={!!currentSubtitle} />
            </div>
          )}
          
          {/* Controls */}
          {videoUrl && (
            <Controls 
              onSplit={handleSplitClick}
              onExport={handleExportClick}
              hasVideo={!!videoUrl}
            />
          )}
          
          {/* Timeline */}
          {videoUrl && (
            <div className="glass-card p-4">
              <Timeline 
                duration={duration} 
                onClipChange={handleClipChange}
              />
            </div>
          )}
          
          {/* Processing or Export Progress */}
          {(isProcessing || isExporting) && (
            <div className="glass-card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">
                  {isProcessing ? "Processing YouTube Video..." : "Exporting Video..."}
                </h3>
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
