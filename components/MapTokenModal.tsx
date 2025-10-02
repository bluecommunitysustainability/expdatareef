import React from 'react';
import { Modal } from './Modal';
import { useTheme } from '../context/ThemeContext';

interface MapTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSettings: () => void;
}

export const MapTokenModal: React.FC<MapTokenModalProps> = ({ isOpen, onClose, onGoToSettings }) => {
    const theme = useTheme();
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Mapbox Token Recommended">
            <div className="text-gray-300 space-y-4">
                <p>
                    You have loaded the map multiple times using the default public token. To ensure continued and uninterrupted access to map features, please add your own free Mapbox Access Token in the settings panel.
                </p>
                <div className="pt-4 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-700 rounded-md">Later</button>
                    <button onClick={onGoToSettings} className={`px-4 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md`}>Go to Settings</button>
                </div>
            </div>
        </Modal>
    );
};