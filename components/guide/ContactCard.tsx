import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface Contact {
  name: string;
  title: string;
  website?: string;
  email?: string;
  phone?: string;
}

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const theme = useTheme();

  return (
    <div className={`bg-gray-900/50 p-4 rounded-lg border-l-4 ${theme.border.primary}`}>
      <h4 className="font-bold text-white">{contact.name}</h4>
      <p className="text-sm text-gray-400">{contact.title}</p>
      <div className="mt-3 space-y-2 text-sm">
        {contact.website && (
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <a href={contact.website} target="_blank" rel="noopener noreferrer" className={`break-all ${theme.text.link} hover:underline`}>{contact.website}</a>
          </div>
        )}
        {contact.email && (
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <a href={`mailto:${contact.email}`} className={`${theme.text.link} hover:underline`}>{contact.email}</a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span className="text-gray-300">{contact.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};