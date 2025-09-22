import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface CheckSheetButtonProps {
  onClick: () => void;
  isChecking?: boolean; // isChecking is now optional
}

export const CheckSheetButton: React.FC<CheckSheetButtonProps> = ({ onClick, isChecking }) => {
  const theme = useTheme();

  return (
    <button
      onClick={onClick}
      disabled={isChecking}
      title="Data Sync"
      className={`p-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${theme.ring.primary} disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
      </svg>
    </button>
  );
};
