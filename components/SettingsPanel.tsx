import React, { useState, useEffect, useRef } from 'react';
import type { ApiKeys } from '../types';
import { useTheme } from '../context/ThemeContext';
import { availableThemes } from '../constants/teamColors';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { keys: ApiKeys, model: string, logo?: string | null, color?: string }) => void;
  currentKeys: ApiKeys;
  currentModel: string;
  currentLogo?: string | null;
  currentColor?: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  onSave,
  currentKeys,
  currentModel,
  currentLogo,
  currentColor,
}) => {
  const [keys, setKeys] = useState<ApiKeys>(currentKeys);
  const [model, setModel] = useState(currentModel);
  const [logo, setLogo] = useState<string | null | undefined>(currentLogo);
  const [color, setColor] = useState<string | undefined>(currentColor);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  useEffect(() => {
    setKeys(currentKeys);
    setModel(currentModel);
    setLogo(currentLogo);
    setColor(currentColor);
  }, [isOpen, currentKeys, currentModel, currentLogo, currentColor]);

  const handleSave = () => {
    onSave({ keys, model, logo, color });
    onClose();
  };

  const handleKeyChange = (provider: keyof ApiKeys, value: string) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Branding</h3>
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Custom Logo</label>
              <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                      {logo ? <img src={logo} alt="Custom Logo Preview" className="max-w-full max-h-full object-contain" /> : <span className="text-gray-400 text-xs">Logo</span>}
                  </div>
                  <div className="flex-1">
                      <input type="file" accept="image/png, image/jpeg, image/gif, image/svg+xml" ref={fileInputRef} onChange={handleLogoChange} className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-md">Upload Logo</button>
                      {logo && <button onClick={() => setLogo(null)} className="px-3 py-2 text-sm text-red-500 hover:text-red-400 rounded-md ml-2">Remove</button>}
                  </div>
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
              <div className="flex flex-wrap gap-3">
                  {availableThemes.map(themeOption => (
                      <button 
                          key={themeOption.value}
                          onClick={() => setColor(themeOption.value)}
                          className={`w-8 h-8 rounded-full focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 transition-all ${color === themeOption.value ? 'ring-white' : 'ring-transparent hover:ring-gray-500'}`}
                          style={{ backgroundColor: themeOption.hex }}
                          title={themeOption.name}
                      />
                  ))}
                   <button 
                        onClick={() => setColor(undefined)}
                        className={`h-8 px-3 rounded-md focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 transition-all text-xs flex items-center gap-1 ${!color ? 'ring-white' : 'ring-transparent hover:ring-gray-500'} bg-gray-600`}
                    >
                      Default
                    </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">AI Configuration</h3>
             <div className="mt-4">
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
