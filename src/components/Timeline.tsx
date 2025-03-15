
import React, { useState, useRef, useEffect } from 'react';
import { Scissors, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimelineClip {
  id: string;
  start: number;
  end: number;
  duration: number;
  left: number;
  width: number;
}

interface TimelineProps {
  duration: number;
  onClipChange: (clips: TimelineClip[]) => void;
  clips: TimelineClip[];
  currentTime: number;
}

const Timeline: React.FC<TimelineProps> = ({ duration, onClipChange, clips: initialClips, currentTime }) => {
  const [clips, setClips] = useState<TimelineClip[]>(initialClips.length > 0 ? initialClips : [
    {
      id: '1',
      start: 0,
      end: duration,
      duration: duration,
      left: 0,
      width: 100,
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'trim-left' | 'trim-right' | null>(null);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startLeft, setStartLeft] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  // Update clips when initialClips or duration changes
  useEffect(() => {
    if (initialClips.length > 0) {
      setClips(initialClips);
    } else if (duration > 0) {
      setClips([
        {
          id: '1',
          start: 0,
          end: duration,
          duration: duration,
          left: 0,
          width: 100,
        },
      ]);
    }
  }, [initialClips, duration]);

  // Update currentTime from props
  useEffect(() => {
    setCurrentTime(currentTime);
  }, [currentTime]);

  // Notify parent when clips change
  useEffect(() => {
    onClipChange(clips);
  }, [clips, onClipChange]);

  const handleMouseDown = (
    e: React.MouseEvent,
    clipId: string,
    type: 'move' | 'trim-left' | 'trim-right'
  ) => {
    e.preventDefault();
    const clip = clips.find((c) => c.id === clipId);
    if (!clip) return;

    setIsDragging(true);
    setDragType(type);
    setActiveClipId(clipId);
    setStartX(e.clientX);
    setStartLeft(clip.left);
    setStartWidth(clip.width);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !activeClipId || !timelineRef.current) return;

    const clip = clips.find((c) => c.id === activeClipId);
    if (!clip) return;

    const timelineWidth = timelineRef.current.offsetWidth;
    const pixelsPerPercent = timelineWidth / 100;
    const deltaX = e.clientX - startX;
    const deltaPercent = deltaX / pixelsPerPercent;

    const newClips = [...clips];
    const clipIndex = newClips.findIndex((c) => c.id === activeClipId);

    if (dragType === 'move') {
      let newLeft = Math.max(0, Math.min(100 - clip.width, startLeft + deltaPercent));
      newClips[clipIndex] = {
        ...clip,
        left: newLeft,
        start: (newLeft / 100) * duration,
        end: ((newLeft + clip.width) / 100) * duration,
      };
    } else if (dragType === 'trim-left') {
      const maxTrim = startLeft + startWidth - 5; // Ensure minimum width
      let newLeft = Math.max(0, Math.min(maxTrim, startLeft + deltaPercent));
      let newWidth = startWidth - (newLeft - startLeft);
      
      newClips[clipIndex] = {
        ...clip,
        left: newLeft,
        width: newWidth,
        start: (newLeft / 100) * duration,
        end: ((newLeft + newWidth) / 100) * duration,
        duration: ((newWidth / 100) * duration),
      };
    } else if (dragType === 'trim-right') {
      const minWidth = 5; // Minimum percentage width
      let newWidth = Math.max(minWidth, Math.min(100 - startLeft, startWidth + deltaPercent));
      
      newClips[clipIndex] = {
        ...clip,
        width: newWidth,
        end: ((startLeft + newWidth) / 100) * duration,
        duration: ((newWidth / 100) * duration),
      };
    }

    setClips(newClips);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
    setActiveClipId(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const splitClipAtPlayhead = () => {
    if (currentTime <= 0 || currentTime >= duration) return;
    
    // Find the clip that contains the current time
    const clipToSplit = clips.find(
      (clip) => currentTime >= clip.start && currentTime <= clip.end
    );

    if (!clipToSplit) return;

    // Calculate positions
    const timelinePercent = (currentTime / duration) * 100;
    const clipStartPercent = (clipToSplit.start / duration) * 100;
    const splitPointRelativePercent = timelinePercent - clipStartPercent;
    
    // First part of the split
    const firstClip = {
      ...clipToSplit,
      end: currentTime,
      width: splitPointRelativePercent,
      duration: currentTime - clipToSplit.start,
    };

    // Second part of the split
    const secondClip = {
      ...clipToSplit,
      id: Date.now().toString(), // Generate new ID
      start: currentTime,
      left: timelinePercent,
      width: clipToSplit.width - splitPointRelativePercent,
      duration: clipToSplit.end - currentTime,
    };

    // Replace the original clip with the two new clips
    const newClips = clips.map(clip => 
      clip.id === clipToSplit.id ? firstClip : clip
    );
    newClips.push(secondClip);

    setClips(newClips);
  };

  const removeClip = (clipId: string) => {
    if (clips.length <= 1) return; // Always keep at least one clip
    setClips(clips.filter(clip => clip.id !== clipId));
  };

  // Update current time based on timeline click
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
  };

  // Format time as mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Timeline</div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm"
            variant="outline" 
            onClick={splitClipAtPlayhead}
            disabled={isDragging}
          >
            <Scissors className="h-4 w-4 mr-1" />
            Split
          </Button>
        </div>
      </div>

      {/* Time indicators */}
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>00:00</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Timeline track */}
      <div 
        ref={timelineRef}
        className="timeline-track relative"
        onClick={handleTimelineClick}
      >
        {/* Clips */}
        {clips.map((clip) => (
          <div
            key={clip.id}
            className={cn(
              "timeline-clip",
              activeClipId === clip.id && "ring-2 ring-primary z-10"
            )}
            style={{
              left: `${clip.left}%`,
              width: `${clip.width}%`,
            }}
            onMouseDown={(e) => handleMouseDown(e, clip.id, 'move')}
          >
            <div 
              className="timeline-clip-handle left"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, clip.id, 'trim-left');
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-2">
              <div className="truncate text-xs">
                {formatTime(clip.duration)}
              </div>
            </div>
            <div 
              className="timeline-clip-handle right"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, clip.id, 'trim-right');
              }}
            />

            {clips.length > 1 && (
              <button
                className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-destructive text-white opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                onClick={() => removeClip(clip.id)}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        {/* Playhead */}
        <div
          ref={playheadRef}
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 transform -translate-x-1/2 pointer-events-none"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
        </div>
      </div>

      {/* Current time indicator */}
      <div className="text-xs text-center mt-1">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default Timeline;
