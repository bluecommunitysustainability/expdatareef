import React, { useState, useMemo, useRef } from 'react';
import { FormSidebarContent } from './sidebar/FormSidebarContent';
import { DashboardSidebarContent } from './sidebar/DashboardSidebarContent';
import { MapSidebarContent } from './sidebar/MapSidebarContent';
import { StakeholderSidebarContent } from './sidebar/StakeholderSidebarContent';
import type { AppView, Answers, Question, Poi, Tour, UserProfile, Metric, SdgDetailInfo, GstcCriterionDetail, BcStrategy, InfoModalData } from '../types';
import { useTheme } from '../context/ThemeContext';
import SidebarBranding from './sidebar/SidebarBranding';
import { ExportMenu } from './ExportMenu';
import { exportToXLSX, exportToJson, exportToCSV } from '../../utils/exporters';
import { GuideModal } from './guide/GuideModal';
import { availableThemes } from '../../constants/teamColors';


const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export const Sidebar: React.FC<SidebarProps> = ({ 
  view,
  setView,
  questions, 
  answers, 
  destination,
  isLoggedIn,
  isAdmin,
  isMonitorOrAdmin,
  isCollapsed,
  setIsCollapsed,
  onUserClick,
  onAdminClick,
  onRecordingStudioClick,
  onPoiSelect,
  onQuestionSelect,
  userProfile,
  infoHubData,
  setInfoModalData,
  pois,
  setPois,
  tours,
  setTours,
  mapboxToken,
  bgImage,
  isMapSelectionMode,
  setIsMapSelectionMode,
  mapSelectedPoiIds,
  setMapSelectedPoiIds
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

  const themeColorHex = useMemo(() => {
    return availableThemes.find(t => t.value === theme.name)?.hex || '#374151'; // fallback to gray-700
  }, [theme.name]);

  const { questionsBySection } = useMemo(() => {
    const sections: Record<string, Question[]> = {};
    
    questions.forEach(q => {
      if (!sections[q.section]) {
        sections[q.section] = [];
      }
      sections[q.section].push(q);
    });

    return {
      questionsBySection: sections,
    };
  }, [questions]);

  const dashboardSections = useMemo(() => {
    return questions.reduce((acc, question) => {
        (acc[question.section] = acc[question.section] || []).push(question);
        return acc;
    }, {} as Record<string, Question[]>);
  }, [questions]);

  const userAvatar = userProfile?.avatar || (userProfile ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=4b5563&color=e2e8f0&size=96` : undefined);
  
  const exportButtonAndMenu = isLoggedIn && (
    <div className="relative">
      <button
        ref={exportButtonRef}
        onClick={() => setIsExportMenuOpen(p => !p)}
        className="p-2 rounded-full hover:bg-gray-700/50"
        title="Export Data"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
      {isExportMenuOpen && (
        <ExportMenu
          onClose={() => setIsExportMenuOpen(false)}
          onExportXLSX={() => {
            exportToXLSX(questions, answers, destination);
            setIsExportMenuOpen(false);
          }}
          onExportJSON={() => {
            exportToJson(answers, destination);
            setIsExportMenuOpen(false);
          }}
          onExportCSV={() => {
            exportToCSV(questions, answers, destination);
            setIsExportMenuOpen(false);
          }}
          parentRef={exportButtonRef}
        />
      )}
    </div>
  );

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-gray-800 rounded-md text-white"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Open sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      <aside 
        className={`fixed top-0 left-0 h-full border-r border-gray-700/50 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-20' : 'w-80 lg:w-96'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className={cn("absolute inset-0 z-0", 'bg-gray-900/70 backdrop-blur-sm')} />

        <div className="relative z-10 flex flex-col h-full">
            {isCollapsed && <SidebarBranding />}
            
            {isCollapsed && !isMobileOpen && (
                <button
                    onClick={() => setView('stakeholder')}
                    className={cn(
                        'absolute top-24 left-0 w-6 flex items-center justify-center text-center tracking-wide text-gray-300 hover:text-white transition-colors',
                        view === 'stakeholder' && `font-bold ${theme.text.primary}`
                    )}
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '1.1em' }}
                    title="Go to Stakeholder Dashboard"
                >
                    Stakeholders
                </button>
            )}


            {isCollapsed && !isMobileOpen && (
                <button 
                    onClick={() => setIsCollapsed(false)} 
                    className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-50 w-8 h-16 rounded-r-lg flex items-center justify-center text-gray-300 hover:text-white transition-all opacity-0 animate-fade-in"
                    style={{ 
                        animationDelay: '300ms',
                        backgroundColor: `${themeColorHex}BF` // BF is ~75% opacity
                    }}
                    title="Expand Sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            <div className={`p-4 border-b border-gray-700/50 flex ${isCollapsed ? 'flex-col justify-center items-center gap-4 h-full' : 'items-center justify-between'}`}>
            {!isCollapsed && (
                <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
                    <span className={`font-bold text-lg ${theme.text.primary} truncate`}>{destination}</span>
                    <button 
                        onClick={() => setView('stakeholder')} 
                        className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${view === 'stakeholder' ? `${theme.background.secondary} text-white` : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        title="Go to Stakeholder Dashboard"
                    >
                        Stakeholders
                    </button>
                </div>
            )}
            
            <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'gap-1'}`}>
                <button onClick={onUserClick} className="p-1 rounded-full hover:bg-gray-700/50" title="User Account">
                {isLoggedIn && userAvatar ? (
                    <img src={userAvatar} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                )}
                </button>
                {isMonitorOrAdmin && (
                     <button
                        onClick={onRecordingStudioClick}
                        className="p-2 rounded-full hover:bg-gray-700/50"
                        title="Recording Studio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          <path d="M14.553 5.447A.5.5 0 0115 5.86v8.28a.5.5 0 01-.447.413l-3-1A.5.5 0 0111 13.14V6.86a.5.5 0 01.553-.413l3 1z" />
                        </svg>
                      </button>
                )}
                {/* Show export button here if sidebar is expanded, or if collapsed but user is NOT an admin */}
                {isLoggedIn && (!isCollapsed || !isAdmin) && exportButtonAndMenu}
            </div>
             {isCollapsed && (
                <div className="mt-auto flex flex-col items-center gap-2">
                    {isMonitorOrAdmin && (
                         <button
                            onClick={onRecordingStudioClick}
                            className="p-2 rounded-full hover:bg-gray-700/50"
                            title="Recording Studio"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                              <path d="M14.553 5.447A.5.5 0 0115 5.86v8.28a.5.5 0 01-.447.413l-3-1A.5.5 0 0111 13.14V6.86a.5.5 0 01.553-.413l3 1z" />
                            </svg>
                          </button>
                    )}
                    {/* When collapsed and user is an admin, show the export button here, at the bottom. */}
                    {isAdmin && isLoggedIn && exportButtonAndMenu}
                    {isAdmin && (
                        <button 
                            onClick={onAdminClick} 
                            className="p-2 rounded-full hover:bg-gray-700/50" 
                            title="Admin Dashboard"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a2.5 2.5 0 00-2.5 2.5c0 1.28.97 2.33 2.25 2.47V10h-1v2.5A2.5 2.5 0 0011.25 15H14a1 1 0 001-1v-2.5a2.5 2.5 0 00-2.5-2.5H11V7.47C12.03 7.33 13 6.28 13 5a2.5 2.5 0 00-2.5-2.5zM8.5 5A1.5 1.5 0 1110 6.5 1.5 1.5 0 018.5 5zM5 12.5A2.5 2.5 0 007.5 15H9v2.5A2.5 2.5 0 0011.5 20h.05A2.5 2.5 0 0014 17.5V16h1.5a2.5 2.5 0 002.5-2.5V12h-11z" />
                            </svg>
                        </button>
                    )}
                    {isMonitorOrAdmin && (
                        <button 
                            onClick={() => setIsGuideModalOpen(true)} 
                            className="p-2 rounded-full hover:bg-gray-700/50" 
                            title="Open Data Collection Guide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
            </div>

            <div className={`flex-1 overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {view === 'stakeholder' ? (
                <StakeholderSidebarContent 
                    onBack={() => setView('form')} 
                    data={infoHubData}
                    onItemClick={setInfoModalData}
                    pois={pois}
                    tours={tours}
                    mapboxToken={mapboxToken}
                />
            ) : view === 'form' ? (
                <FormSidebarContent 
                questions={questions}
                questionsBySection={questionsBySection}
                answers={answers}
                onQuestionSelect={onQuestionSelect}
                />
            ) : view === 'dashboard' ? (
                <DashboardSidebarContent
                questionsBySection={dashboardSections}
                />
            ) : (
                <MapSidebarContent 
                    destination={destination} 
                    onPoiSelect={onPoiSelect} 
                    pointsOfInterest={pois}
                    setTours={setTours}
                    mapboxToken={mapboxToken}
                    isAdmin={isAdmin}
                    isMonitorOrAdmin={isMonitorOrAdmin}
                    answers={answers}
                    questions={questions}
                    setPois={setPois}
                    isMapSelectionMode={isMapSelectionMode}
                    setIsMapSelectionMode={setIsMapSelectionMode}
                    mapSelectedPoiIds={mapSelectedPoiIds}
                    setMapSelectedPoiIds={setMapSelectedPoiIds}
                />
            )}
            </div>
            
            {!isCollapsed && (
            <div className="p-2 border-t border-gray-700/50 mt-auto">
                <button 
                    onClick={() => setIsCollapsed(true)} 
                    className={`w-full hidden lg:flex items-center justify-center p-2 rounded-md hover:bg-gray-700/50 ${theme.text.primary}`} 
                    title="Collapse Sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>
            )}
        </div>
      </aside>

      <GuideModal 
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        destination={destination}
        questionsBySection={questionsBySection}
      />
    </>
  );
};

interface SidebarProps {
  view: AppView;
  setView: (view: AppView) => void;
  questions: Question[];
  answers: Answers;
  destination: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isMonitorOrAdmin: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  onUserClick: () => void;
  onAdminClick: () => void;
  onRecordingStudioClick: () => void;
  onPoiSelect: (poi: Poi) => void;
  onQuestionSelect: (questionId: string) => void;
  userProfile: UserProfile | null;
  infoHubData: {
    metrics: Metric[];
    sdgs: SdgDetailInfo[];
    gstc: GstcCriterionDetail[];
    bc: BcStrategy[];
  } | null;
  setInfoModalData: (data: InfoModalData | null) => void;
  pois: Poi[];
  setPois: React.Dispatch<React.SetStateAction<Poi[]>>;
  tours: Tour[];
  setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
  mapboxToken: string;
  bgImage: string;
  isMapSelectionMode: boolean;
  setIsMapSelectionMode: (value: boolean) => void;
  mapSelectedPoiIds: string[];
  setMapSelectedPoiIds: React.Dispatch<React.SetStateAction<string[]>>;
}