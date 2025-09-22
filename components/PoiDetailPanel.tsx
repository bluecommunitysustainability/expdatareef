import React from 'react';
import type { Poi } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PoiDetailPanelProps {
  poi: Poi | null;
  onClose: () => void;
}

const categoryStyles: Record<Poi['category'], string> = {
    Attraction: 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30',
    Park: 'bg-green-500/20 text-green-300 ring-green-500/30',
    Museum: 'bg-indigo-500/20 text-indigo-300 ring-indigo-500/30',
    Beach: 'bg-blue-500/20 text-blue-300 ring-blue-500/30',
    Landmark: 'bg-red-500/20 text-red-300 ring-red-500/30',
    Shopping: 'bg-pink-500/20 text-pink-300 ring-pink-500/30',
};

export const PoiDetailPanel: React.FC<PoiDetailPanelProps> = ({ poi, onClose }) => {
  const isOpen = !!poi;
  const theme = useTheme();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside 
        className={`fixed top-0 right-0 h-full bg-gray-800 shadow-2xl z-40 transition-transform duration-500 ease-in-out w-full md:w-1/2 lg:w-2/5 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="poi-panel-title"
      >
        <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-700">
          <h2 id="poi-panel-title" className={`text-xl font-bold ${theme.text.primary}`}>Point of Interest</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700" aria-label="Close POI details">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        {poi ? (
          <main className="flex-1 overflow-y-auto">
            {poi.imageUrl && (
              <div className="bg-gray-900">
                <img src={poi.imageUrl} alt={poi.name} className="w-full h-48 object-cover" />
              </div>
            )}
            <div className="p-6 space-y-4">
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${categoryStyles[poi.category]}`}>
                  {poi.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">{poi.name}</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {poi.description}
              </p>
            </div>
          </main>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">No location selected.</p>
          </div>
        )}
      </aside>
    </>
  );
};