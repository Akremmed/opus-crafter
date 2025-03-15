
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Scissors, Save, Undo, Redo, Volume, Volume2, Subtitles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlsProps {
  onSplit: () => void;
  onExport: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  hasVideo: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onSplit,
  onExport,
  onUndo,
  onRedo,
  hasVideo
}) => {
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  
  const toggleSubtitles = () => {
    setSubtitlesEnabled(!subtitlesEnabled);
  };
  
  return (
    <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSplit}
          disabled={!hasVideo}
          className="flex items-center gap-1"
        >
          <Scissors className="h-4 w-4" />
          <span className="hidden sm:inline">Split</span>
        </Button>
        
        {onUndo && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!hasVideo}
            className="flex items-center gap-1"
          >
            <Undo className="h-4 w-4" />
            <span className="hidden sm:inline">Undo</span>
          </Button>
        )}
        
        {onRedo && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!hasVideo}
            className="flex items-center gap-1"
          >
            <Redo className="h-4 w-4" />
            <span className="hidden sm:inline">Redo</span>
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSubtitles}
          disabled={!hasVideo}
          className={cn(
            "flex items-center gap-1",
            subtitlesEnabled && "bg-primary/10"
          )}
        >
          <Subtitles className="h-4 w-4" />
          <span className="hidden sm:inline">Subtitles</span>
        </Button>
      </div>
      
      <div className="flex-grow"></div>
      
      <Button
        size="sm"
        onClick={onExport}
        disabled={!hasVideo}
        className="flex items-center gap-1.5"
      >
        <Save className="h-4 w-4" />
        Export Video
      </Button>
    </div>
  );
};

export default Controls;
