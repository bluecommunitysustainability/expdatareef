import React from 'react';
import type { Poi } from '../../types';

interface MapSidebarContentProps {
  destination: string;
  onPoiSelect: (poi: Poi) => void;
  pointsOfInterest: Poi[];
}

export const MapSidebarContent: React.FC<MapSidebarContentProps> = ({ destination, onPoiSelect, pointsOfInterest }) => {

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-4 px-2">Map Details</h3>
      <ul className="space-y-1">
          <li className="block py-2 px-3 text-gray-400">
            <span className="font-semibold text-gray-300">Current Destination:</span> {destination}
          </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-200 mb-4 mt-6 px-2">Points of Interest</h3>
      <ul className="space-y-1">
        {pointsOfInterest.length > 0 ? pointsOfInterest.map(point => (
            <li key={point.name}>
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
