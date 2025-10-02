import React, { useState } from 'react';
import type { Poi, Tour, Answers, Question } from '../../types';
import { scanAnswersForPois, generateTourRoute } from '../../utils/mapUtils';
import { useTheme } from '../../context/ThemeContext';

interface MapSidebarContentProps {
  destination: string;
  onPoiSelect: (poi: Poi) => void;
  pointsOfInterest: Poi[];
  setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
  mapboxToken: string;
  isAdmin: boolean;
  isMonitorOrAdmin: boolean;
  answers: Answers;
  questions: Question[];
  setPois: React.Dispatch<React.SetStateAction<Poi[]>>;
  isMapSelectionMode: boolean;
  setIsMapSelectionMode: (value: boolean) => void;
  mapSelectedPoiIds: string[];
  setMapSelectedPoiIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const MapSidebarContent: React.FC<MapSidebarContentProps> = ({ 
    destination, 
    onPoiSelect, 
    pointsOfInterest, 
    setTours, 
    mapboxToken, 
    isAdmin,
    isMonitorOrAdmin,
    answers,
    questions,
    setPois,
    isMapSelectionMode,
    setIsMapSelectionMode,
    mapSelectedPoiIds,
    setMapSelectedPoiIds,
}) => {
  const [tourName, setTourName] = useState('');
  const [tourDescription, setTourDescription] = useState('');
  const [tourType, setTourType] = useState<'walking' | 'transit'>('walking');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanningPois, setIsScanningPois] = useState(false);
  const theme = useTheme();

  const handleAiPoiScan = async () => {
    if (isScanningPois) return;
    setIsScanningPois(true);
    try {
        const newPoisData = await scanAnswersForPois(answers, questions, destination);
        if (newPoisData.length === 0) {
            alert("AI scan did not find any new points of interest in the provided answers.");
            return;
        }
        const newPois = newPoisData.map((p, i) => ({
            ...p,
            id: `poi-ai-${Date.now()}-${i}`,
            status: 'staged' as const
        }));
        setPois(prev => [...prev, ...newPois]);
        alert(`Successfully added ${newPois.length} new AI-suggested POI(s) to the map.`);
    } catch (error) {
        console.error("Error scanning for POIs:", error);
        alert(`Failed to scan for POIs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        setIsScanningPois(false);
    }
  };
  
  const handleToggleTourCreation = () => {
    setIsMapSelectionMode(!isMapSelectionMode);
    // if we are turning it off, clear selections
    if (isMapSelectionMode) {
        setMapSelectedPoiIds([]);
    }
  };


  const handleGenerateTour = async () => {
    if (mapSelectedPoiIds.length < 2) {
      alert("Please select at least two points of interest on the map for the tour.");
      return;
    }
    if (!tourName) {
      alert("Please provide a name for the tour.");
      return;
    }
    setIsGenerating(true);
    try {
      const selectedPois = pointsOfInterest.filter(p => mapSelectedPoiIds.includes(p.id));
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
      setIsMapSelectionMode(false);
      setMapSelectedPoiIds([]);
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
      <h3 className="text-lg font-semibold text-gray-200 mb-4 px-2">Map Tools</h3>
      
      {isMonitorOrAdmin && (
        <div className="mt-2 px-2 space-y-3">
           <button 
                onClick={handleAiPoiScan} 
                disabled={isScanningPois}
                className="w-full p-2 text-sm font-semibold rounded-md transition-colors bg-sky-600 hover:bg-sky-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isScanningPois ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Scanning...
                    </>
                ) : '✨ AI POI Discovery'}
            </button>
           <button 
                onClick={handleToggleTourCreation} 
                className={`w-full p-2 text-sm font-semibold rounded-md transition-colors ${isMapSelectionMode ? 'bg-red-600 hover:bg-red-700' : `${theme.background.primary} ${theme.background.hover}`}`}
            >
                {isMapSelectionMode ? 'Cancel Tour Creation' : '🗺️ Create AI-Powered Tour'}
            </button>
        </div>
      )}

      {isMapSelectionMode && isMonitorOrAdmin && (
        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg space-y-4 animate-fade-in">
          <h4 className="font-semibold text-white">New Tour</h4>
          <div>
            <label className="text-xs text-gray-400">1. Select points on the map ({mapSelectedPoiIds.length} selected)</label>
            <div className="max-h-32 overflow-y-auto space-y-1 mt-1 bg-gray-800 p-2 rounded-md border border-gray-700">
              {mapSelectedPoiIds.length > 0 ? (
                  <ul className="space-y-1">
                      {pointsOfInterest
                          .filter(poi => mapSelectedPoiIds.includes(poi.id))
                          .map(poi => (
                              <li key={poi.id} className="text-sm text-gray-300 truncate px-1">
                                  - {poi.name}
                              </li>
                          ))
                      }
                  </ul>
              ) : (
                  <p className="text-sm text-gray-400 italic text-center p-2">Click markers on the map to begin.</p>
              )}
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
                <option value="transit">Driving / Transit</option>
            </select>
          </div>
          <button onClick={handleGenerateTour} disabled={isGenerating || mapSelectedPoiIds.length < 2} className="w-full p-2 text-sm font-semibold rounded-md bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center">
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
