
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { YoutubeIcon } from 'lucide-react';

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
    // Simple validation for YouTube URLs
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return regex.test(url);
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
            placeholder="Paste YouTube video URL here"
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
        Import a YouTube video to automatically create shorts from the most interesting parts
      </p>
    </div>
  );
};

export default YoutubeImport;
