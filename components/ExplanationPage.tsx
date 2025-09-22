import React from 'react';

interface ExplanationPageProps {
  onBack: () => void;
}

export const ExplanationPage: React.FC<ExplanationPageProps> = ({ onBack }) => {
  // Using a static theme for the landing page for consistency
  const theme = {
    background: { primary: 'bg-teal-600', hover: 'hover:bg-teal-700' },
    ring: { primary: 'focus:ring-teal-500' },
  };

  return (
    <div className="relative z-10 w-full max-w-2xl bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-left animate-fade-in">
      <img src="https://labs.landsurveyorsunited.com/datareef/icons/web/android-chrome-192x192.png" alt="DataReef Logo" className="mx-auto h-16 w-auto mb-6" />
      <h1 className="text-3xl font-bold text-teal-400 mb-4 text-center">About the Sustainability Assessment</h1>
      
      <div className="text-gray-300 space-y-4 text-lg">
        <p>
          Welcome to the DataReef Sustainability Dashboard. This tool is designed to help destination communities measure, track, and improve their sustainability performance.
        </p>
        <p>
          Our goal is to provide a comprehensive framework for assessing environmental, socio-economic, and cultural health, empowering stakeholders with the data-driven insights needed to make informed decisions.
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4 pt-2">
          <li>
            <span className="font-semibold text-white">Comprehensive Assessment:</span> Answer a detailed set of questions aligned with global standards like the GSTC Criteria and UN SDGs.
          </li>
          <li>
            <span className="font-semibold text-white">Data-Driven Insights:</span> Visualize your progress on the Stakeholder Dashboard, complete with AI-powered analysis and SDG alignment tracking.
          </li>
          <li>
            <span className="font-semibold text-white">Collaborate & Report:</span> Engage with stakeholders, track metrics over time, and generate reports to share your sustainability journey.
          </li>
        </ul>
         <p className="pt-4">
          To begin, please select a destination. Your progress will be saved automatically in your browser.
        </p>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className={`w-full max-w-xs mx-auto flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${theme.background.primary} ${theme.background.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${theme.ring.primary}`}
        >
          Select a Destination
        </button>
      </div>
    </div>
  );
};
