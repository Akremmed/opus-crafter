
import React from 'react';
import { cn } from '@/lib/utils';

interface SubtitlesProps {
  text: string | null;
  isVisible: boolean;
}

const Subtitles: React.FC<SubtitlesProps> = ({ text, isVisible }) => {
  if (!text || !isVisible) return null;
  
  return (
    <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
      <div className={cn(
        "bg-black/70 text-white px-4 py-2 rounded-md max-w-[90%] text-center",
        "animate-fade-in transition-opacity",
        isVisible ? "opacity-100" : "opacity-0"
      )}>
        {text}
      </div>
    </div>
  );
};

export default Subtitles;
