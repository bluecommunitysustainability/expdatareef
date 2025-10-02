import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MemberManagementTab } from './MemberManagementTab';
import { DestinationsTab } from './DestinationsTab';
import type { Destination } from '../../constants/destinations';
import type { Question, ApiKeys } from '../../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: Destination[];
  onDestinationsUpdate: React.Dispatch<React.SetStateAction<Destination[]>>;
  onAddNewDestination: (newDestination: Destination) => Promise<void>;
  questions: Question[];
  mapboxToken: string;
  apiKeys: ApiKeys;
}

type Tab = 'members' | 'destinations';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, destinations, onDestinationsUpdate, onAddNewDestination, questions, mapboxToken, apiKeys }) => {
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const theme = useTheme();

  const sections = useMemo(() => {
    const sectionSet = new Set(questions.map(q => q.section));
    return Array.from(sectionSet);
  }, [questions]);

  return (
    <div 
      className={`fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dashboard-title"
    >
      <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-700 bg-gray-800">
        <h2 id="admin-dashboard-title" className={`text-xl font-bold ${theme.text.primary}`}>Admin Management</h2>
        <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" aria-label="Close admin dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </header>

      <nav className="flex-shrink-0 border-b border-gray-700 bg-gray-800">
        <div className="flex space-x-1 p-2 max-w-7xl mx-auto">
          <button 
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'members' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('destinations')}
            className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'destinations' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
          >
            Destinations
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            {activeTab === 'members' && <MemberManagementTab sections={sections} destinations={destinations} />}
            {activeTab === 'destinations' && <DestinationsTab destinations={destinations} onUpdate={onDestinationsUpdate} onAddNewDestination={onAddNewDestination} mapboxToken={mapboxToken} apiKeys={apiKeys} />}
        </div>
      </main>
    </div>
  );
};