import React, { useState, useEffect, useMemo } from 'react';
import type { UserProfile } from '../../types';
import type { Destination } from '../../constants/destinations';
import { loadAllUserProfiles, deleteUserProfile, saveUserProfile } from '../../utils/database';
import { useTheme } from '../../context/ThemeContext';
import { parseCsv } from '../../utils/csvParser';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';

interface MemberManagementTabProps {
    sections: string[];
    destinations: Destination[];
}

export const MemberManagementTab: React.FC<MemberManagementTabProps> = ({ sections, destinations }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  const [destinationFilter, setDestinationFilter] = useState('ALL');
  const theme = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const profiles = await loadAllUserProfiles();
      setUsers(profiles);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);
  
  const filteredUsers = useMemo(() => {
    if (destinationFilter === 'ALL') return users;
    return users.filter(u => u.team === destinationFilter);
  }, [users, destinationFilter]);

  const handleFetchUsers = async () => {
    setIsFetching(true);
    try {
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/1ntbCb9l0yFAeBiScbe24lvg7fpEWDIeRWNe9bxx7Of8/export?format=csv';
      const response = await fetch(sheetUrl);
      if (!response.ok) {
          throw new Error(`Failed to fetch sheet: ${response.statusText}`);
      }
      const csvText = await response.text();
      const { headers, rows } = parseCsv(csvText);
  
      const headerMap = headers.reduce((acc, header, index) => {
        acc[header.toLowerCase().trim()] = index;
        return acc;
      }, {} as Record<string, number>);

      const getIndex = (keys: string[]) => {
        for (const key of keys) {
          if (headerMap[key] !== undefined) return headerMap[key];
        }
        return -1;
      };

      const emailHeaderIndex = getIndex(['email address', 'email']);
      if (emailHeaderIndex === -1) {
          throw new Error("CSV must contain an 'Email Address' or 'Email' column.");
      }
      
      const timestampHeaderIndex = getIndex(['timestamp']);
      const nameHeaderIndex = getIndex(['name']);
      const countryHeaderIndex = getIndex(['country']);
      const cityHeaderIndex = getIndex(['city']);
      const stateHeaderIndex = getIndex(['state']);
      const zipCodeHeaderIndex = getIndex(['zip code']);
      const titleHeaderIndex = getIndex(['your title', 'title']);
      const expertiseHeaderIndex = getIndex(['your expertise in sustainability', 'expertise']);
      const roleHeaderIndex = getIndex(['role']);
      const sectionsHeaderIndex = getIndex(['sections', 'editable sections']);
      const teamHeaderIndex = getIndex(['team']);
  
      const existingEmails = new Set(users.map(u => u.email.toLowerCase()));
      const profilesToSave: UserProfile[] = [];
  
      for (const row of rows) {
        const email = row[emailHeaderIndex]?.trim().toLowerCase();
        if (!email || existingEmails.has(email)) {
          continue;
        }
  
        const role = row[roleHeaderIndex]?.trim().toLowerCase();
        
        const newProfile: UserProfile = {
          id: email,
          email: email,
          name: row[nameHeaderIndex] || email.split('@')[0],
          apiKeys: { gemini: '', openai: '', claude: '', mapbox: '' },
          role: (role === 'admin' || role === 'user' || role === 'Monitor') ? role : 'user',
          team: row[teamHeaderIndex]?.trim() || undefined,
          editableSections: row[sectionsHeaderIndex] ? row[sectionsHeaderIndex].split(',').map(s => s.trim()).filter(Boolean) : undefined,
          timestamp: row[timestampHeaderIndex],
          country: row[countryHeaderIndex],
          city: row[cityHeaderIndex],
          state: row[stateHeaderIndex],
          zipCode: row[zipCodeHeaderIndex],
          title: row[titleHeaderIndex],
          expertise: row[expertiseHeaderIndex],
        };
  
        profilesToSave.push(newProfile);
        existingEmails.add(email);
      }
      
      if (profilesToSave.length > 0) {
        await Promise.all(profilesToSave.map(profile => saveUserProfile(profile)));
      }
      
      alert(`Fetch complete. Added ${profilesToSave.length} new user(s).`);
      
      const updatedProfiles = await loadAllUserProfiles();
      setUsers(updatedProfiles);
  
    } catch (error) {
      console.error("Error fetching users from sheet:", error);
      const specificError = error instanceof Error ? error.message : 'An unknown error occurred.';
      alert(`An error occurred: ${specificError}`);
    } finally {
      setIsFetching(false);
    }
  };
  
  const handleSaveNewUser = async (newUser: Omit<UserProfile, 'id' | 'apiKeys'>) => {
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        alert('A user with this email already exists.');
        return;
    }

    const newProfile: UserProfile = {
        ...newUser,
        id: newUser.email,
        apiKeys: { gemini: '', openai: '', claude: '', mapbox: '' },
        activeModel: 'gemini',
    };

    try {
        await saveUserProfile(newProfile);
        setUsers(prev => [...prev, newProfile].sort((a, b) => a.name.localeCompare(b.name)));
        setIsAddUserModalOpen(false);
        alert('User added successfully!');
    } catch (error) {
        console.error('Failed to save user:', error);
        alert('Failed to save user.');
    }
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    try {
        await saveUserProfile(updatedUser);
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setUserToEdit(null);
        alert('User updated successfully!');
    } catch (error) {
        console.error('Failed to update user:', error);
        alert('Failed to update user.');
    }
  };


  const handleDeleteUser = async (email: string) => {
    if (window.confirm(`Are you sure you want to delete the user ${email}? This action cannot be undone.`)) {
        try {
            await deleteUserProfile(email);
            setUsers(users.filter(user => user.email !== email));
            alert('User deleted successfully.');
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user. See console for details.');
        }
    }
  };


  if (isLoading) {
    return <p className="text-gray-400">Loading users...</p>;
  }

  return (
    <>
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Manage Users ({filteredUsers.length})</h3>
                    <div className="mt-2">
                        <label htmlFor="dest-filter" className="sr-only">Filter by destination</label>
                        <select 
                            id="dest-filter"
                            value={destinationFilter}
                            onChange={e => setDestinationFilter(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-md py-1.5 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="ALL">All Destinations</option>
                            {destinations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleFetchUsers}
                        disabled={isFetching}
                        className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                        {isFetching ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        )}
                        {isFetching ? 'Fetching...' : 'Fetch from Sheet'}
                    </button>
                    <button 
                        onClick={() => setIsAddUserModalOpen(true)}
                        className={`px-4 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md flex items-center gap-2`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add User
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-gray-900/50 rounded-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name / Email</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location / Title</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Permissions</th>
                            <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredUsers.map(user => (
                            <tr key={user.email} className="hover:bg-gray-700/30">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{user.name}</div>
                                    <div className="text-sm text-gray-400">{user.email}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">{user.city && user.state ? `${user.city}, ${user.state}` : (user.country || '')}</div>
                                    <div className="text-sm text-gray-400">{user.title}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-200 text-red-800' : (user.role === 'Monitor' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800')}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-400">
                                    {user.team && <div className="font-semibold text-gray-300">Team: {user.team}</div>}
                                    <div className="truncate max-w-xs" title={user.editableSections?.join(', ')}>
                                        Sections: {user.editableSections && user.editableSections.length > 0 ? user.editableSections.join(', ') : 'All'}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => setUserToEdit(user)} className={`text-${theme.name}-400 hover:text-${theme.name}-300`}>Edit</button>
                                    <button onClick={() => handleDeleteUser(user.email)} className="text-red-500 hover:text-red-400">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <AddUserModal
            isOpen={isAddUserModalOpen}
            onClose={() => setIsAddUserModalOpen(false)}
            onSave={handleSaveNewUser}
            sections={sections}
            destinations={destinations.map(d => d.name)}
        />
        <EditUserModal
            isOpen={!!userToEdit}
            onClose={() => setUserToEdit(null)}
            onSave={handleUpdateUser}
            user={userToEdit}
            sections={sections}
            destinations={destinations.map(d => d.name)}
        />
    </>
  );
};