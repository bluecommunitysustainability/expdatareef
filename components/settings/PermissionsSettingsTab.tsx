import React from 'react';
import type { UserProfile } from '../../types';

interface PermissionsSettingsTabProps {
    profile: UserProfile;
}

export const PermissionsSettingsTab: React.FC<PermissionsSettingsTabProps> = ({ profile }) => {
    const hasSpecificPermissions = profile.editableSections && profile.editableSections.length > 0;

    return (
        <div className="space-y-6 text-sm">
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
    );
};