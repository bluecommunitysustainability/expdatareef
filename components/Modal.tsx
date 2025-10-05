import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'default' | 'fullscreen';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'default' }) => {
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
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  useEffect(() => {
    if (isOpen) {
        modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFullscreen = size === 'fullscreen';

  const portalContainerClasses = isFullscreen
    ? "fixed inset-0 z-50"
    : "fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4";

  const modalContainerClasses = isFullscreen
    ? "bg-gray-800 w-screen h-screen flex flex-col relative"
    : "bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col";
    
  const mainClasses = isFullscreen
    ? "overflow-y-auto flex-1"
    : "p-6 overflow-y-auto";

  return ReactDOM.createPortal(
    <div 
        className={portalContainerClasses}
        onClick={!isFullscreen ? onClose : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={modalContainerClasses}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {!isFullscreen ? (
            <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
              <h2 id="modal-title" className={`text-xl font-semibold ${theme.text.primary}`}>{title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </header>
        ) : (
            <h2 id="modal-title" className="sr-only">{title}</h2>
        )}

        <main className={mainClasses}>
          {children}
        </main>
        
        {isFullscreen && (
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/60 backdrop-blur-sm transition-colors" 
                aria-label="Close modal"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        )}
      </div>
    </div>,
    document.body
  );
};