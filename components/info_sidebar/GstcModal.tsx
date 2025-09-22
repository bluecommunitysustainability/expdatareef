
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
// FIX: Import GstcCriterionDetail type from the correct file.
import type { GstcCriterionDetail } from '../../types';
import { sdgData } from '../../constants/sdgs';
import { useTheme } from '../../context/ThemeContext';

interface GstcModalProps {
  isOpen: boolean;
  onClose: () => void;
  criterion: GstcCriterionDetail | null;
}

type Tab = 'details' | 'sdgs';

export const GstcModal: React.FC<GstcModalProps> = ({ isOpen, onClose, criterion }) => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setActiveTab('details'); // Reset to default tab when opened
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !criterion) return null;

  const relatedSdgs = sdgData.filter(sdg => criterion.relatedSdgIds.includes(sdg.id));

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gstc-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <header className="flex-shrink-0 flex justify-between items-start p-4 border-b border-gray-700">
          <div className="pr-4">
             <h2 id="gstc-modal-title" className={`text-xl font-semibold ${theme.text.primary}`}>
                <span className="font-mono bg-gray-700 text-teal-300 px-2 py-1 rounded-md mr-2">{criterion.id}</span>
                {criterion.title}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Section {criterion.section}: {criterion.sectionTitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white flex-shrink-0" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>

        <nav className="flex-shrink-0 border-b border-gray-700">
            <div className="flex space-x-1 p-2">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'details' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    Details
                </button>
                <button
                    onClick={() => setActiveTab('sdgs')}
                    className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'sdgs' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    Related SDGs ({relatedSdgs.length})
                </button>
            </div>
        </nav>

        <main className="p-6 overflow-y-auto text-gray-300">
          {activeTab === 'details' && (
            <p className="whitespace-pre-wrap leading-relaxed">{criterion.description}</p>
          )}
          {activeTab === 'sdgs' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {relatedSdgs.length > 0 ? relatedSdgs.map(sdg => (
                    <div key={sdg.id} className="flex flex-col items-center text-center p-2 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div style={{ backgroundColor: sdg.color }} className="w-16 h-16 rounded-md mb-2 flex items-center justify-center text-white font-bold text-2xl">
                           {sdg.id}
                        </div>
                        <span className="text-xs font-medium text-gray-300">{sdg.name}</span>
                    </div>
                )) : (
                    <p className="col-span-full text-center text-gray-400">No specific SDGs have been mapped to this criterion.</p>
                )}
            </div>
          )}
        </main>
      </div>
    </div>,
    document.body
  );
};
