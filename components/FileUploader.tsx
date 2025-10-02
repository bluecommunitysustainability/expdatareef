
import React, { useRef } from 'react';

interface FileUploaderProps {
  currentFile: File | string | null;
  onChange: (file: File | null) => void;
  disabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ currentFile, onChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.target.files && event.target.files[0]) {
      onChange(event.target.files[0]);
    } else {
      onChange(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const fileName = typeof currentFile === 'string' ? currentFile : currentFile?.name;

  return (
    <div className="mt-2">
      <label 
        className={`w-full flex items-center justify-center px-4 py-3 bg-gray-700 text-teal-300 rounded-md shadow-sm tracking-wide uppercase border border-gray-600 transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-600 hover:text-teal-200'}`}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        role="button"
        aria-label="Select a file to upload"
        aria-disabled={disabled}
      >
        <svg className="w-6 h-6 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3v-3h2v3z" />
        </svg>
        <span className="text-sm font-medium">Select a file</span>
        <input ref={fileInputRef} type='file' className="hidden" onChange={handleFileChange} disabled={disabled} />
      </label>
      {fileName && (
        <p className="mt-2 text-sm text-gray-400 truncate">
          Selected: {fileName}
        </p>
      )}
    </div>
  );
};