import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
// FIX: Removed GstcCriterion as it's not defined in types.ts and this modal doesn't handle GSTC data.
import type { InfoModalData, Metric, BcStrategy } from '../types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InfoModalData | null;
}

const renderContent = (data: InfoModalData) => {
  switch (data.type) {
    case 'metric':
      const metric = data as Metric;
      return (
        <div>
          <p><strong className="font-semibold text-gray-300">Related Questions:</strong> {metric.relatedQuestions || 'N/A'}</p>
        </div>
      );
    // FIX: Removed 'sdg' case as it is not a valid type within InfoModalData and caused a type error.
    // SDG-related items are handled by the SdgModal component.
    case 'bc':
      const bc = data as BcStrategy;
      return <p className="text-gray-400">{bc.description}</p>;
    default:
      return null;
  }
};

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, data }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const title = 'name' in data ? data.name : '';
  const iconUrl = 'iconUrl' in data ? data.iconUrl : undefined;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col mt-8 transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-start p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            {iconUrl && <img src={iconUrl} alt={title} className="w-12 h-12 object-contain" />}
            <h2 className="text-xl font-semibold text-teal-400">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          {renderContent(data)}
        </main>
      </div>
    </div>,
    document.body
  );
};