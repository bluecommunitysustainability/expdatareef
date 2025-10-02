import React, { useMemo } from 'react';
import type { UserProfile } from '../types';
import { ForceDirectedGraph } from './AiAssistPanel';

interface CommunityViewProps {
    users: UserProfile[];
    destination: string;
}

const UserCard: React.FC<{ user: UserProfile }> = ({ user }) => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=4b5563&color=e2e8f0&size=96`;
    const roleColor = user.role === 'admin' ? 'text-red-400' : 'text-yellow-400';

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex flex-col items-center text-center animate-fade-in">
            <img src={user.avatar || defaultAvatar} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-600 mb-4" />
            <h3 className="font-bold text-lg text-white">{user.name}</h3>
            <p className={`text-sm font-semibold ${roleColor}`}>{user.role}</p>
            {user.title && <p className="text-sm text-gray-400 mt-2">{user.title}</p>}
            {user.expertise && <p className="text-xs text-gray-500 mt-1 line-clamp-3">{user.expertise}</p>}
        </div>
    );
};

export const CommunityView: React.FC<CommunityViewProps> = ({ users, destination }) => {
    const teamMembers = useMemo(() => {
        return users.filter(user => user.team === destination && (user.role === 'admin' || user.role === 'Monitor'))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [users, destination]);

    if (teamMembers.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center bg-gray-800/50 p-8 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-200">No Team Members Found</h2>
                    <p className="text-gray-400 mt-2">There are no designated Monitors or Admins for {destination}.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Community Team for {destination}</h2>
                <p className="text-gray-400 mt-1">These are the designated Monitors and Administrators for this destination.</p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-2 text-center">Stakeholder Network</h3>
                <p className="text-sm text-gray-400 text-center mb-4">This graph shows connections between team members based on shared responsibilities. Drag nodes to explore.</p>
                <div className="h-[400px] w-full">
                     <ForceDirectedGraph users={teamMembers} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teamMembers.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
};