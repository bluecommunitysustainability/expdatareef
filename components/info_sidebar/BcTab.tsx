import React, { useState, useMemo } from 'react';
import type { BcStrategy, InfoModalData } from '../../types';
import { ViewToggle } from './ViewToggle';

interface BcTabProps {
  data: BcStrategy[];
  onItemClick: (item: InfoModalData) => void;
}

export const BcTab: React.FC<BcTabProps> = ({ data, onItemClick }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const renderItem = (item: BcStrategy) => (
    <div
      key={item.name}
      onClick={() => onItemClick(item)}
      className="bg-gray-700/50 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center gap-3"
    >
      <img src={item.iconUrl} alt={item.name} className="w-10 h-10 object-contain flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-gray-200 text-sm">{item.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search Blue Community Strategies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <ViewToggle view={view} setView={setView} />
      </div>

       {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredData.map(item => (
            <div
              key={item.name}
              onClick={() => onItemClick(item)}
              className="bg-gray-700/50 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex flex-col items-center justify-center text-center aspect-square"
            >
              <img src={item.iconUrl} alt={item.name} className="w-12 h-12 object-contain mb-2" />
              <h3 className="font-semibold text-gray-200 text-xs">{item.name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredData.map(renderItem)}
        </div>
      )}
    </div>
  );
};
