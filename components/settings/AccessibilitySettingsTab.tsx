import React from 'react';
import type { UserProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AccessibilitySettingsTabProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const AccessibilitySettingsTab: React.FC<AccessibilitySettingsTabProps> = ({ profile, setProfile }) => {
    const theme = useTheme();
    const currentSize = profile.fontSize || 'md';

    const handleSizeChange = (size: 'sm' | 'md' | 'lg') => {
        if (profile) {
            setProfile({ ...profile, fontSize: size });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Appearance</h3>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Font Size</label>
                    <div className="flex items-center bg-gray-700 rounded-lg p-1">
                        <button 
                            onClick={() => handleSizeChange('sm')}
                            className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${currentSize === 'sm' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            Small
                        </button>
                        <button 
                            onClick={() => handleSizeChange('md')}
                            className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${currentSize === 'md' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            Medium
                        </button>
                        <button 
                            onClick={() => handleSizeChange('lg')}
                            className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${currentSize === 'lg' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            Large
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};