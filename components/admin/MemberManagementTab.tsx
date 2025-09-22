import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../../types';
import { loadAllUserProfiles, deleteUserProfile } from '../../utils/database';
import { useTheme } from '../../context/ThemeContext';

export const MemberManagementTab: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleAddUser = () => {
    alert("Add user functionality is not yet implemented.");
  };
  
  const handleEditUser = (email: string) => {
    alert(`Editing user ${email} is not yet implemented.`);
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
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Manage Users ({users.length})</h3>
            <button 
                onClick={handleAddUser}
                className={`px-4 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md`}
            >
                Add User
            </button>
        </div>

        <div className="overflow-x-auto bg-gray-900/50 rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {users.map(user => (
                        <tr key={user.email} className="hover:bg-gray-700/30">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button onClick={() => handleEditUser(user.email)} className={`text-${theme.name}-400 hover:text-${theme.name}-300`}>Edit</button>
                                <button onClick={() => handleDeleteUser(user.email)} className="text-red-500 hover:text-red-400">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};