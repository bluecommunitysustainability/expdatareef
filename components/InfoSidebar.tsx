
import React, { useState } from 'react';
// FIX: GstcCriterionDetail type has been added to this import.
import type { Metric, SdgDetailInfo, BcStrategy, InfoModalData, GstcCriterionDetail } from '../types';
import { MetricsTab, SdgTab, GstcTab, BcTab } from './info_sidebar';
import { useTheme } from '../context/ThemeContext';

interface InfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    metrics: Metric[];
    sdgs: SdgDetailInfo[];
    gstc: GstcCriterionDetail[];
    bc: BcStrategy[];
  };
  onItemClick: (item: InfoModalData) => void;
}

type Tab = 'Metrics' | 'UNSDGs' | 'GSTC' | 'BC';

export const InfoSidebar: React.FC<InfoSidebarProps> = ({ isOpen, onClose, data, onItemClick }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Metrics');
  const theme = useTheme();

  const tabs: Tab[] = ['Metrics', 'UNSDGs', 'GSTC', 'BC'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Metrics':
        return <MetricsTab data={data.metrics} onItemClick={onItemClick} />;
      case 'UNSDGs':
        return <SdgTab data={data.sdgs} />;
      case 'GSTC':
        return <GstcTab data={data.gstc} />;
      case 'BC':
        return <BcTab data={data.bc} onItemClick={onItemClick} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside 
        className={`fixed top-0 right-0 h-full bg-gray-800 shadow-2xl z-40 transition-transform duration-500 ease-in-out w-full md:w-1/2 lg:w-2/5 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className={`text-xl font-bold ${theme.text.primary}`}>Info Hub</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        <nav className="flex-shrink-0 border-b border-gray-700">
          <div className="flex space-x-1 p-2">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>
        <main className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </main>
      </aside>
    </>
  );
};
