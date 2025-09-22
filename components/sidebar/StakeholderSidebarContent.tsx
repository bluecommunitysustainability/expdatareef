

import React, { useState } from 'react';
import type { Metric, SdgDetailInfo, GstcCriterionDetail, BcStrategy, InfoModalData } from '../../types';
import { MetricsTab, SdgTab, GstcTab, BcTab } from '../info_sidebar';
import { useTheme } from '../../context/ThemeContext';

interface StakeholderSidebarContentProps {
  onBack: () => void;
  data: {
    metrics: Metric[];
    sdgs: SdgDetailInfo[];
    gstc: GstcCriterionDetail[];
    bc: BcStrategy[];
  } | null;
  onItemClick: (item: InfoModalData) => void;
}

type Tab = 'UNSDGs' | 'GSTC' | 'BC';

export const StakeholderSidebarContent: React.FC<StakeholderSidebarContentProps> = ({ onBack, data, onItemClick }) => {
  const [activeTab, setActiveTab] = useState<Tab>('UNSDGs');
  const theme = useTheme();
  
  const tabs: Tab[] = ['UNSDGs', 'GSTC', 'BC'];

  const renderContent = () => {
    if (!data) {
        return <div className="p-4 text-center text-gray-400">Loading data...</div>;
    }
    switch (activeTab) {
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
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={onBack}
          className="w-full text-left flex items-center gap-3 p-3 text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span>Back to Assessment</span>
        </button>
      </div>
      
       <nav className="flex-shrink-0 border-y border-gray-700/50">
          <div className="flex space-x-1 p-2">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700/50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>
        <main className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </main>
    </div>
  );
};