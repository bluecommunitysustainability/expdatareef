import React, { useRef } from 'react';
import type { UserProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ProfileSettingsTabProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ profile, setProfile }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile(prevProfile => {
            if (!prevProfile) return null;
            return { ...prevProfile, [e.target.name]: e.target.value };
        });
    };
    
    const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Use a functional update to prevent stale state issues
                setProfile(prevProfile => {
                    if (!prevProfile) return null;
                    return { ...prevProfile, avatar: reader.result as string };
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || '?')}&background=4b5563&color=e2e8f0&size=128`;

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <img
                        src={profile.avatar || defaultAvatar}
                        alt="User Avatar"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`absolute bottom-0 right-0 text-white rounded-full p-2 ${theme.background.secondary} ${theme.background.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${theme.ring.primary}`}
                        title="Change avatar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                />
            </div>
            
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleChange}
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}
                />
            </div>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={profile.title || ''}
                    onChange={handleChange}
                    placeholder="e.g. Sustainability Coordinator"
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}
                />
            </div>
            
            <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-300 mb-1">Short Bio / Expertise</label>
                <textarea
                    id="expertise"
                    name="expertise"
                    rows={3}
                    value={profile.expertise || ''}
                    onChange={handleChange}
                    placeholder="Describe your role or expertise..."
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <p className="text-gray-500 text-sm">{profile.email} (cannot be changed)</p>
            </div>
        </div>
    );
};