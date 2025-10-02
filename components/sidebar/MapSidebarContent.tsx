import React from 'react';

interface MapSidebarContentProps {
  destination: string;
}

export const MapSidebarContent: React.FC<MapSidebarContentProps> = ({ destination }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-4 px-2">Map View</h3>
      <ul className="space-y-1">
          <li className="block py-2 px-3 text-gray-400">
            <span className="font-semibold text-gray-300">Current Destination:</span> {destination}
          </li>
          <li className="px-3 py-2 text-sm text-gray-500">
            Displaying a static map view. Dynamic points of interest and tour creation are disabled.
          </li>
      </ul>
    </div>
  );
};
