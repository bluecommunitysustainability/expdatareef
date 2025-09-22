
import React from 'react';
import type { Question } from '../../types';

interface DashboardSidebarContentProps {
  questionsBySection: Record<string, Question[]>;
}

export const DashboardSidebarContent: React.FC<DashboardSidebarContentProps> = ({ questionsBySection }) => {

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold text-gray-200 mb-4 px-2">Dashboard Sections</h3>
      <ul className="space-y-1">
        {Object.keys(questionsBySection).map(section => {
          const sectionId = `dashboard-section-${section.replace(/\s+/g, '-')}`;
          return (
            <li key={section}>
              <button
                onClick={() => scrollToSection(sectionId)}
                className="w-full text-left block py-2 px-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors"
              >
                {section}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};