import React from 'react';
import type { SdgInfo as SdgInfoType } from '../../types';
import { sdgData } from '../../constants/sdgs';

interface SdgInfoProps {
  sdgInfo: SdgInfoType;
}

export const SdgInfo: React.FC<SdgInfoProps> = ({ sdgInfo }) => {

  return (
    <div className="flex items-center gap-2 relative group">
      {sdgInfo.sdgIds.map(id => {
        const goal = sdgData.find(g => g.id === id);
        if (!goal) return null;
        return (
          <div 
            key={id} 
            className="w-7 h-7 rounded-sm flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: goal.color }}
            title={goal.name}
          >
            {id}
          </div>
        );
      })}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 border border-gray-600 rounded-lg shadow-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <h4 className="font-bold text-gray-100 mb-1">SDG Alignment</h4>
          <p>{sdgInfo.explanation}</p>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};