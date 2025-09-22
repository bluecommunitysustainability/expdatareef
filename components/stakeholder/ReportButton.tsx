
import React from 'react';

interface ReportButtonProps {
  onGenerateReport: () => void;
}

export const ReportButton: React.FC<ReportButtonProps> = ({ onGenerateReport }) => {
  return (
    <button
      onClick={onGenerateReport}
      className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 z-30 transition-transform hover:scale-110"
      title="Generate Report"
      aria-label="Generate Excel Report"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </button>
  );
};
