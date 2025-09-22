import React, { useState } from 'react';
import type { SdgDetailInfo } from '../../types';
import { SdgModal } from './SdgModal';

interface SdgTabProps {
  data: SdgDetailInfo[];
}

export const SdgTab: React.FC<SdgTabProps> = ({ data }) => {
  const [selectedSdg, setSelectedSdg] = useState<SdgDetailInfo | null>(null);

  const handleCardClick = (sdg: SdgDetailInfo) => {
    setSelectedSdg(sdg);
  };

  const handleCloseModal = () => {
    setSelectedSdg(null);
  };

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {data.map(item => (
          <button
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="bg-gray-700/50 p-2 rounded-lg cursor-pointer hover:bg-gray-600/80 transition-all aspect-square flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
            title={item.title}
          >
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>
      <SdgModal
        isOpen={!!selectedSdg}
        onClose={handleCloseModal}
        sdg={selectedSdg}
      />
    </>
  );
};