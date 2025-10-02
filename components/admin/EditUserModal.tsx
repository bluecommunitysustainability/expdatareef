import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../../types';
import { Modal } from '../Modal';
import { useTheme } from '../../context/ThemeContext';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => void;
  user: UserProfile | null;
  sections: string[];
  destinations: string[];
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSave, user, sections, destinations }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<'user' | 'admin' | 'Monitor'>('user');
    const [team, setTeam] = useState<string>('');
    const [editableSections, setEditableSections] = useState<string[]>([]);
    const theme = useTheme();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setRole(user.role);
            setTeam(user.team || '');
            setEditableSections(user.editableSections || []);
        }
    }, [user, isOpen]);

    const handleSectionChange = (section: string) => {
        setEditableSections(prev => 
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const handleSave = () => {
        if (!user) return;
        
        const updatedUser: UserProfile = {
            ...user,
            name,
            role,
            team: team || undefined,
            editableSections: editableSections.length > 0 ? editableSections : undefined,
        };
        onSave(updatedUser);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user?.name}`}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="edit-user-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input type="text" id="edit-user-name" value={name} onChange={e => setName(e.target.value)} required className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
                    </div>
                    <div>
                        <label htmlFor="edit-user-email" className="block text-sm font-medium text-gray-400 mb-1">Email (cannot be changed)</label>
                        <input type="email" id="edit-user-email" value={user?.email || ''} disabled className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-gray-500 cursor-not-allowed" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="edit-user-role" className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                        <select id="edit-user-role" value={role} onChange={e => setRole(e.target.value as 'user' | 'admin' | 'Monitor')} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}>
                            <option value="user">User</option>
                            <option value="Monitor">Monitor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="edit-user-team" className="block text-sm font-medium text-gray-300 mb-1">Team / Destination</label>
                        <select id="edit-user-team" value={team} onChange={e => setTeam(e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}>
                            <option value="">None</option>
                            {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Editable Sections</label>
                    <p className="text-xs text-gray-400 mb-2">If no sections are selected, the user will be able to edit all sections.</p>
                    <div className="max-h-48 overflow-y-auto bg-gray-900/50 p-3 rounded-md border border-gray-700 grid grid-cols-2 gap-2">
                        {sections.map(section => (
                            <label key={section} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-700/50">
                                <input
                                    type="checkbox"
                                    checked={editableSections.includes(section)}
                                    onChange={() => handleSectionChange(section)}
                                    className={`h-4 w-4 rounded bg-gray-600 border-gray-500 text-${theme.name}-500 focus:ring-${theme.name}-500`}
                                />
                                <span className="text-sm text-gray-300">{section}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-700 rounded-md">Cancel</button>
                    <button type="button" onClick={handleSave} className={`px-4 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md`}>Save Changes</button>
                </div>
            </div>
        </Modal>
    );
};