import React from 'react';
import type { Question, SdgInfo } from '../../types';
import { SdgInfo as SdgInfoComponent } from './SdgInfo';
import { useTheme } from '../../context/ThemeContext';

interface QualitativeCardProps {
  question: Question;
  value: string;
  sdgInfo?: SdgInfo;
  onReadMore: () => void;
  destination: string;
}

export const QualitativeCard: React.FC<QualitativeCardProps> = ({ question, value, sdgInfo, onReadMore, destination }) => {
  const questionText = question.text.replace(/{Destination}/g, destination);
  const hasValue = value !== null && value !== undefined && value.trim() !== '';
  const theme = useTheme();

  return (
    <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700/50 flex flex-col justify-between h-full">
      <div>
        <p className="text-sm font-medium text-gray-400">{questionText}</p>
        <p className={`mt-2 text-sm line-clamp-3 ${hasValue ? 'text-gray-300' : 'text-gray-500 italic'}`}>
          {hasValue ? value : 'No data provided.'}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-700/50 flex justify-between items-center">
        {sdgInfo ? (
            <SdgInfoComponent sdgInfo={sdgInfo} />
        ) : (
            <div className="h-[28px]"></div> // Placeholder for alignment
        )}
        <button 
          onClick={onReadMore} 
          disabled={!hasValue}
          className={`text-sm font-semibold ${theme.text.primary} hover:text-${theme.name}-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed`}
        >
          Read More &rarr;
        </button>
      </div>
    </div>
  );
};