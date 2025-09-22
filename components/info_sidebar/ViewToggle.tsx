import React from 'react';
import { useTheme } from '../../context/ThemeContext';

type View = 'grid' | 'list';

interface ViewToggleProps {
  view: View;
  setView: (view: View) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, setView }) => {
  const theme = useTheme();
  return (
    <div className="flex items-center bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => setView('grid')}
        className={`px-3 py-1 text-sm rounded-md transition-colors w-1/2 ${view === 'grid' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-600'}`}
      >
        Grid
      </button>
      <button
        onClick={() => setView('list')}
        className={`px-3 py-1 text-sm rounded-md transition-colors w-1/2 ${view === 'list' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-600'}`}
      >
        List
      </button>
    </div>
  );
};
