
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Volume1, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  currentTime,
  onTimeUpdate,
  onDurationChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  // Update video time when currentTime prop changes (but not during seeking)
  useEffect(() => {
    if (videoRef.current && !isSeeking) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, isSeeking]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdateHandler = () => {
      if (!isSeeking) {
        onTimeUpdate(video.currentTime);
      }
    };

    const onDurationChangeHandler = () => {
      setDuration(video.duration);
      onDurationChange(video.duration);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdateHandler);
    video.addEventListener('durationchange', onDurationChangeHandler);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdateHandler);
      video.removeEventListener('durationchange', onDurationChangeHandler);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [onTimeUpdate, onDurationChange, isSeeking]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    onTimeUpdate(newTime);
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const seekForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 5, duration);
      videoRef.current.currentTime = newTime;
      onTimeUpdate(newTime);
    }
  };

  const seekBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 5, 0);
      videoRef.current.currentTime = newTime;
      onTimeUpdate(newTime);
    }
  };

  // Format time as mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get volume icon based on volume level
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
      if (videoRef.current) videoRef.current.volume = 0;
    } else {
      setVolume(1);
      if (videoRef.current) videoRef.current.volume = 1;
    }
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden aspect-video bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />
      
      {/* Video Controls */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 glass-card bg-black/70 p-2 transition-all transform duration-300",
        showControls || !isPlaying 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-full"
      )}>
        {/* Progress bar */}
        <Slider
          value={[duration ? (currentTime / duration) * 100 : 0]}
          max={100}
          step={0.1}
          onValueChange={handleSliderChange}
          onValueCommit={() => setIsSeeking(false)}
          onDragStart={() => setIsSeeking(true)}
          className="mb-2"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={seekBackward}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={seekForward}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            
            <span className="text-xs text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 min-w-32">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              {getVolumeIcon()}
            </Button>
            
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
        </div>
      </div>
      
      {/* Play/Pause overlay */}
      {!isPlaying && (
        <button
          className="absolute inset-0 flex items-center justify-center"
          onClick={togglePlay}
        >
          <div className="h-16 w-16 rounded-full bg-primary/80 flex items-center justify-center transition-transform hover:scale-105">
            <Play className="h-8 w-8 text-white" />
          </div>
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
