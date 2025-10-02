import React from 'react';
import type { SdgDetailInfo } from '../../types';

interface SdgAlignmentVisualsProps {
  alignments: {
    sdg: SdgDetailInfo;
    score: number;
  }[];
  themeMode: 'light' | 'dark';
}

export const SdgAlignmentVisuals: React.FC<SdgAlignmentVisualsProps> = ({ alignments, themeMode }) => {
    
  const headingColor = themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const mutedTextColor = themeMode === 'dark' ? 'text-gray-500' : 'text-gray-500';
  const scoreTextColor = themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const progressBg = themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
    
  if (alignments.length === 0) {
    return (
        <div>
            <h4 className={`text-md font-semibold ${headingColor} mb-3`}>SDG Alignment Progress</h4>
            <p className={`text-sm ${mutedTextColor} italic`}>No questions in this section are currently mapped to SDGs.</p>
        </div>
    );
  }

  return (
    <div className="mt-4 md:mt-0">
      <h4 className={`text-md font-semibold ${headingColor} mb-3`}>SDG Alignment Progress</h4>
      <div className="grid grid-cols-1 gap-y-4">
        {alignments.map(({ sdg, score }) => (
          <div key={sdg.id} className="flex items-center gap-3 group" title={`${sdg.title} - ${score.toFixed(0)}% Complete`}>
            <img src={sdg.imageUrl} alt={sdg.title} className="w-8 h-8 object-contain flex-shrink-0" />
            <div className="flex-1">
              <p className={`text-xs font-medium ${mutedTextColor} truncate group-hover:text-gray-400`}>{sdg.title}</p>
              <div 
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={100}
                className={`w-full ${progressBg} rounded-full h-2.5 mt-1`}
              >
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${score}%`, backgroundColor: sdg.color }}
                />
                <span className="sr-only">{`${sdg.title}: ${score.toFixed(0)}% alignment`}</span>
              </div>
            </div>
            <span className={`text-sm font-semibold ${scoreTextColor} w-10 text-right`}>{score.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};