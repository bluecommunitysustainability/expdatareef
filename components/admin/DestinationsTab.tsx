import React, { useState } from 'react';
import type { Destination } from '../../constants/destinations';
import { useTheme } from '../../context/ThemeContext';
import { destinationThemes } from '../../constants/teamColors';
import { AddDestinationModal } from './AddDestinationModal';
import type { ApiKeys } from '../../types';


interface DestinationsTabProps {
  destinations: Destination[];
  onUpdate: React.Dispatch<React.SetStateAction<Destination[]>>;
  onAddNewDestination: (newDestination: Destination) => Promise<void>;
  mapboxToken: string;
  apiKeys: ApiKeys;
}

export const DestinationsTab: React.FC<DestinationsTabProps> = ({ destinations, onUpdate, onAddNewDestination, mapboxToken, apiKeys }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const theme = useTheme();

  return (
    <>
      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Manage Destinations ({destinations.length})</h3>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className={`px-4 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md flex items-center gap-2`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Destination
            </button>
          </div>
          <ul className="space-y-2">
            {destinations.map(dest => (
              <li key={dest.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md border border-gray-700">
                <span className="text-white">{dest.name}</span>
                <span className={`w-4 h-4 rounded-full bg-${(destinationThemes[dest.name] || { name: dest.color || 'teal' }).name}-500`} title={`Theme: ${(destinationThemes[dest.name] || {name: dest.color || 'default'}).name}`}></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <AddDestinationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDestination={onAddNewDestination}
        mapboxToken={mapboxToken}
        apiKeys={apiKeys}
      />
    </>
  );
};