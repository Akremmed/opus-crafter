
import { generateId } from './videoUtils';

// Type for the detected interesting segments
export interface VideoSegment {
  id: string;
  start: number;
  end: number;
  confidence: number;
  transcript: string;
}

// Function to extract video ID from YouTube URL
export const extractYoutubeId = (url: string): string | null => {
  const regex = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regex);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Generate a thumbnail URL from YouTube video ID
export const getYoutubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

// Convert YouTube video ID to embed URL
export const getYoutubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

// Mock function to simulate AI analysis of video for interesting parts
export const analyzeVideoContent = async (
  youtubeUrl: string,
  onProgress?: (progress: number) => void
): Promise<{
  videoUrl: string;
  segments: VideoSegment[];
  duration: number;
}> => {
  // Extract the YouTube video ID
  const videoId = extractYoutubeId(youtubeUrl);
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  // In a real implementation, this would connect to a backend service
  // that processes the YouTube video and returns interesting segments

  // Simulate processing delay
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 5;
    if (onProgress) onProgress(progress);
    if (progress >= 100) clearInterval(progressInterval);
  }, 300);

  // Simulate AI analysis with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      clearInterval(progressInterval);
      if (onProgress) onProgress(100);
      
      // Mock data - in a real app, this would come from AI analysis
      const mockDuration = 120; // 2 minutes
      const mockSegments: VideoSegment[] = [
        {
          id: generateId(),
          start: 10,
          end: 25,
          confidence: 0.92,
          transcript: "This is the most interesting part of the video with key information."
        },
        {
          id: generateId(),
          start: 45,
          end: 65,
          confidence: 0.87,
          transcript: "Here's another highlight that would make a great short."
        },
        {
          id: generateId(),
          start: 90,
          end: 105,
          confidence: 0.95,
          transcript: "This emotional moment will resonate with the audience."
        }
      ];
      
      // Generate YouTube embed URL
      const embedUrl = getYoutubeEmbedUrl(videoId);
      
      resolve({
        videoUrl: embedUrl, // Use YouTube embed URL which will play in the iframe
        segments: mockSegments,
        duration: mockDuration
      });
    }, 3000); // Reduced to 3 seconds for better UX
  });
};

// Process segments into timeline clips that can be used in the editor
export const segmentsToClips = (segments: VideoSegment[], duration: number) => {
  return segments.map(segment => {
    const left = (segment.start / duration) * 100;
    const width = ((segment.end - segment.start) / duration) * 100;
    
    return {
      id: segment.id,
      start: segment.start,
      end: segment.end,
      duration: segment.end - segment.start,
      left,
      width,
      transcript: segment.transcript
    };
  });
};
