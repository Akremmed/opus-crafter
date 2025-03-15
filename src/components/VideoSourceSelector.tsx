
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import VideoUploader from '@/components/VideoUploader';
import YoutubeImport from '@/components/YoutubeImport';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Youtube } from 'lucide-react';

interface VideoSourceSelectorProps {
  videoUrl: string | null;
  onVideoUploaded: (file: File, url: string) => void;
  onYoutubeImport: (youtubeUrl: string) => Promise<void>;
  isProcessing: boolean;
  exportProgress: number;
}

const VideoSourceSelector: React.FC<VideoSourceSelectorProps> = ({
  videoUrl,
  onVideoUploaded,
  onYoutubeImport,
  isProcessing,
  exportProgress
}) => {
  const [activeTab, setActiveTab] = React.useState('upload');

  if (videoUrl) {
    // Display processing progress if needed
    if (isProcessing) {
      return (
        <div className="glass-card p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">
              Processing YouTube Video...
            </h3>
            <span className="text-sm text-muted-foreground">{exportProgress}%</span>
          </div>
          <Progress value={exportProgress} className="h-2" />
        </div>
      );
    }
    return null;
  }

  return (
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
          <VideoUploader onVideoUploaded={onVideoUploaded} />
        </TabsContent>
        
        <TabsContent value="youtube">
          <YoutubeImport 
            onVideoImported={onYoutubeImport}
            isProcessing={isProcessing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoSourceSelector;
