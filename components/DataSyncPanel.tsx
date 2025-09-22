import React, { useState } from 'react';
import type { Question, Answers } from '../types';
import { useTheme } from '../context/ThemeContext';
import { exportToJson, exportToXLSX, exportToCSV, generateCsvTemplate, generateXlsxTemplate } from '../utils/exporters';
import { destinations } from '../constants/destinations';

interface DataSyncPanelProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  answers: Answers;
  onAnswersMerge: (newAnswers: Answers) => void;
  destination: string;
}

type Tab = 'import' | 'export';

export const DataSyncPanel: React.FC<DataSyncPanelProps> = ({
  isOpen,
  onClose,
  questions,
  answers,
  onAnswersMerge,
  destination
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('import');
  const [sheetUrl, setSheetUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const theme = useTheme();

  const handleSync = async () => {
    if (!sheetUrl) {
      alert("Please enter a Google Sheet URL.");
      return;
    }
    // Placeholder for sync logic
    setIsSyncing(true);
    console.log("Syncing with:", sheetUrl);
    await new Promise(res => setTimeout(res, 1500)); // Simulate network request
    setIsSyncing(false);
    alert("Sync functionality is not yet implemented.");
  };

  return (
     <>
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside 
        className={`fixed top-0 right-0 h-full bg-gray-800 shadow-2xl z-50 transition-transform duration-500 ease-in-out w-full max-w-md flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className={`text-xl font-bold ${theme.text.primary}`}>Data Sync</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

         <nav className="flex-shrink-0 border-b border-gray-700">
          <div className="flex space-x-1 p-2">
              <button 
                onClick={() => setActiveTab('import')}
                className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'import' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Import & Templates
              </button>
              <button 
                onClick={() => setActiveTab('export')}
                className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'export' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Export
              </button>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Pull from Google Sheet</h3>
                <p className="text-sm text-gray-400 mt-1 mb-2">Paste a public Google Sheet URL to import answers.</p>
                <div className="flex gap-2">
                   <input 
                      type="url" 
                      placeholder="https://docs.google.com/..."
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      className={`flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}
                    />
                    <button onClick={handleSync} disabled={isSyncing} className={`px-4 py-2 text-sm font-medium text-white ${theme.background.primary} rounded-md disabled:opacity-50`}>
                      {isSyncing ? 'Syncing...' : 'Sync'}
                    </button>
                </div>
              </div>
               <div>
                <h3 className="text-lg font-semibold text-gray-200">Download Templates</h3>
                <p className="text-sm text-gray-400 mt-1 mb-2">Download a template to fill out your data offline.</p>
                <div className="space-y-2">
                  <button onClick={() => generateCsvTemplate(questions, destination)} className="w-full text-left p-3 text-sm text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-md">
                    Download CSV Template for <span className="font-bold">{destination}</span>
                  </button>
                   <button onClick={() => generateXlsxTemplate(questions, destinations)} className="w-full text-left p-3 text-sm text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-md">
                    Download XLSX Template for All Destinations
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'export' && (
             <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">Export Current Progress</h3>
                  <p className="text-sm text-gray-400 mt-1 mb-2">Save your current answers for {destination} to a local file.</p>
                  <div className="space-y-2">
                    <button onClick={() => exportToJson(answers, destination)} className="w-full text-left p-3 text-sm text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-md">Export to JSON</button>
                    <button onClick={() => exportToXLSX(questions, answers, destination)} className="w-full text-left p-3 text-sm text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-md">Export to XLSX</button>
                    <button onClick={() => exportToCSV(questions, answers, destination)} className="w-full text-left p-3 text-sm text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-md">Export to CSV</button>
                  </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-200">Sync to Google Sheet</h3>
                    <p className="text-sm text-gray-400 mt-1 mb-2">
                        To securely sync your data, please export an XLSX file and import it into your Google Sheet.
                    </p>
                    <div className="space-y-3 p-3 bg-gray-900/50 rounded-md border border-gray-700">
                        <p className="text-sm"><span className="font-bold text-gray-200">Step 1:</span> Export your current progress.</p>
                        <button onClick={() => exportToXLSX(questions, answers, destination)} className="w-full text-center p-3 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-md">
                            Export XLSX for {destination}
                        </button>
                        <p className="text-sm"><span className="font-bold text-gray-200">Step 2:</span> Open your Google Sheet.</p>
                        <a 
                            href="https://docs.google.com/spreadsheets/d/1mmgCRHhHJjS77sy8avIzn379jsy77r-82jL0GiwQrlw/edit?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full block text-center p-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            Open Google Sheet
                        </a>
                        <p className="text-sm"><span className="font-bold text-gray-200">Step 3:</span> In Google Sheets, go to <code className="bg-gray-700 px-1 py-0.5 rounded text-teal-300">File &gt; Import</code>, upload the file, and choose 'Replace current sheet'.</p>
                    </div>
                </div>
              </div>
          )}
        </main>
      </aside>
    </>
  );
};