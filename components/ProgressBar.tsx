import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const theme = useTheme();

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">Progress</span>
        <span className={`text-xs font-medium ${theme.text.primary}`}>{percentage}% Complete</span>
      </div>
      <div 
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percentage}% of metrics completed`}
        className="w-full bg-gray-700 rounded-full h-2"
      >
        <div 
          className={`${theme.background.secondary} h-2 rounded-full transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};