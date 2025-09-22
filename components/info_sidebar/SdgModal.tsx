import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { SdgDetailInfo } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface SdgModalProps {
  isOpen: boolean;
  onClose: () => void;
  sdg: SdgDetailInfo | null;
}

type Tab = 'about' | 'targets';

export const SdgModal: React.FC<SdgModalProps> = ({ isOpen, onClose, sdg }) => {
  const [activeTab, setActiveTab] = useState<Tab>('about');
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
      setActiveTab('about'); // Reset to default tab when opened
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !sdg) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sdg-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <header className="flex-shrink-0 flex justify-between items-start p-4 border-b border-gray-700">
            <div className="flex items-center gap-4">
                <div style={{ backgroundColor: sdg.color }} className="w-16 h-16 rounded-md flex-shrink-0 flex items-center justify-center p-1">
                    <img src={sdg.imageUrl} alt={sdg.title} className="w-full h-full object-contain" />
                </div>
                <div>
                    <h2 id="sdg-modal-title" className={`text-xl font-bold ${theme.text.primary}`}>
                        Goal {sdg.id}: {sdg.title}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">{sdg.tagline}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white flex-shrink-0 ml-4" aria-label="Close modal">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </header>

        <nav className="flex-shrink-0 border-b border-gray-700">
            <div className="flex space-x-1 p-2">
                <button
                    onClick={() => setActiveTab('about')}
                    className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'about' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    About the Goal
                </button>
                <button
                    onClick={() => setActiveTab('targets')}
                    className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'targets' ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    Targets ({sdg.targets.length})
                </button>
            </div>
        </nav>

        <main className="p-6 overflow-y-auto text-gray-300">
          {activeTab === 'about' && (
            <p className="whitespace-pre-wrap leading-relaxed">{sdg.description}</p>
          )}
          {activeTab === 'targets' && (
            <ul className="space-y-4">
                {sdg.targets.map(target => (
                    <li key={target.id} className="flex gap-4 items-start">
                        <span className={`flex-shrink-0 font-bold font-mono text-sm ${theme.text.primary} bg-gray-700 px-2 py-1 rounded-md`}>{target.id}</span>
                        <p className="text-gray-400 text-sm">{target.description}</p>
                    </li>
                ))}
            </ul>
          )}
        </main>
      </div>
    </div>,
    document.body
  );
};