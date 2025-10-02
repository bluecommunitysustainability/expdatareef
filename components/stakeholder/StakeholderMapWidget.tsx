import React, { useState } from 'react';
import { Modal } from '../Modal';
import { MapView } from '../MapView';

interface StakeholderMapWidgetProps {
  onMapLoad?: () => void;
}

export const StakeholderMapWidget: React.FC<StakeholderMapWidgetProps> = ({ onMapLoad }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-2 space-y-2">
      <div className="relative h-48 w-full rounded-md overflow-hidden border border-gray-700">
        <MapView height="100%" onMapLoad={onMapLoad} />
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
        <h4 id="map-pois-title">Map View</h4>
        <p>An interactive map showing a pre-defined route.</p>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sustainability Map Route">
            <div className="w-full h-[60vh] bg-gray-700">
                <MapView height="100%" onMapLoad={onMapLoad} />
            </div>
        </Modal>
      )}
    </div>
  );
};