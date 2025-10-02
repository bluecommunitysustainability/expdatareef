import React, { useState } from 'react';
import type { Poi, Tour } from '../../types';
import { generateTourRoute } from '../../utils/mapUtils';
import { useTheme } from '../../context/ThemeContext';

interface MapSidebarContentProps {
  destination: string;
  onPoiSelect: (poi: Poi) => void;
  pointsOfInterest: Poi[];
  setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
  mapboxToken: string;
  isAdmin: boolean;
}

export const MapSidebarContent: React.FC<MapSidebarContentProps> = ({ destination, onPoiSelect, pointsOfInterest, setTours, mapboxToken, isAdmin }) => {
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [selectedPoiIds, setSelectedPoiIds] = useState<string[]>([]);
  const [tourName, setTourName] = useState('');
  const [tourDescription, setTourDescription] = useState('');
  const [tourType, setTourType] = useState<'walking' | 'transit'>('walking');
  const [isGenerating, setIsGenerating] = useState(false);
  const theme = useTheme();

  const handlePoiSelection = (poiId: string) => {
    setSelectedPoiIds(prev =>
      prev.includes(poiId) ? prev.filter(id => id !== poiId) : [...prev, poiId]
    );
  };

  const handleGenerateTour = async () => {
    if (selectedPoiIds.length < 2) {
      alert("Please select at least two points of interest for the tour.");
      return;
    }
    if (!tourName) {
      alert("Please provide a name for the tour.");
      return;
    }
    setIsGenerating(true);
    try {
      const selectedPois = pointsOfInterest.filter(p => selectedPoiIds.includes(p.id));
      const { routeGeoJson, poiIds } = await generateTourRoute(selectedPois, tourType, mapboxToken);
      
      const newTour: Tour = {
        id: `tour-${Date.now()}`,
        name: tourName,
        description: tourDescription,
        type: tourType,
        poiIds: poiIds,
        routeGeoJson: routeGeoJson,
        status: 'staged',
      };

      setTours(prev => [...prev, newTour]);
      alert("Tour generated and saved as a staged item!");
      // Reset form
      setIsCreatingTour(false);
      setSelectedPoiIds([]);
      setTourName('');
      setTourDescription('');
    } catch (error) {
      console.error("Error generating tour:", error);
      alert(`Failed to generate tour: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-4 px-2">Map Details</h3>
      <ul className="space-y-1">
          <li className="block py-2 px-3 text-gray-400">
            <span className="font-semibold text-gray-300">Current Destination:</span> {destination}
          </li>
      </ul>

      {isAdmin && (
        <div className="mt-6 px-2">
           <button 
                onClick={() => setIsCreatingTour(p => !p)} 
                className={`w-full p-2 text-sm font-semibold rounded-md transition-colors ${isCreatingTour ? 'bg-red-600 hover:bg-red-700' : `${theme.background.primary} ${theme.background.hover}`}`}
            >
                {isCreatingTour ? 'Cancel Tour Creation' : '✨ Create AI-Powered Tour'}
            </button>
        </div>
      )}

      {isCreatingTour && isAdmin && (
        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg space-y-4 animate-fade-in">
          <h4 className="font-semibold text-white">New Tour</h4>
          <div>
            <label className="text-xs text-gray-400">1. Select points for the tour</label>
            <div className="max-h-32 overflow-y-auto space-y-1 mt-1 bg-gray-800 p-2 rounded-md">
              {pointsOfInterest.map(poi => (
                <label key={poi.id} className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded-md cursor-pointer">
                  <input type="checkbox" checked={selectedPoiIds.includes(poi.id)} onChange={() => handlePoiSelection(poi.id)} className={`h-4 w-4 rounded bg-gray-600 border-gray-500 text-${theme.name}-500 focus:ring-${theme.name}-500`} />
                  <span className="text-sm text-gray-300">{poi.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="tour-name" className="text-xs text-gray-400">2. Tour Name</label>
            <input id="tour-name" type="text" value={tourName} onChange={e => setTourName(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-md p-1.5 text-sm mt-1" />
          </div>
           <div>
            <label htmlFor="tour-desc" className="text-xs text-gray-400">3. Description</label>
            <textarea id="tour-desc" value={tourDescription} onChange={e => setTourDescription(e.target.value)} rows={2} className="w-full bg-gray-800 border border-gray-600 rounded-md p-1.5 text-sm mt-1" />
          </div>
           <div>
            <label htmlFor="tour-type" className="text-xs text-gray-400">4. Tour Type</label>
            <select id="tour-type" value={tourType} onChange={e => setTourType(e.target.value as 'walking' | 'transit')} className="w-full bg-gray-800 border border-gray-600 rounded-md p-1.5 text-sm mt-1">
                <option value="walking">Walking</option>
                <option value="transit">Public Transit</option>
            </select>
          </div>
          <button onClick={handleGenerateTour} disabled={isGenerating} className="w-full p-2 text-sm font-semibold rounded-md bg-green-600 hover:bg-green-700 disabled:bg-gray-600 flex items-center justify-center">
            {isGenerating ? <><svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...</> : 'Generate Tour'}
          </button>
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-200 mb-4 mt-6 px-2">Points of Interest</h3>
      <ul className="space-y-1">
        {pointsOfInterest.length > 0 ? pointsOfInterest.map(point => (
            <li key={point.id}>
              <button
                onClick={(e) => { e.preventDefault(); onPoiSelect(point); }}
                className="w-full text-left block py-2 px-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors flex items-center"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {point.name}
              </button>
            </li>
          )) : (
            <li className="px-3 py-2 text-sm text-gray-500">No points of interest found.</li>
          )
        }
      </ul>
    </div>
  );
};
