
import React, { useState } from 'react';
import type { Question, AnswerObject } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Modal } from '../Modal';

interface MetricDetailPanelProps {
  metric: { q: Question; a: AnswerObject | null } | null;
  onClose: () => void;
}

export const MetricDetailPanel: React.FC<MetricDetailPanelProps> = ({ metric, onClose }) => {
  const isOpen = !!metric;
  const [activeTab, setActiveTab] = useState('details');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const theme = useTheme();

  const handleDocView = () => {
    if (metric?.a?.value instanceof File) {
        setIsDocModalOpen(true);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside 
        className={`fixed top-0 right-0 h-full bg-gray-800 shadow-2xl z-40 transition-transform duration-500 ease-in-out w-full md:w-1/2 lg:w-2/5 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="metric-panel-title"
      >
        <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-700">
          <h2 id="metric-panel-title" className={`text-xl font-bold ${theme.text.primary} truncate`}>
            Metric Details
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700" aria-label="Close metric details">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        {metric ? (
          <>
            <div className="p-4 border-b border-gray-700">
                <p className="text-sm font-mono text-gray-500">{metric.q.id}</p>
                <h3 className="text-lg font-semibold text-white mt-1">{metric.q.text.replace(/{Destination}/g, '')}</h3>
            </div>
            <nav className="flex-shrink-0 border-b border-gray-700">
                <div className="flex space-x-1 p-2">
                    <button onClick={() => setActiveTab('details')} className={`flex-1 py-2 text-sm rounded-md ${activeTab === 'details' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}>Details</button>
                    <button onClick={() => setActiveTab('collab')} className={`flex-1 py-2 text-sm rounded-md ${activeTab === 'collab' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}>Collaboration</button>
                </div>
            </nav>
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'details' && (
                <div className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-gray-400">Metric Group</h4>
                        <p className="text-gray-200">{metric.q.section}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-400">Current Finding</h4>
                        <p className="text-gray-200">{metric.a?.value instanceof File ? metric.a.value.name : String(metric.a?.value ?? 'N/A')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-400">Source</h4>
                        {metric.a?.source ? 
                            <a href={metric.a.source} target="_blank" rel="noopener noreferrer" className={`${theme.text.link} hover:underline break-all`}>{metric.a.source}</a> :
                            <p className="text-gray-500 italic">No source provided</p>
                        }
                    </div>
                    {metric.a?.value instanceof File && (
                        <div>
                             <h4 className="font-semibold text-gray-400">Linked Evidence</h4>
                             <button onClick={handleDocView} className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md mt-1">View Document</button>
                        </div>
                    )}
                </div>
              )}
              {activeTab === 'collab' && (
                  <div className="space-y-6 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-400 mb-2">Goals for Improvement</h4>
                        <p className="text-gray-500 italic">No goals set. (Feature coming soon)</p>
                      </div>
                       <div>
                        <h4 className="font-semibold text-gray-400 mb-2">Assign Responsibility</h4>
                        <p className="text-gray-500 italic">Not assigned. (Feature coming soon)</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-400 mb-2">Stakeholder Comments</h4>
                        <div className="bg-gray-900/50 p-3 rounded-md">
                            <p className="text-gray-500 italic text-center">No comments yet. (Feature coming soon)</p>
                        </div>
                      </div>
                  </div>
              )}
            </main>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">No metric selected.</p>
          </div>
        )}
      </aside>

      <Modal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)} 
        title={`Evidence: ${metric?.a?.value instanceof File ? metric.a.value.name : ''}`}
      >
        <p className="text-gray-400">Document preview is not available. Please download the file to view.</p>
      </Modal>
    </>
  );
};
