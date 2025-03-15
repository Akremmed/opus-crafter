
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { YoutubeIcon } from 'lucide-react';
import { extractYoutubeId } from '@/utils/youtubeUtils';

interface YoutubeImportProps {
  onVideoImported: (videoUrl: string) => void;
  isProcessing: boolean;
}

const YoutubeImport: React.FC<YoutubeImportProps> = ({ 
  onVideoImported,
  isProcessing
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const { toast } = useToast();

  const validateYoutubeUrl = (url: string) => {
    // Check if we can extract a valid YouTube ID
    const videoId = extractYoutubeId(url);
    return videoId !== null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    setIsValidUrl(validateYoutubeUrl(url));
  };

  const handleImport = () => {
    if (!isValidUrl) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      });
      return;
    }

    // Process the URL and notify parent component
    onVideoImported(youtubeUrl);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Paste YouTube video URL here (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            value={youtubeUrl}
            onChange={handleUrlChange}
            className="pr-10 pl-4"
            disabled={isProcessing}
          />
          <YoutubeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
        </div>
        <Button 
          onClick={handleImport} 
          disabled={!isValidUrl || isProcessing}
          className="whitespace-nowrap"
        >
          {isProcessing ? 'Processing...' : 'Import Video'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Import a YouTube video to automatically create shorts from the most interesting parts. 
        Supports standard YouTube URLs (youtube.com/watch?v=...) and shortened URLs (youtu.be/...).
      </p>
    </div>
  );
};

export default YoutubeImport;
