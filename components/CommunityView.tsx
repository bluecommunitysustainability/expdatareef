import React, { useMemo, useState } from 'react';
import type { UserProfile } from '../types';
import { ForceDirectedGraph } from './AiAssistPanel';
import { useTheme } from '../context/ThemeContext';
import { ForumView } from './community/ForumView';
import { ConferenceView } from './community/ConferenceView';

interface CommunityViewProps {
    users: UserProfile[];
    destination: string;
    currentUser: UserProfile | null;
}

type CommunityTab = 'team' | 'forum' | 'conference';

const UserCard: React.FC<{ user: UserProfile, onCall: () => void }> = ({ user, onCall }) => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=4b5563&color=e2e8f0&size=96`;
    const roleColor = user.role === 'admin' ? 'text-red-400' : user.role === 'Monitor' ? 'text-yellow-400' : 'text-green-400';

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex flex-col items-center text-center animate-fade-in justify-between">
            <div>
                <img src={user.avatar || defaultAvatar} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-600 mb-4" />
                <h3 className="font-bold text-lg text-white">{user.name}</h3>
                <p className={`text-sm font-semibold ${roleColor}`}>{user.role}</p>
                {user.title && <p className="text-sm text-gray-400 mt-2">{user.title}</p>}
            </div>
            <button 
                onClick={onCall} 
                className="mt-4 w-full px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center gap-2 transition-colors"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                Direct Call
            </button>
        </div>
    );
};


const TeamView: React.FC<{ teamMembers: UserProfile[] }> = ({ teamMembers }) => {
    if (teamMembers.length === 0) {
        return (
            <div className="flex items-center justify-center h-full py-16">
                <div className="text-center bg-gray-800/50 p-8 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-200">No Team Members Found</h2>
                    <p className="text-gray-400 mt-2">There are no designated Monitors or Admins for this destination.</p>
                </div>
            </div>
        );
    }

    const handleCall = (userName: string) => {
        alert(`Initiating a direct call with ${userName}... (This is a placeholder for WebRTC integration).`);
    };

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-2 text-center">Stakeholder Network</h3>
                <p className="text-sm text-gray-400 text-center mb-4">This graph shows connections between team members based on shared responsibilities. Drag nodes to explore.</p>
                <div className="h-[400px] w-full">
                     <ForceDirectedGraph users={teamMembers} />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teamMembers.map(user => (
                    <UserCard key={user.id} user={user} onCall={() => handleCall(user.name)} />
                ))}
            </div>
        </div>
    );
};

export const CommunityView: React.FC<CommunityViewProps> = ({ users, destination, currentUser }) => {
    const [activeTab, setActiveTab] = useState<CommunityTab>('team');
    const theme = useTheme();

    const teamMembers = useMemo(() => {
        return users.filter(user => user.team === destination && (user.role === 'admin' || user.role === 'Monitor'))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [users, destination]);

    if (!currentUser) {
         return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center bg-gray-800/50 p-8 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-200">Authentication Error</h2>
                    <p className="text-gray-400 mt-2">Could not identify current user. Please log in again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Community Team for {destination}</h2>
                <p className="text-gray-400 mt-1">A collaborative space for the Monitors and Administrators of this destination.</p>
            </div>
            
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('team')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'team' ? `${theme.border.primary} ${theme.text.primary}` : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>Team</button>
                    <button onClick={() => setActiveTab('forum')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'forum' ? `${theme.border.primary} ${theme.text.primary}` : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>Forum</button>
                    <button onClick={() => setActiveTab('conference')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'conference' ? `${theme.border.primary} ${theme.text.primary}` : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>Conference</button>
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'team' && <TeamView teamMembers={teamMembers} />}
                {activeTab === 'forum' && <ForumView destination={destination} currentUser={currentUser} users={users} />}
                {activeTab === 'conference' && <ConferenceView teamMembers={teamMembers} destination={destination} />}
            </div>
        </div>
    );
};
