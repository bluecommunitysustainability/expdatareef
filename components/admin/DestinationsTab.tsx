import React, { useState } from 'react';
import type { Destination } from '../../constants/destinations';
import { useTheme } from '../../context/ThemeContext';
import { destinationThemes } from '../../constants/teamColors';

interface DestinationsTabProps {
  destinations: Destination[];
  onUpdate: React.Dispatch<React.SetStateAction<Destination[]>>;
}

export const DestinationsTab: React.FC<DestinationsTabProps> = ({ destinations, onUpdate }) => {
  const [newDestName, setNewDestName] = useState('');
  const [newDestLat, setNewDestLat] = useState<number | ''>('');
  const [newDestLon, setNewDestLon] = useState<number | ''>('');
  const [newDestZoom, setNewDestZoom] = useState<number | ''>(10);
  const theme = useTheme();

  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDestName && newDestLat && newDestLon && newDestZoom) {
      const newDestination: Destination = {
        id: Date.now(),
        name: newDestName,
        latitude: newDestLat,
        longitude: newDestLon,
        zoom: newDestZoom,
      };

      onUpdate(prevDests => [...prevDests, newDestination]);
      
      setNewDestName('');
      setNewDestLat('');
      setNewDestLon('');
      setNewDestZoom(10);
      alert(`Destination "${newDestName}" added!`);
    } else {
        alert("Please fill out all fields for the new destination.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Manage Destinations ({destinations.length})</h3>
        <ul className="space-y-2">
          {destinations.map(dest => (
            <li key={dest.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md border border-gray-700">
              <span className="text-white">{dest.name}</span>
              <span className={`w-4 h-4 rounded-full bg-${(destinationThemes[dest.name] || destinationThemes['default']).name}-500`} title={`Theme: ${(destinationThemes[dest.name] || destinationThemes['default']).name}`}></span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Add New Destination</h3>
        <form onSubmit={handleAddDestination} className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <div>
            <label htmlFor="dest-name" className="block text-sm font-medium text-gray-300 mb-1">Destination Name</label>
            <input type="text" id="dest-name" value={newDestName} onChange={e => setNewDestName(e.target.value)} required className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="dest-lat" className="block text-sm font-medium text-gray-300 mb-1">Latitude</label>
                <input type="number" step="any" id="dest-lat" value={newDestLat} onChange={e => setNewDestLat(parseFloat(e.target.value))} required className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
            </div>
            <div>
                <label htmlFor="dest-lon" className="block text-sm font-medium text-gray-300 mb-1">Longitude</label>
                <input type="number" step="any" id="dest-lon" value={newDestLon} onChange={e => setNewDestLon(parseFloat(e.target.value))} required className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
            </div>
          </div>
          <div>
            <label htmlFor="dest-zoom" className="block text-sm font-medium text-gray-300 mb-1">Default Zoom Level</label>
            <input type="number" id="dest-zoom" value={newDestZoom} onChange={e => setNewDestZoom(parseInt(e.target.value, 10))} required className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
          </div>
          <button type="submit" className={`w-full py-3 px-4 rounded-md text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover}`}>Add Destination</button>
        </form>
        <p className="text-xs text-gray-500 mt-2">Note: A page reload may be required for the new destination to appear in all dropdowns.</p>
      </div>
    </div>
  );
};