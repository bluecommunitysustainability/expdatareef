import React from 'react';

// This component is now obsolete. Its functionality has been merged into the new tabbed SettingsPanel.
// This file is kept as a placeholder to prevent import errors in older component structures.
export const UserProfilePanel: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  if (!isOpen) return null;
  return <div style={{display: 'none'}} data-testid="placeholder-user-profile-panel" />;
};