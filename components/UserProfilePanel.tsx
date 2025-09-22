import React, { useState, useEffect, useRef } from 'react';
import type { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  userProfile: UserProfile | null;
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ isOpen, onClose, onUpdateProfile, onLogout, userProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(userProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isOpen) {
      setEditedProfile(userProfile);
      setIsEditing(false); // Reset to view mode when panel opens
    }
  }, [isOpen, userProfile]);

  if (!userProfile) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, name: e.target.value });
    }
  };
  
  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editedProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({ ...editedProfile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = () => {
    if (editedProfile) {
      onUpdateProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };
  
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || userProfile.email)}&background=4b5563&color=e2e8f0&size=128`;
  const editAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(editedProfile?.name || '?')}&background=4b5563&color=e2e8f0&size=128`;


  return (
    <>
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-gray-800 shadow-2xl z-50 transition-transform duration-500 ease-in-out p-6 rounded-t-lg ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-profile-title"
      >
        <div className="max-w-md mx-auto">
          {isEditing && editedProfile ? (
            // Edit View
            <div className="space-y-6">
              <h2 id="user-profile-title" className={`text-2xl font-bold text-center ${theme.text.primary}`}>Edit Profile</h2>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                    <img
                    src={editedProfile.avatar || editAvatar}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                    />
                    <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
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
                  type="text"
                  value={editedProfile.name}
                  onChange={handleNameChange}
                  className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email (cannot be changed)</label>
                <input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  disabled
                  className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="flex gap-4">
                <button onClick={handleCancelEdit} className="w-full py-3 px-4 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-700">Cancel</button>
                <button onClick={handleSaveChanges} className={`w-full py-3 px-4 rounded-md text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover}`}>Save Changes</button>
              </div>
            </div>
          ) : (
            // Display View
            <div className="flex flex-col items-center text-center">
              <img src={userProfile.avatar || defaultAvatar} alt="User Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-600 mb-4" />
              <h2 id="user-profile-title" className="text-2xl font-bold text-white">{userProfile.name}</h2>
              <p className="text-gray-400">{userProfile.email}</p>
              <div className="flex gap-4 mt-6">
                <button onClick={onLogout} className="px-6 py-2 text-sm bg-red-600/80 hover:bg-red-700 rounded-md">Logout</button>
                <button onClick={() => setIsEditing(true)} className={`px-6 py-2 text-sm text-white ${theme.background.primary} ${theme.background.hover} rounded-md`}>Edit Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
