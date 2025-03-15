
/**
 * Utility functions for video editing
 */

// Format time in seconds to MM:SS format
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format time in seconds to HH:MM:SS format
export const formatTimeHMS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString()}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins.toString()}:${secs.toString().padStart(2, '0')}`;
};

// Calculate thumbnail positions for a video timeline
export const calculateThumbnailPositions = (
  duration: number,
  count: number
): number[] => {
  const positions: number[] = [];
  const interval = duration / count;
  
  for (let i = 0; i < count; i++) {
    positions.push(i * interval);
  }
  
  return positions;
};

// Convert file size in bytes to human-readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Extract file name from path
export const getFileName = (path: string): string => {
  return path.split('/').pop() || path;
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Mock function to simulate video export
export const exportVideo = async (
  videoUrl: string,
  startTime: number,
  endTime: number,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (onProgress) onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        resolve('exported-video.mp4');
      }
    }, 200);
  });
};
