import React, { ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute left-full ml-3 w-96 p-3 bg-gray-900 border border-gray-600 rounded-lg shadow-xl text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
        {content}
        <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-0 h-0 
          border-y-4 border-y-transparent
          border-r-4 border-r-gray-900">
        </div>
      </div>
    </div>
  );
};