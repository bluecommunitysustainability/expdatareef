import React from 'react';
import type { SdgDetailInfo } from '../../types';

interface SdgAlignmentVisualsProps {
  alignments: {
    sdg: SdgDetailInfo;
    score: number;
  }[];
}

export const SdgAlignmentVisuals: React.FC<SdgAlignmentVisualsProps> = ({ alignments }) => {
    
  if (alignments.length === 0) {
    return (
        <div>
            <h4 className={`text-md font-semibold text-gray-300 mb-3`}>SDG Alignment Progress</h4>
            <p className={`text-sm text-gray-500 italic`}>No questions in this section are currently mapped to SDGs.</p>
        </div>
    );
  }

  return (
    <div>
      <h4 className={`text-md font-semibold text-gray-300 mb-3`}>SDG Alignment Progress</h4>
      <div className="flex flex-col gap-3">
        {alignments.map(({ sdg, score }) => (
          <div key={sdg.id} className="flex items-center gap-3 group" title={`${sdg.title} - ${score.toFixed(0)}% Complete`}>
            <img src={sdg.imageUrl} alt={sdg.title} className="w-8 h-8 object-contain flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <p className={`text-sm font-medium text-gray-400 truncate group-hover:text-gray-300`}>{sdg.title}</p>
                <span className={`text-sm font-semibold text-gray-200`}>{score.toFixed(0)}%</span>
              </div>
              <div 
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={100}
                className={`w-full bg-gray-700 rounded-full h-2 mt-1`}
              >
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${score}%`, backgroundColor: sdg.color }}
                />
                <span className="sr-only">{`${sdg.title}: ${score.toFixed(0)}% alignment`}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};