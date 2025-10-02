import React, { useState, useMemo, useRef } from 'react';
import Map, { Marker, Source, Layer, MapRef } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import type { Poi, Tour } from '../../types';
import { Modal } from '../Modal';
import { useTheme } from '../../context/ThemeContext';
import { availableThemes } from '../../constants/teamColors';

// To resolve the cross-origin worker issue in sandboxed environments,
// we disable the map worker. For this app's use case, the performance impact is negligible.
// @ts-ignore
if (mapboxgl.workerCount !== 0) {
  // @ts-ignore
  mapboxgl.workerCount = 0;
}

interface StakeholderMapWidgetProps {
  pois: Poi[];
  tours: Tour[];
  mapboxToken: string;
}

const MapContent: React.FC<{
    pois: Poi[],
    tours: Tour[],
    mapboxToken: string,
    initialViewState?: any
}> = ({ pois, tours, mapboxToken, initialViewState }) => {
    const [selectedTour, setSelectedTour] = useState<Tour | null>(tours.length > 0 ? tours[0] : null);
    const theme = useTheme();

    const themeColorHex = useMemo(() => {
        return availableThemes.find(t => t.value === theme.name)?.hex || '#14b8a6'; // default to teal
    }, [theme.name]);

    const tourRoute = useMemo(() => {
        if (!selectedTour) return null;
        return {
            type: 'Feature' as const,
            properties: {},
            geometry: selectedTour.routeGeoJson
        };
    }, [selectedTour]);

    return (
        <div className="w-full h-full bg-gray-700 relative">
            <Map
                initialViewState={initialViewState || { longitude: -81.7, latitude: 27.9, zoom: 6, pitch: 30 }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                projection={{name: 'globe'}}
                mapboxAccessToken={mapboxToken}
            >
                {pois.map(poi => (
                    <Marker key={poi.id} longitude={poi.longitude} latitude={poi.latitude}>
                        <div style={{ color: themeColorHex }} className="text-2xl drop-shadow-lg" title={poi.name}>📍</div>
                    </Marker>
                ))}
                {tourRoute && (
                    <Source id="tour-route" type="geojson" data={tourRoute}>
                        <Layer
                            id="route"
                            type="line"
                            source="tour-route"
                            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                            paint={{ 'line-color': themeColorHex, 'line-width': 4, 'line-opacity': 0.8 }}
                        />
                    </Source>
                )}
            </Map>
            {tours.length > 0 && (
                <div className="absolute top-2 left-2 bg-gray-800/80 p-2 rounded-md shadow-lg">
                    <label htmlFor="tour-select" className="sr-only">Select a tour</label>
                    <select
                        id="tour-select"
                        value={selectedTour?.id || ''}
                        onChange={e => setSelectedTour(tours.find(t => t.id === e.target.value) || null)}
                        className="bg-gray-700 text-white text-xs border border-gray-600 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {tours.map(tour => (
                            <option key={tour.id} value={tour.id}>{tour.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};


export const StakeholderMapWidget: React.FC<StakeholderMapWidgetProps> = ({ pois, tours, mapboxToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!mapboxToken) return null; // Don't render if no token

  return (
    <div className="p-2 space-y-2">
      <div className="relative h-48 w-full rounded-md overflow-hidden border border-gray-700">
        <MapContent pois={pois} tours={tours} mapboxToken={mapboxToken} />
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-1 right-1 bg-gray-900/50 p-1.5 rounded-full text-white hover:bg-gray-800"
          title="Open full-screen map"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
          </svg>
        </button>
      </div>

      <div className="sr-only">
        <h4 id="map-pois-title">Published Points of Interest</h4>
        <ul aria-labelledby="map-pois-title">
          {pois.map(poi => <li key={poi.id}>{poi.name}: {poi.description}</li>)}
        </ul>
        <h4 id="map-tours-title">Published Tours</h4>
        <ul aria-labelledby="map-tours-title">
          {tours.map(tour => <li key={tour.id}>{tour.name}: {tour.description}</li>)}
        </ul>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sustainability Map & Tours">
            <div className="w-full h-[60vh] bg-gray-700">
                <MapContent pois={pois} tours={tours} mapboxToken={mapboxToken} />
            </div>
             <div className="mt-4 max-h-32 overflow-y-auto">
                 {tours.map(tour => (
                     <div key={tour.id} className="p-2 border-b border-gray-700">
                         <h4 className="font-semibold text-white">{tour.name}</h4>
                         <p className="text-sm text-gray-400">{tour.description}</p>
                     </div>
                 ))}
             </div>
        </Modal>
      )}
    </div>
  );
};