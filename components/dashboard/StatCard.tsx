import React from 'react';
import type { Question, SdgInfo, AnswerValue } from '../../types';
import { SdgInfo as SdgInfoComponent } from './SdgInfo';
import { useTheme } from '../../context/ThemeContext';

interface StatCardProps {
  question: Question;
  value: AnswerValue;
  sdgInfo?: SdgInfo;
  destination: string;
}

export const StatCard: React.FC<StatCardProps> = ({ question, value, sdgInfo, destination }) => {
  const questionText = question.text.replace(/{Destination}/g, destination).replace('What is the', '').replace('How many', '').replace('What percent of', '').trim();
  const theme = useTheme();
  
  const hasValue = value !== null && value !== undefined && value !== '';
  
  let displayValue: string | number = '--';
  if (hasValue) {
    if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
    } else if (typeof value === 'number') {
      displayValue = value.toLocaleString();
    } else {
        displayValue = value as string;
    }
  }

  return (
    <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700/50 flex flex-col justify-between h-full">
      <div>
        <p className="text-sm text-gray-400 capitalize">{questionText}</p>
        <p className={`text-4xl font-bold mt-2 truncate ${hasValue ? theme.text.primary : 'text-gray-500'}`}>
          {displayValue}
          {question.text.toLowerCase().includes('percent') && typeof value === 'number' ? '%' : ''}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-700/50">
        {sdgInfo ? (
            <SdgInfoComponent sdgInfo={sdgInfo} />
        ) : (
            <div className="h-[28px]"></div> // Placeholder for alignment
        )}
      </div>
    </div>
  );
};