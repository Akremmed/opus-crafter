
import React from 'react';
import Timeline from '@/components/Timeline';
import Controls from '@/components/Controls';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface TimelineClip {
  id: string;
  start: number;
  end: number;
  duration: number;
  left: number;
  width: number;
  transcript?: string;
}

interface ClipManagerProps {
  videoUrl: string | null;
  duration: number;
  currentTime: number;
  clips: TimelineClip[];
  onClipChange: (newClips: TimelineClip[]) => void;
  onTimeUpdate: (time: number) => void;
  onExport: () => void;
  showClipsHelp: boolean;
}

const ClipManager: React.FC<ClipManagerProps> = ({
  videoUrl,
  duration,
  currentTime,
  clips,
  onClipChange,
  onTimeUpdate,
  onExport,
  showClipsHelp
}) => {
  if (!videoUrl) return null;

  const handleSplitClick = () => {
    // The Timeline component will handle the actual splitting logic
  };

  return (
    <>
      {showClipsHelp && clips.length > 0 && (
        <Alert>
          <AlertTitle>Clips Generated</AlertTitle>
          <AlertDescription>
            The AI has generated {clips.length} clips from the most interesting parts of your video.
            You can adjust them on the timeline below or export them as shorts.
          </AlertDescription>
        </Alert>
      )}
      
      <Controls 
        onSplit={handleSplitClick}
        onExport={onExport}
        hasVideo={!!videoUrl}
      />
      
      <div className="glass-card p-4">
        <Timeline 
          duration={duration} 
          onClipChange={onClipChange}
          clips={clips}
          currentTime={currentTime}
          onTimeUpdate={onTimeUpdate} 
        />
      </div>
    </>
  );
};

export default ClipManager;
