import React, { useState, useEffect } from 'react';
import type { ApiKeys } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { keys: ApiKeys, model: string }) => void;
  currentKeys: ApiKeys;
  currentModel: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  onSave,
  currentKeys,
  currentModel
}) => {
  const [keys, setKeys] = useState<ApiKeys>(currentKeys);
  const [model, setModel] = useState(currentModel);
  const theme = useTheme();

  useEffect(() => {
    setKeys(currentKeys);
    setModel(currentModel);
  }, [isOpen, currentKeys, currentModel]);

  const handleSave = () => {
    onSave({ keys, model });
    onClose();
  };

  const handleKeyChange = (provider: keyof ApiKeys, value: string) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  return (
     <>
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside 
        className={`fixed top-0 left-0 h-full bg-gray-800 shadow-2xl z-50 transition-transform duration-500 ease-in-out w-full max-w-md flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className={`text-xl font-bold ${theme.text.primary}`}>Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-300 mb-1">
              Active AI Model
            </label>
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${theme.ring.primary}`}
            >
              <option value="gemini">Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
            </select>
          </div>

          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">API Keys</h3>
             <div>
                <label htmlFor="mapbox-key" className="block text-sm font-medium text-gray-300 mb-1">Mapbox Access Token</label>
                <input id="mapbox-key" type="password" value={keys.mapbox} onChange={(e) => handleKeyChange('mapbox', e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
             </div>
             <div>
                <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-300 mb-1">Gemini API Key</label>
                <input id="gemini-key" type="password" value={keys.gemini} onChange={(e) => handleKeyChange('gemini', e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
             </div>
             <div>
                <label htmlFor="openai-key" className="block text-sm font-medium text-gray-300 mb-1">OpenAI API Key</label>
                <input id="openai-key" type="password" value={keys.openai} onChange={(e) => handleKeyChange('openai', e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
             </div>
             <div>
                <label htmlFor="claude-key" className="block text-sm font-medium text-gray-300 mb-1">Claude API Key</label>
                <input id="claude-key" type="password" value={keys.claude} onChange={(e) => handleKeyChange('claude', e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
             </div>
          </div>
        </main>
        
        <footer className="p-4 border-t border-gray-700">
            <button
              onClick={handleSave}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${theme.ring.primary}`}
            >
              Save Settings
            </button>
        </footer>
      </aside>
    </>
  );
};