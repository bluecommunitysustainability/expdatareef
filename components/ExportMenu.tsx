import React, { useEffect, useRef } from 'react';

interface ExportMenuProps {
  onClose: () => void;
  onExportXLSX: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  parentRef: React.RefObject<HTMLButtonElement>;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ onClose, onExportXLSX, onExportJSON, onExportCSV, parentRef }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, parentRef]);

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 animate-fade-in"
      style={{ animationDuration: '150ms' }}
    >
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-gray-800"></div>
      <div className="p-1 space-y-1">
        <button
          onClick={onExportXLSX}
          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export to XLSX</span>
        </button>
        <button
          onClick={onExportJSON}
          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span>Export to JSON</span>
        </button>
        <button
          onClick={onExportCSV}
          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Export to CSV</span>
        </button>
      </div>
    </div>
  );
};
