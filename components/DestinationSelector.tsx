import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface DestinationSelectorProps {
  destinations: string[];
  selectedDestination: string;
  onSelectDestination: (destination: string) => void;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({ destinations, selectedDestination, onSelectDestination }) => {
  const theme = useTheme();

  return (
    <div className="mb-6">
      <label htmlFor="destination-select" className="block text-lg font-medium text-gray-300 mb-2">
        Select a Destination
      </label>
      <select
        id="destination-select"
        value={selectedDestination}
        onChange={(e) => onSelectDestination(e.target.value)}
        className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 ${theme.ring.primary} focus:border-${theme.name}-500 text-lg`}
      >
        <option value="">-- Please choose a destination --</option>
        {destinations.map((dest) => (
          <option key={dest} value={dest}>
            {dest}
          </option>
        ))}
      </select>
    </div>
  );
};
