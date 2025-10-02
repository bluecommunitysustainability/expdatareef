import React, { useRef } from 'react';
import type { UserProfile, ApiKeys } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { availableThemes } from '../../constants/teamColors';

interface BrandingSettingsTabProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const BrandingSettingsTab: React.FC<BrandingSettingsTabProps> = ({ profile, setProfile }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();
    
    const handleKeyChange = (provider: keyof ApiKeys, value: string) => {
        if (profile) {
            const newKeys = { ...profile.apiKeys, [provider]: value };
            setProfile({ ...profile, apiKeys: newKeys });
        }
    };
    
    const handleSettingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (profile) {
            setProfile({ ...profile, [e.target.name]: e.target.value });
        }
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && profile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, customLogo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleColorChange = (colorValue?: string) => {
        if (profile) {
            setProfile({ ...profile, primaryColor: colorValue });
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Branding</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Custom Logo</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                            {profile.customLogo ? <img src={profile.customLogo} alt="Custom Logo Preview" className="max-w-full max-h-full object-contain" /> : <span className="text-gray-400 text-xs">Logo</span>}
                        </div>
                        <div className="flex-1">
                            <input type="file" accept="image/png, image/jpeg, image/gif, image/svg+xml" ref={fileInputRef} onChange={handleLogoChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-md">Upload Logo</button>
                            {profile.customLogo && <button onClick={() => setProfile({ ...profile, customLogo: undefined })} className="px-3 py-2 text-sm text-red-500 hover:text-red-400 rounded-md ml-2">Remove</button>}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                    <div className="flex flex-wrap gap-3">
                        {availableThemes.map(themeOption => (
                            <button 
                                key={themeOption.value}
                                onClick={() => handleColorChange(themeOption.value)}
                                className={`w-8 h-8 rounded-full focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 transition-all ${profile.primaryColor === themeOption.value ? 'ring-white' : 'ring-transparent hover:ring-gray-500'}`}
                                style={{ backgroundColor: themeOption.hex }}
                                title={themeOption.name}
                            />
                        ))}
                        <button 
                            onClick={() => handleColorChange(undefined)}
                            className={`h-8 px-3 rounded-md focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 transition-all text-xs flex items-center gap-1 ${!profile.primaryColor ? 'ring-white' : 'ring-transparent hover:ring-gray-500'} bg-gray-600`}
                        >
                            Default
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">AI & Services</h3>
                <div>
                    <label htmlFor="activeModel" className="block text-sm font-medium text-gray-300 mb-1">Active AI Model</label>
                    <select
                        id="activeModel"
                        name="activeModel"
                        value={profile.activeModel || 'gemini'}
                        onChange={handleSettingChange}
                        className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${theme.ring.primary}`}
                    >
                        <option value="gemini">Gemini</option>
                        <option value="openai">OpenAI</option>
                        <option value="claude">Claude</option>
                    </select>
                </div>
                <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-300">API Keys</h4>
                    <div>
                        <label htmlFor="mapbox-key" className="block text-sm font-medium text-gray-400 mb-1">Mapbox Access Token</label>
                        <input id="mapbox-key" type="password" value={profile.apiKeys.mapbox} onChange={(e) => handleKeyChange('mapbox', e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
                    </div>
                    <div>
                        <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-400 mb-1">Gemini API Key</label>
                        <input id="gemini-key" type="password" value={profile.apiKeys.gemini} onChange={(e) => handleKeyChange('gemini', e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};