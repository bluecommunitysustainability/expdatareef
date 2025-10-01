import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { Question } from '../../types';
import { GuideSectionContent } from './GuideSectionContent';
import { guideContent } from '../../constants/guideContent';
import { useTheme } from '../../context/ThemeContext';
import { ai } from '../../utils/geminiClient';
import { Type } from "@google/genai";
import { ContactCard, type Contact } from './ContactCard';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  questionsBySection: Record<string, Question[]>;
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, destination, questionsBySection }) => {
  const orderedSections = useMemo(() => Object.keys(questionsBySection), [questionsBySection]);
  const [activeTab, setActiveTab] = useState(orderedSections[0] || '');
  const [isResearchingContacts, setIsResearchingContacts] = useState(false);
  const [contactResults, setContactResults] = useState<Contact[] | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isOpen) {
      if (orderedSections.length > 0 && !orderedSections.includes(activeTab)) {
        setActiveTab(orderedSections[0]);
      }
      modalRef.current?.focus();
    }
  }, [isOpen, orderedSections, activeTab]);
  
  useEffect(() => {
    // Reset contacts when tab changes
    setContactResults(null);
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleResearchContacts = async () => {
    setIsResearchingContacts(true);
    setContactResults(null);
    try {
        const prompt = `You are an expert research assistant specializing in local governance and sustainability. Your task is to find key authoritative contacts for a specific topic within a given tourist destination.

        Destination: ${destination}
        Topic/Metric Group: ${activeTab}

        Instructions:
        1. Find 1 to 3 of the MOST relevant and authoritative contacts (organizations, government departments, or key individuals) for this topic in the specified destination.
        2. Prioritize official government sources (.gov websites), university departments (.edu), or well-established non-profits.
        3. For each contact, provide the following details if available: Name, Title/Role, Website, Email, and Phone Number.
        4. If a general contact email or phone number is available for a department, provide that. Do not provide personal mobile numbers unless they are publicly listed for professional contact.
        5. If no specific contact is found, indicate that in the response.

        Output Format:
        Your response MUST be ONLY a single, valid JSON object with a single key "contacts", which is an array of objects.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        contacts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    website: { type: Type.STRING },
                                    email: { type: Type.STRING },
                                    phone: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const result = JSON.parse(response.text.trim());
        setContactResults(result.contacts || []);

    } catch (error) {
        console.error("Error researching contacts:", error);
        alert("An error occurred while researching contacts. Please check the console.");
        setContactResults([]); // Set to empty array on error to show message
    } finally {
        setIsResearchingContacts(false);
    }
  };


  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 id="guide-modal-title" className={`text-xl font-semibold ${theme.text.primary}`}>
            Data Collection Guide for {destination}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>
        <div className="flex flex-1 min-h-0">
            <nav className="w-1/3 md:w-1/4 border-r border-gray-700 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {orderedSections.map(section => (
                        <li key={section}>
                            <button
                                onClick={() => setActiveTab(section)}
                                className={cn(
                                    'w-full text-left p-2 rounded-md text-sm transition-colors',
                                    activeTab === section ? `${theme.background.secondary} text-white font-semibold` : 'text-gray-300 hover:bg-gray-700/50'
                                )}
                            >
                                {section}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="flex-1 p-6 overflow-y-auto space-y-6">
                {activeTab && (
                  <>
                    <div className="flex justify-between items-center">
                        <h3 className={`text-2xl font-bold ${theme.text.primary}`}>{activeTab}</h3>
                         <button
                            onClick={handleResearchContacts}
                            disabled={isResearchingContacts}
                            className={`px-4 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                        >
                            {isResearchingContacts ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Researching...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                    Research Contacts
                                </>
                            )}
                        </button>
                    </div>

                    {isResearchingContacts && (
                        <div className="text-center p-4 text-gray-400">Searching for contacts...</div>
                    )}

                    {contactResults && (
                        <div className="space-y-4">
                            {contactResults.length > 0 ? (
                                contactResults.map((contact, index) => <ContactCard key={index} contact={contact} />)
                            ) : (
                                <div className="bg-gray-700/50 p-4 rounded-md text-center text-gray-400">
                                    AI research completed. No specific contacts found for this topic. Try a broader search or consult the guide below.
                                </div>
                            )}
                        </div>
                    )}

                    <GuideSectionContent
                        destination={destination}
                        content={guideContent[activeTab] || 'No guide content available for this section.'}
                    />
                  </>
                )}
            </main>
        </div>
      </div>
    </div>,
    document.body
  );
};