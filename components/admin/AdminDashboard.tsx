import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MemberManagementTab } from './MemberManagementTab';
import { DestinationsTab } from './DestinationsTab';
import type { Destination } from '../../constants/destinations';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: Destination[];
  onDestinationsUpdate: React.Dispatch<React.SetStateAction<Destination[]>>;
}

type Tab = 'members' | 'destinations';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, destinations, onDestinationsUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const theme = useTheme();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={`fixed top-0 right-0 h-full bg-gray-800 shadow-2xl z-50 transition-transform duration-500 ease-in-out w-full max-w-3xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-dashboard-title"
      >
        <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-700">
          <h2 id="admin-dashboard-title" className={`text-xl font-bold ${theme.text.primary}`}>Admin Dashboard</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700" aria-label="Close admin dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <nav className="flex-shrink-0 border-b border-gray-700">
          <div className="flex space-x-1 p-2">
            <button 
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'members' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
            >
              Member Management
            </button>
            <button 
              onClick={() => setActiveTab('destinations')}
              className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'destinations' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
            >
              Destinations
            </button>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'members' && <MemberManagementTab />}
          {activeTab === 'destinations' && <DestinationsTab destinations={destinations} onUpdate={onDestinationsUpdate} />}
        </main>
      </div>
    </>
  );
};