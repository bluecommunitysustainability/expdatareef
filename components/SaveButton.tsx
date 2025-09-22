import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface SaveButtonProps {
  onSave: () => void;
  onLoad: () => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onSave, onLoad, saveStatus }) => {
  const theme = useTheme();
  
  const getButtonContent = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'saved':
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        );
      case 'error':
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
        );
      default: // idle
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        );
    }
  };
  
  const getButtonClass = () => {
    let baseClass = `p-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${theme.ring.primary} disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-300`;
    
    switch (saveStatus) {
      case 'saved':
        return `${baseClass} bg-green-600`;
      case 'error':
        return `${baseClass} bg-red-600`;
      case 'saving':
         return `${baseClass} bg-gray-500`;
      default: // idle
        return `${baseClass} bg-gray-600 hover:bg-gray-700`;
    }
  };
  
  const getSaveTitle = () => {
    switch(saveStatus) {
        case 'saving': return 'Saving...';
        case 'saved': return 'Saved successfully!';
        case 'error': return 'Save failed. Click to retry.';
        default: return 'Progress is saved automatically. Click to save now.';
    }
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={onSave}
        disabled={saveStatus === 'saving'}
        className={getButtonClass()}
        title={getSaveTitle()}
      >
        {getButtonContent()}
      </button>
      <button
        onClick={onLoad}
        className="p-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
        title="Load progress from last session"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8c.5 0 1 0 1.5.1M20 12a8 8 0 01-8 8c-.5 0-1 0-1.5-.1" />
        </svg>
      </button>
    </div>
  );
};