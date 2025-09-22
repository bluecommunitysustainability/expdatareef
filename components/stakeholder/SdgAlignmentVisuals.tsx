
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
            <h4 className="text-md font-semibold text-gray-700 mb-3">SDG Alignment Progress</h4>
            <p className="text-sm text-gray-500 italic">No questions in this section are currently mapped to SDGs.</p>
        </div>
    );
  }

  return (
    <div className="mt-4 lg:mt-0">
      <h4 className="text-md font-semibold text-gray-700 mb-3">SDG Alignment Progress</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {alignments.map(({ sdg, score }) => (
          <div key={sdg.id} className="flex items-center gap-3 group" title={`${sdg.title} - ${score.toFixed(0)}% Complete`}>
            <img src={sdg.imageUrl} alt={sdg.title} className="w-8 h-8 object-contain flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 truncate">{sdg.title}</p>
              <div className="w-full bg-gray-300 rounded-full h-2.5 mt-1">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${score}%`, backgroundColor: sdg.color }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-800 w-10 text-right">{score.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
