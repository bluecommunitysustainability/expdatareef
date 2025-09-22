import React, { useState, useMemo, useRef } from 'react';
import { FormSidebarContent } from './sidebar/FormSidebarContent';
import { DashboardSidebarContent } from './sidebar/DashboardSidebarContent';
import { MapSidebarContent } from './sidebar/MapSidebarContent';
import { StakeholderSidebarContent } from './sidebar/StakeholderSidebarContent';
import type { Answers, Question, Poi, UserProfile, Metric, SdgDetailInfo, GstcCriterionDetail, BcStrategy, InfoModalData } from '../types';
import { useTheme } from '../context/ThemeContext';
import SidebarBranding from './sidebar/SidebarBranding';
import { stakeholderBackgroundImages } from '../constants/stakeholderImages';
import { ExportMenu } from './ExportMenu';
import { exportToXLSX, exportToJson, exportToCSV } from '../utils/exporters';


type AppView = 'form' | 'dashboard' | 'map' | 'stakeholder';

interface SidebarProps {
  view: AppView;
  setView: (view: AppView) => void;
  questions: Question[];
  answers: Answers;
  destination: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  onUserClick: () => void;
  onSettingsClick: () => void;
  onPoiSelect: (poi: Poi) => void;
  onQuestionSelect: (questionId: string) => void;
  mapPois: Poi[];
  userProfile: UserProfile | null;
  infoHubData: {
    metrics: Metric[];
    sdgs: SdgDetailInfo[];
    gstc: GstcCriterionDetail[];
    bc: BcStrategy[];
  } | null;
  setInfoModalData: (data: InfoModalData | null) => void;
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export const Sidebar: React.FC<SidebarProps> = ({ 
  view,
  setView,
  questions, 
  answers, 
  destination,
  isLoggedIn,
  isAdmin,
  isCollapsed,
  setIsCollapsed,
  onUserClick,
  onSettingsClick,
  onPoiSelect,
  onQuestionSelect,
  mapPois,
  userProfile,
  infoHubData,
  setInfoModalData
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

  const { questionsBySection, totalQuestions, completedQuestions } = useMemo(() => {
    const sections: Record<string, Question[]> = {};
    
    questions.forEach(q => {
      if (!sections[q.section]) {
        sections[q.section] = [];
      }
      sections[q.section].push(q);
    });

    const completed = questions.filter(q => {
      const answer = answers[q.id];
      return answer && answer.value !== null && answer.value !== undefined && answer.value !== '';
    }).length;

    return {
      questionsBySection: sections,
      totalQuestions: questions.length,
      completedQuestions: completed
    };
  }, [questions, answers]);

  const dashboardSections = useMemo(() => {
    return questions.reduce((acc, question) => {
        (acc[question.section] = acc[question.section] || []).push(question);
        return acc;
    }, {} as Record<string, Question[]>);
  }, [questions]);

  const userAvatar = userProfile?.avatar || (userProfile ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=4b5563&color=e2e8f0&size=96` : undefined);
  
  const bgImage = view === 'stakeholder' ? stakeholderBackgroundImages[destination] || stakeholderBackgroundImages['default'] : undefined;

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
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className={cn("absolute inset-0 z-0", bgImage ? 'bg-gray-900/70 backdrop-blur-sm' : 'bg-gray-800')} />

        <div className="relative z-10 flex flex-col h-full">
            {isCollapsed && <SidebarBranding />}

            {isCollapsed && !isMobileOpen && (
                <button 
                    onClick={() => setIsCollapsed(false)} 
                    className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-50 w-8 h-16 bg-gray-700/80 backdrop-blur-sm rounded-r-lg flex items-center justify-center text-gray-300 hover:bg-gray-600 hover:text-white transition-all opacity-0 animate-fade-in"
                    style={{ animationDelay: '300ms' }}
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
                {isLoggedIn && (
                <>
                    <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-gray-700/50" title="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
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
                </>
                )}
            </div>
            {isCollapsed && <div className="mt-auto"><div /></div>}
            </div>

            <div className={`flex-1 overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {view === 'stakeholder' ? (
                <StakeholderSidebarContent 
                    onBack={() => setView('form')} 
                    data={infoHubData}
                    onItemClick={setInfoModalData}
                />
            ) : view === 'form' ? (
                <FormSidebarContent 
                questionsBySection={questionsBySection}
                answers={answers}
                totalQuestions={totalQuestions}
                completedQuestions={completedQuestions}
                onQuestionSelect={onQuestionSelect}
                />
            ) : view === 'dashboard' ? (
                <DashboardSidebarContent
                questionsBySection={dashboardSections}
                />
            ) : (
                <MapSidebarContent destination={destination} onPoiSelect={onPoiSelect} pointsOfInterest={mapPois} />
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
    </>
  );
};
