
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ExportProgressProps {
  isExporting: boolean;
  exportProgress: number;
}

const ExportProgress: React.FC<ExportProgressProps> = ({
  isExporting,
  exportProgress
}) => {
  if (!isExporting) return null;
  
  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Exporting Video...</h3>
        <span className="text-sm text-muted-foreground">{exportProgress}%</span>
      </div>
      <Progress value={exportProgress} className="h-2" />
    </div>
  );
};

export default ExportProgress;
