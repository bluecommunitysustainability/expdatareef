import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { ProfileSettingsTab, BrandingSettingsTab, PermissionsSettingsTab, AccessibilitySettingsTab } from './settings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
}

type Tab = 'profile' | 'branding' | 'permissions' | 'accessibility';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, userProfile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(userProfile);
  const theme = useTheme();

  useEffect(() => {
    if (isOpen) {
      setEditedProfile(userProfile);
      setActiveTab('profile'); // Reset to default tab
    }
  }, [isOpen, userProfile]);

  const handleSave = () => {
    if (editedProfile) {
      onUpdateProfile(editedProfile);
    }
    onClose();
  };
  
  const canSeeBranding = userProfile?.role === 'admin' || userProfile?.role === 'Monitor';

  if (!userProfile) return null;

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

        <nav className="flex-shrink-0 border-b border-gray-700">
            <div className="flex space-x-1 p-2">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'profile' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    Profile
                </button>
                {canSeeBranding && (
                  <button 
                      onClick={() => setActiveTab('branding')}
                      className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'branding' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                      Branding & AI
                  </button>
                )}
                <button 
                    onClick={() => setActiveTab('permissions')}
                    className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'permissions' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    Permissions
                </button>
                <button 
                    onClick={() => setActiveTab('accessibility')}
                    className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'accessibility' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    Accessibility
                </button>
            </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-6">
            {editedProfile && (
              <>
                {activeTab === 'profile' && <ProfileSettingsTab profile={editedProfile} setProfile={setEditedProfile} />}
                {activeTab === 'branding' && canSeeBranding && <BrandingSettingsTab profile={editedProfile} setProfile={setEditedProfile} />}
                {activeTab === 'permissions' && <PermissionsSettingsTab profile={editedProfile} />}
                {activeTab === 'accessibility' && <AccessibilitySettingsTab profile={editedProfile} setProfile={setEditedProfile} />}
              </>
            )}
        </main>
        
        <footer className="p-4 border-t border-gray-700 mt-auto">
            <button
              onClick={handleSave}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${theme.ring.primary}`}
            >
              Save Changes
            </button>
        </footer>
      </aside>
    </>
  );
};