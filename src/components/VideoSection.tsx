
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import Subtitles from '@/components/Subtitles';

interface VideoSectionProps {
  videoUrl: string | null;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  currentSubtitle: string | null;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  videoUrl,
  currentTime,
  onTimeUpdate,
  onDurationChange,
  currentSubtitle
}) => {
  if (!videoUrl) return null;

  return (
    <div className="glass-card p-4 overflow-hidden relative">
      <VideoPlayer 
        src={videoUrl}
        currentTime={currentTime}
        onTimeUpdate={onTimeUpdate}
        onDurationChange={onDurationChange}
      />
      <Subtitles text={currentSubtitle} isVisible={!!currentSubtitle} />
    </div>
  );
};

export default VideoSection;
