import React from 'react';
import type { AiContact } from '../types';
import { useTheme } from '../context/ThemeContext';

interface FormAccordionProps {
  section: string;
  completion: { completed: number; total: number };
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  aiContacts?: AiContact[];
  isLoading: boolean;
  onAiSuggestContacts: () => void;
  lastEdited?: string;
  isAdmin: boolean;
}

const formatTimestamp = (isoString?: string): string | null => {
    if (!isoString) return null;
    try {
        const date = new Date(isoString);
        const formattedDate = date.toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' });
        const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        return `Last Edited: ${formattedDate}, ${formattedTime}`;
    } catch (e) {
        return null;
    }
};

export const FormAccordion: React.FC<FormAccordionProps> = ({
  section,
  completion,
  isOpen,
  onToggle,
  children,
  aiContacts,
  isLoading,
  onAiSuggestContacts,
  lastEdited,
  isAdmin,
}) => {
  const theme = useTheme();
  const isComplete = completion.completed === completion.total;
  const displayTime = formatTimestamp(lastEdited);

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700/50 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
            <span className={`text-lg font-bold ${isOpen ? theme.text.primary : 'text-gray-200'}`}>{section}</span>
            <span className={`text-xs font-mono px-2.5 py-1 rounded-full ${isComplete ? `${theme.background.secondary} text-white` : 'bg-gray-600'}`}>
                {completion.completed}/{completion.total}
            </span>
        </div>
        <div className="flex items-center gap-3">
             {displayTime && <span className="text-xs text-gray-500 font-normal hidden sm:block">{displayTime}</span>}
            <svg
              className={`w-6 h-6 transform transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
            {isAdmin && (
              <div className={`border-t ${theme.border.primary} pt-4 mb-4 flex justify-end items-center flex-wrap gap-3`}>
                  <button
                      onClick={onAiSuggestContacts}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                      {isLoading ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Suggesting...
                          </>
                      ) : 'Suggest Contacts'}
                </button>
              </div>
            )}

            {aiContacts && (
                <div className={`bg-gray-900/30 p-4 rounded-lg mb-6 border ${theme.border.primary}`}>
                    <h3 className={`font-semibold ${theme.text.primary} mb-2`}>AI Suggested Contacts:</h3>
                    <ul className="space-y-2">
                        {aiContacts.map((contact, index) => (
                            <li key={index} className="text-sm">
                                <strong className="text-gray-200">{contact.name}</strong>
                                <p className="text-gray-400">{contact.description}</p>
                                {contact.website && <a href={contact.website} target="_blank" rel="noopener noreferrer" className={`${theme.text.link} hover:underline`}>{contact.website}</a>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {children}
        </div>
      )}
    </div>
  );
};