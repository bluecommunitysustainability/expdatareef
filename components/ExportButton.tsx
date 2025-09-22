import React from 'react';

interface ExportButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white disabled:text-gray-500"
    >
      {children}
    </button>
  );
};
