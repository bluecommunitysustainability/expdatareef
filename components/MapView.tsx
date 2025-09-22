import React, { useState, useEffect, useMemo, useRef } from 'react';
import Map, { Marker, MapRef } from 'react-map-gl';
import { destinationObjects } from '../constants/destinations';
import type { Poi } from '../types';
import { useTheme } from '../context/ThemeContext';
import { destinationThemes } from '../constants/teamColors';

interface MapViewProps {
  destination: string;
  onPoiSelect: (poi: Poi) => void;
  pois: Poi[];
  mapboxToken: string;
}

const icons: Record<Poi['category'], React.ReactNode> = {
    Attraction: <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>,
    Park: <path d="M17.31 11.22c-1.42-.42-2.33-1.8-2.33-3.22 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.42-.91 2.8-2.33 3.22 2.13.53 3.67 2.48 3.67 4.78h-1.5c0-2.09-1.4-3.87-3.33-4.52C16.51 11.4 15 9.84 15 8c0-1.1.9-2 2-2s2 .9 2 2c0 1.84-1.51 3.4-3.33 3.48-1.93.65-3.33 2.43-3.33 4.52H10c0-2.3 1.54-4.25 3.67-4.78C6.58 10.7 5.67 9.28 5.67 8c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5z"/>,
    Museum: <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>,
    Beach: <path d="M22.5,12.5c0-1.3-0.2-2.6-0.7-3.8L20,10.6c0,0.1,0.1,0.2,0.1,0.4c0,0.8-0.2,1.6-0.6,2.3L22,14.8C22.3,13.7,22.5,13.1,22.5,12.5z M18.1,7.4c-0.2-0.3-0.4-0.5-0.6-0.8L16,8.1C16.4,8.5,16.8,8.8,17.2,9.2L18.1,7.4z M1.5,12.5c0-0.6,0.1-1.2,0.4-1.8L4,12.2c-0.3,0.7-0.4,1.4-0.4,2.2c0-0.2-0.1-0.3-0.1-0.4L1.8,12.1C1.6,12.3,1.5,12.4,1.5,12.5z M9.2,9.2C8.8,8.8,8.4,8.5,8,8.1L6.5,9.6c0.2,0.3,0.4,0.5,0.6,0.8L9.2,9.2z M12,6.5c1.4,0,2.7,0.5,3.8,1.3l-1.9,1.9C13.4,9.3,12.7,9,12,9c-0.7,0-1.4,0.3-1.9,0.8L8.2,7.8C9.3,7,10.6,6.5,12,6.5z M12,16c-1.4,0-2.7-0.5-3.8-1.3l1.9-1.9c0.5,0.4,1.2,0.7,1.9,0.7s1.4-0.3,1.9-0.7l1.9,1.9C14.7,15.5,13.4,16,12,16z"/>,
    Landmark: <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>,
    Shopping: <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
};


export const MapView: React.FC<MapViewProps> = ({ destination, onPoiSelect, pois, mapboxToken }) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 27.994402, // Default to Florida
    longitude: -81.760254,
    zoom: 6,
    pitch: 30,
  });
  
  const themeColorHex = useMemo(() => {
    return (destinationThemes[destination] || destinationThemes['default']).hex;
  }, [destination]);

  const currentDestination = useMemo(() => {
    return destinationObjects.find(d => d.name === destination);
  }, [destination]);
  
  useEffect(() => {
    if (currentDestination) {
      setViewState(vs => ({
        ...vs,
        latitude: currentDestination.latitude,
        longitude: currentDestination.longitude,
        zoom: currentDestination.zoom,
      }));
    }
  }, [currentDestination]);

  if (!mapboxToken) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-400">Map Not Available</h2>
          <p className="mt-2 text-lg text-gray-400">
            A Mapbox access token has not been provided.
          </p>
          <p className="mt-2 text-gray-400">
            Please go to the <strong>Settings panel (⚙️)</strong> and enter your token to enable the map view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 h-full w-full overflow-hidden relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/landsurveyors/cmdxseqnc009m01s7f8thbezd"
        mapboxAccessToken={mapboxToken}
        attributionControl={false}
      >
        {pois.map(poi => {
            if (typeof poi.longitude !== 'number' || typeof poi.latitude !== 'number') {
                return null;
            }
            return (
                <Marker
                    key={`poi-${poi.name}`}
                    longitude={poi.longitude}
                    latitude={poi.latitude}
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        onPoiSelect(poi);
                    }}
                >
                    <button className="transform transition-transform hover:scale-125 focus:outline-none">
                        <svg 
                            height="32" 
                            viewBox="0 0 24 24" 
                            className="fill-current drop-shadow-lg"
                            style={{
                                color: themeColorHex,
                                stroke: 'white', 
                                strokeWidth: 1.5, 
                                strokeLinejoin: 'round' 
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                            <g transform="translate(6, 6) scale(0.4)">
                                {icons[poi.category]}
                            </g>
                        </svg>
                    </button>
                </Marker>
            );
        })}
      </Map>
      <div className="absolute bottom-0 right-0 bg-gray-900/50 text-white text-xs px-2 py-1">
        © Mapbox | © OpenStreetMap | Improve this map
      </div>
    </div>
  );
};