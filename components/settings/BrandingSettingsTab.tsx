import React, { useRef } from 'react';
import type { UserProfile, ApiKeys } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { availableThemes } from '../../constants/teamColors';

interface BrandingSettingsTabProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4 mt-8 first:mt-0">{children}</h3>
);


export const BrandingSettingsTab: React.FC<BrandingSettingsTabProps> = ({ profile, setProfile }) => {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setProfile(prevProfile => {
            if (!prevProfile) return null;
            return { ...prevProfile, [e.target.name]: e.target.value };
        });
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'customLogo') => {
        const file = event.target.files?.[0];
        if (file && profile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prevProfile => {
                    if (!prevProfile) return null;
                    return { ...prevProfile, [field]: reader.result as string };
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKeyChange = (provider: keyof ApiKeys, value: string) => {
        if (profile) {
            const newKeys = { ...profile.apiKeys, [provider]: value };
            setProfile({ ...profile, apiKeys: newKeys });
        }
    };
    
    const handleColorChange = (colorValue?: string) => {
        if (profile) {
            setProfile({ ...profile, primaryColor: colorValue });
        }
    };
    
    const handleSizeChange = (size: 'sm' | 'md' | 'lg') => {
        if (profile) {
            setProfile({ ...profile, fontSize: size });
        }
    };

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || '?')}&background=4b5563&color=e2e8f0&size=128`;
    const canSeeBranding = profile?.role === 'admin' || profile?.role === 'Monitor';
    const hasSpecificPermissions = profile.editableSections && profile.editableSections.length > 0;

    return (
        <div className="space-y-6">
            {/* --- Profile Section --- */}
            <div>
                <SectionHeader>User Profile</SectionHeader>
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img
                            src={profile.avatar || defaultAvatar}
                            alt="User Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                        />
                        <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            className={`absolute bottom-0 right-0 text-white rounded-full p-2 ${theme.background.secondary} ${theme.background.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${theme.ring.primary}`}
                            title="Change avatar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" accept="image/png, image/jpeg, image/gif" />
                </div>
                <div className="mt-6 space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input id="name" name="name" type="text" value={profile.name} onChange={handleChange} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input id="title" name="title" type="text" value={profile.title || ''} onChange={handleChange} placeholder="e.g. Sustainability Coordinator" className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
                    </div>
                    <div>
                        <label htmlFor="expertise" className="block text-sm font-medium text-gray-300 mb-1">Short Bio / Expertise</label>
                        <textarea id="expertise" name="expertise" rows={3} value={profile.expertise || ''} onChange={handleChange} placeholder="Describe your role or expertise..." className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <p className="text-gray-500 text-sm">{profile.email} (cannot be changed)</p>
                    </div>
                </div>
            </div>

            {/* --- Branding Section --- */}
            {canSeeBranding && (
                <div>
                    <SectionHeader>Branding &amp; Theme</SectionHeader>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Custom Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                                    {profile.customLogo ? <img src={profile.customLogo} alt="Custom Logo Preview" className="max-w-full max-h-full object-contain" /> : <span className="text-gray-400 text-xs">Logo</span>}
                                </div>
                                <div className="flex-1">
                                    <input type="file" accept="image/png, image/jpeg, image/gif, image/svg+xml" ref={logoInputRef} onChange={(e) => handleFileChange(e, 'customLogo')} className="hidden" />
                                    <button onClick={() => logoInputRef.current?.click()} className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-md">Upload Logo</button>
                                    {profile.customLogo && <button onClick={() => setProfile({ ...profile, customLogo: undefined })} className="px-3 py-2 text-sm text-red-500 hover:text-red-400 rounded-md ml-2">Remove</button>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                            <div className="flex flex-wrap gap-3">
                                {availableThemes.map(themeOption => (
                                    <button key={themeOption.value} onClick={() => handleColorChange(themeOption.value)} className={`w-8 h-8 rounded-full focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 transition-all ${profile.primaryColor === themeOption.value ? 'ring-white' : 'ring-transparent hover:ring-gray-500'}`} style={{ backgroundColor: themeOption.hex }} title={themeOption.name} />
                                ))}
                                <button onClick={() => handleColorChange(undefined)} className={`h-8 px-3 rounded-md focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 transition-all text-xs flex items-center gap-1 ${!profile.primaryColor ? 'ring-white' : 'ring-transparent hover:ring-gray-500'} bg-gray-600`}>Default</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Accessibility --- */}
            <div>
                 <SectionHeader>Accessibility</SectionHeader>
                 <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Font Size</label>
                    <div className="flex items-center bg-gray-700 rounded-lg p-1">
                        <button onClick={() => handleSizeChange('sm')} className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${(profile.fontSize || 'md') === 'sm' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-600'}`}>Small</button>
                        <button onClick={() => handleSizeChange('md')} className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${(profile.fontSize || 'md') === 'md' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-600'}`}>Medium</button>
                        <button onClick={() => handleSizeChange('lg')} className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${(profile.fontSize || 'md') === 'lg' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-600'}`}>Large</button>
                    </div>
                </div>
            </div>

             {/* --- AI & Services --- */}
             {canSeeBranding && (
                <div>
                    <SectionHeader>AI &amp; Services</SectionHeader>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="activeModel" className="block text-sm font-medium text-gray-300 mb-1">Active AI Model</label>
                            <select id="activeModel" name="activeModel" value={profile.activeModel || 'gemini'} onChange={handleChange} className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${theme.ring.primary}`}>
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
             )}

            {/* --- Permissions --- */}
            <div>
                 <SectionHeader>Permissions</SectionHeader>
                <div className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-gray-400 uppercase tracking-wider">Role</h4>
                        <p className="text-lg text-white font-semibold capitalize">{profile.role}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-400 uppercase tracking-wider">Assigned Team / Destination</h4>
                        <p className="text-lg text-white font-semibold">{profile.team || 'None'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-400 uppercase tracking-wider mb-2">Editable Sections</h4>
                        {hasSpecificPermissions ? (
                            <ul className="space-y-1 list-disc list-inside">
                                {profile.editableSections?.map(section => (
                                    <li key={section} className="text-gray-300">{section}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-300">You have permission to edit <span className="font-bold">all sections</span> for your assigned destination.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};