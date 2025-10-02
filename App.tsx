
import React, { useState, useEffect, useMemo, useRef } from 'react';

// Components
import { DestinationSelector } from './components/DestinationSelector';
import { Questionnaire } from './components/Questionnaire';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { SaveButton } from './components/SaveButton';
import { InfoSidebar } from './components/InfoSidebar';
import { InfoModal } from './components/InfoModal';
import { CheckSheetButton } from './components/CheckSheetButton';
import { AuthPanel } from './components/AuthPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { ProgressBar } from './components/ProgressBar';
import { MapView } from './components/MapView';
import { PoiDetailPanel } from './components/PoiDetailPanel';
import { DataSyncPanel } from './components/DataSyncPanel';
import { StakeholderDashboard } from './components/stakeholder/StakeholderDashboard';
import { ExplanationPage } from './components/ExplanationPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GoalsView } from './components/Goals';


// Hooks, constants, utils, types
import { useLocalStorage } from './hooks/useLocalStorage';
import { destinationObjects, type Destination } from './constants/destinations';
import { questions } from './constants/questions';
import { gstcCriteria } from './constants/gstcCriteria';
import { sdgDetails } from './constants/sdgDetails';
import { bcStrategies } from './constants/bcStrategies';
import { stakeholderBackgroundImages } from './constants/stakeholderImages';
import { saveDataToDb, loadDataFromDb, saveUserProfile, loadUserProfile } from './utils/database';
import { getCurrentUserEmail, setCurrentUserEmail } from './utils/session';
import { loadAllCsvData } from './utils/csvLoader';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import type { AppView, Answers, AiContact, InfoModalData, Metric, BcStrategy, ApiKeys, SdgDetailInfo, Poi, Tour, GstcCriterionDetail, AnswerObject, SectionTimestamps, UserProfile, Goals, GoalObject } from './types';
import { seedInitialUsers, seedMonitorsForDestination } from './utils/seedUsers';

const MainLayout: React.FC<Omit<AppProps, 'selectedDestination'> & { 
  destination: string,
  startInStakeholderView: boolean,
  onInitialViewRendered: () => void,
  allDestinations: Destination[],
  onDestinationsUpdate: React.Dispatch<React.SetStateAction<Destination[]>>,
}> = ({
  destination,
  answers,
  aiContacts,
  sectionTimestamps,
  goals,
  pois,
  tours,
  setAnswers,
  setAiContacts,
  setSectionTimestamps,
  setGoals,
  setPois,
  setTours,
  handleChangeDestination,
  apiKeys,
  userProfile,
  handleLogin,
  handleLogout,
  handleUpdateProfile,
  handleBulkMergeAnswers,
  isAdmin,
  startInStakeholderView,
  onInitialViewRendered,
  allDestinations,
  onDestinationsUpdate
}) => {
  const [view, setView] = useState<AppView>(startInStakeholderView ? 'stakeholder' : 'form');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isInfoSidebarOpen, setIsInfoSidebarOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState<InfoModalData | null>(null);
  const [infoHubData, setInfoHubData] = useState<{
    metrics: Metric[];
    sdgs: SdgDetailInfo[];
    gstc: GstcCriterionDetail[];
    bc: BcStrategy[];
  } | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);


  // Auth and Settings State
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isDataSyncPanelOpen, setIsDataSyncPanelOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  
  const theme = useTheme();
  const debounceTimeoutRef = useRef<number | null>(null);
  
  const selectedDestinationObject = useMemo(() => 
    allDestinations.find(d => d.name === destination), 
    [allDestinations, destination]
  );
  
  const bgImage = useMemo(() => selectedDestinationObject?.backgroundImage || stakeholderBackgroundImages[destination] || stakeholderBackgroundImages['default'], [destination, selectedDestinationObject]);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsSidebarCollapsed(true);
    }, 8000); 

    return () => clearTimeout(timer);
  }, []);

  const isLoggedIn = !!userProfile;

  const handleAddNewDestination = async (newDestination: Destination) => {
    onDestinationsUpdate(prev => {
        const exists = prev.some(d => d.name.toLowerCase() === newDestination.name.toLowerCase());
        if (exists) {
            alert(`Destination "${newDestination.name}" already exists.`);
            return prev;
        }
        return [...prev, newDestination];
    });
    await seedMonitorsForDestination(newDestination);
  };

  useEffect(() => {
    if (startInStakeholderView) {
        setIsDataSyncPanelOpen(false);
        setIsAdminDashboardOpen(false);
        setIsSettingsPanelOpen(false);
        setIsAuthPanelOpen(false);
        setIsInfoSidebarOpen(false);
        setSelectedPoi(null);
        onInitialViewRendered();
    }
  }, [startInStakeholderView, onInitialViewRendered]);

  useEffect(() => {
    if (isLoggedIn && isAuthPanelOpen) {
      setIsAuthPanelOpen(false);
    }
  }, [isLoggedIn, isAuthPanelOpen]);

  const saveProgress = async () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
        await saveDataToDb(destination, answers, sectionTimestamps);
        setSaveStatus('saved');
    } catch (error) {
        console.error('Failed to save progress:', error);
        setSaveStatus('error');
    }
  };

  useEffect(() => {
    if (Object.keys(answers).length === 0) return;

    if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = window.setTimeout(() => {
        saveProgress();
    }, 2000);

    return () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    };
  }, [answers, destination, sectionTimestamps]);

  useEffect(() => {
    if (saveStatus === 'saved' || saveStatus === 'error') {
        const timer = setTimeout(() => setSaveStatus('idle'), 3000);
        return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  
  useEffect(() => {
    setIsDataSyncPanelOpen(false); 
    setOpenSection(null);
  }, [destination]);

  useEffect(() => {
    loadAllCsvData()
      .then(csvData => {
        setInfoHubData({ ...csvData, gstc: gstcCriteria, sdgs: sdgDetails, bc: bcStrategies });
      })
      .catch(error => console.error("Failed to load Info Hub data:", error));
  }, []);

  useEffect(() => {
    if (view !== 'map' && selectedPoi) {
      setSelectedPoi(null);
    }
  }, [view, selectedPoi]);

  const { totalQuestions, completedQuestions } = useMemo(() => {
    const total = questions.length;
    const completed = questions.filter(q => {
      const answer = answers[q.id];
      return answer && answer.value !== null && answer.value !== undefined && answer.value !== '';
    }).length;

    return { totalQuestions: total, completedQuestions: completed };
  }, [answers]);

  const handleSave = () => {
    if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
    }
    saveProgress();
  };

  const handleLoad = async () => {
    if (!destination) return;
    const savedData = await loadDataFromDb(destination);
    if (savedData) {
      setAnswers(savedData.answers || {});
      setSectionTimestamps(savedData.timestamps || {});
      alert('Progress loaded successfully!');
    } else {
      alert('No saved progress found for this destination.');
    }
  };
  
  const handleAnswerUpdate = (questionId: string, answer: AnswerObject) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setSectionTimestamps(prev => ({
        ...prev,
        [question.section]: new Date().toISOString(),
      }));
    }
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleGoalUpdate = (questionId: string, goal: GoalObject) => {
    setGoals(prev => ({ ...prev, [questionId]: goal }));
  };
  
  
  const handleSidebarQuestionSelect = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      if (view !== 'form') setView('form');
      setOpenSection(question.section);
      setActiveQuestion(questionId);
    }
  };

  const handleViewChange = (newView: AppView) => {
    setIsDataSyncPanelOpen(false);
    setIsAdminDashboardOpen(false);
    setIsSettingsPanelOpen(false);
    setIsAuthPanelOpen(false);
    setIsInfoSidebarOpen(false);
    setSelectedPoi(null);
    setView(newView);
  };


  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <Sidebar 
        view={view}
        setView={handleViewChange}
        questions={questions}
        answers={answers}
        destination={destination}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onUserClick={() => setIsAuthPanelOpen(true)}
        onAdminClick={() => setIsAdminDashboardOpen(true)}
        onPoiSelect={setSelectedPoi}
        onQuestionSelect={handleSidebarQuestionSelect}
        userProfile={userProfile}
        infoHubData={infoHubData}
        setInfoModalData={setInfoModalData}
        pois={pois}
        setPois={setPois}
        tours={tours}
        setTours={setTours}
        mapboxToken={apiKeys.mapbox}
        bgImage={bgImage}
      />
      <div className={`min-w-0 transition-all duration-300 ease-in-out min-h-screen ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-96'} relative`}>
        {isSidebarCollapsed && view !== 'stakeholder' && (
            <>
                <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
                <div className="absolute inset-0 z-0 bg-gray-900/80 backdrop-blur-sm" />
            </>
        )}
       <div className="relative z-10 flex flex-col min-h-screen">
       {view !== 'stakeholder' && (
        <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between p-4 border-b-2 border-gray-700/60 flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4">
               {userProfile?.customLogo ? (
                    <img src={userProfile.customLogo} alt="Custom Logo" className="h-8 w-auto max-w-[150px] object-contain" />
                ) : (
                    <img src="https://labs.landsurveyorsunited.com/datareef/icons/web/android-chrome-192x192.png" alt="DataReef Logo" className="h-8 w-auto" />
                )}
              <h1 className="text-xl font-bold text-white truncate">{destination}</h1>
              <button onClick={handleChangeDestination} className={`px-3 py-1 text-xs font-semibold text-white bg-gray-600 hover:bg-gray-700 rounded-md flex-shrink-0`}>
                  Change Destination
              </button>
            </div>
            {isSidebarCollapsed && view === 'form' && (
                <div className="mt-2 max-w-md">
                    <ProgressBar completed={completedQuestions} total={totalQuestions} />
                </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button onClick={() => handleViewChange('form')} className={`px-3 py-1 text-sm rounded-md transition-colors ${view === 'form' ? `${theme.background.secondary} text-white` : 'text-gray-300'}`}>Form</button>
              <button onClick={() => handleViewChange('goals')} className={`px-3 py-1 text-sm rounded-md transition-colors ${view === 'goals' ? `${theme.background.secondary} text-white` : 'text-gray-300'}`}>Goals</button>
              <button onClick={() => handleViewChange('dashboard')} className={`px-3 py-1 text-sm rounded-md transition-colors ${view === 'dashboard' ? `${theme.background.secondary} text-white` : 'text-gray-300'}`}>Dashboard</button>
              <button onClick={() => handleViewChange('map')} className={`px-3 py-1 text-sm rounded-md transition-colors ${view === 'map' ? `${theme.background.secondary} text-white` : 'text-gray-300'}`}>Map</button>
            </div>
            
            <SaveButton onSave={handleSave} onLoad={handleLoad} saveStatus={saveStatus} />
            <CheckSheetButton onClick={() => setIsDataSyncPanelOpen(true)} />

            {isLoggedIn && (
              <button 
                onClick={() => setIsSettingsPanelOpen(true)}
                className="p-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500" 
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-1.57 1.996A1.532 1.532 0 013.17 7.49c-1.56.38-1.56 2.6 0 2.98a1.532 1.532 0 01.948 2.286c-.836 1.372.734 2.942 1.996 1.57a1.532 1.532 0 012.286.948c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.372.836 2.942-.734-1.57-1.996A1.532 1.532 0 0116.83 12.51c1.56-.38 1.56-2.6 0-2.98a1.532 1.532 0 01-.948-2.286c.836-1.372-.734-2.942-1.996-1.57a1.532 1.532 0 01-2.286-.948zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {isAdmin && (
                <button 
                  onClick={() => setIsAdminDashboardOpen(true)} 
                  className="p-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500" 
                  title="Admin Dashboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v2a1 1 0 01-1 1h-3.5a1.5 1.5 0 01-3 0V9.5a1.5 1.5 0 01-3 0V8a1 1 0 01-1-1V5a1 1 0 011-1h3.5a1.5 1.5 0 010-3zM3 14a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                </button>
            )}
            
            <button onClick={() => setIsInfoSidebarOpen(true)} className="p-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500" title="Open Info Hub">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM11 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                </svg>
            </button>
          </div>
        </header>
        )}

        <main className={`flex-1 overflow-y-auto ${view !== 'stakeholder' ? 'p-4 sm:p-6 lg:p-8' : ''}`}>
          {view === 'form' ? (
            <Questionnaire 
              questions={questions}
              answers={answers}
              onAnswerUpdate={handleAnswerUpdate}
              destination={destination}
              aiContacts={aiContacts}
              setAiContacts={setAiContacts}
              openSection={openSection}
              setOpenSection={setOpenSection}
              activeQuestion={activeQuestion}
              setActiveQuestion={setActiveQuestion}
              sectionTimestamps={sectionTimestamps}
              isAdmin={isAdmin}
              onBulkMergeAnswers={handleBulkMergeAnswers}
              isLoggedIn={isLoggedIn}
              userProfile={userProfile}
            />
          ) : view === 'goals' ? (
            <GoalsView 
              questions={questions}
              answers={answers}
              goals={goals}
              onGoalUpdate={handleGoalUpdate}
              isLoggedIn={isLoggedIn}
              destination={destination}
              isAdmin={isAdmin}
            />
          ) : view === 'dashboard' ? (
            <Dashboard 
              answers={answers}
              destination={destination}
              questions={questions}
            />
          ) : view === 'map' ? (
            <MapView 
              destination={destination} 
              onPoiSelect={setSelectedPoi} 
              pois={pois}
              setPois={setPois}
              mapboxToken={apiKeys.mapbox}
              tours={tours}
            />
          ) : (
             <StakeholderDashboard 
                questions={questions}
                answers={answers}
                initialDestination={destination}
                sectionTimestamps={sectionTimestamps}
                onDestinationChange={(dest) => {
                  handleChangeDestination();
                }}
                goals={goals}
                pois={pois}
                tours={tours}
                mapboxToken={apiKeys.mapbox}
             />
          )}
        </main>
      </div>
      </div>

      {infoHubData && (
        <InfoSidebar 
          isOpen={isInfoSidebarOpen}
          onClose={() => setIsInfoSidebarOpen(false)}
          data={infoHubData}
          onItemClick={(item) => setInfoModalData(item)}
          destination={destination}
        />
      )}
      <InfoModal
        isOpen={!!infoModalData}
        onClose={() => setInfoModalData(null)}
        data={infoModalData}
      />
      <PoiDetailPanel
        poi={selectedPoi}
        onClose={() => setSelectedPoi(null)}
      />
      <AuthPanel
        isOpen={isAuthPanelOpen}
        onClose={() => setIsAuthPanelOpen(false)}
        onLogin={handleLogin}
      />
       <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />
       {isLoggedIn && (
        <DataSyncPanel
            isOpen={isDataSyncPanelOpen}
            onClose={() => setIsDataSyncPanelOpen(false)}
            questions={questions}
            answers={answers}
            onAnswersMerge={handleBulkMergeAnswers}
            destination={destination}
        />
       )}
       {isAdmin && (
        <AdminDashboard 
            isOpen={isAdminDashboardOpen}
            onClose={() => setIsAdminDashboardOpen(false)}
            destinations={allDestinations}
// FIX: The `onDestinationsUpdate` prop was passed `setAllDestinations`, which is not defined in the scope of `MainLayout`. The correct prop to pass is `onDestinationsUpdate`.
            onDestinationsUpdate={onDestinationsUpdate}
            onAddNewDestination={handleAddNewDestination}
            questions={questions}
            mapboxToken={apiKeys.mapbox}
            apiKeys={apiKeys}
        />
       )}
    </div>
  );
}

interface AppProps {
  selectedDestination: string;
  answers: Answers;
  aiContacts: Record<string, AiContact[]>;
  apiKeys: ApiKeys;
  sectionTimestamps: SectionTimestamps;
  goals: Goals;
  pois: Poi[];
  tours: Tour[];
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  setAiContacts: React.Dispatch<React.SetStateAction<Record<string, AiContact[]>>>;
  setSectionTimestamps: React.Dispatch<React.SetStateAction<SectionTimestamps>>;
  setGoals: React.Dispatch<React.SetStateAction<Goals>>;
  setPois: React.Dispatch<React.SetStateAction<Poi[]>>;
  setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
  handleChangeDestination: () => void;
  userProfile: UserProfile | null;
  handleLogin: (email: string) => Promise<void>;
  handleLogout: () => void;
  handleUpdateProfile: (profile: UserProfile) => Promise<void>;
  handleBulkMergeAnswers: (newAnswers: Answers) => void;
  isAdmin: boolean;
  startInStakeholderView: boolean;
  onInitialViewRendered: () => void;
}

function App() {
  const [selectedDestination, setSelectedDestination] = useState('');
  
  const [allDestinations, setAllDestinations] = useLocalStorage<Destination[]>('datareef-destinations', destinationObjects);

  const destinationNames = useMemo(() => allDestinations.map(d => d.name), [allDestinations]);

  const answersKey = useMemo(() => `answers_${selectedDestination || 'none'}`, [selectedDestination]);
  const [answers, setAnswers] = useLocalStorage<Answers>(answersKey, {});

  const timestampsKey = useMemo(() => `timestamps_${selectedDestination || 'none'}`, [selectedDestination]);
  const [sectionTimestamps, setSectionTimestamps] = useLocalStorage<SectionTimestamps>(timestampsKey, {});

  const goalsKey = useMemo(() => `goals_${selectedDestination || 'none'}`, [selectedDestination]);
  const [goals, setGoals] = useLocalStorage<Goals>(goalsKey, {});

  const poisKey = useMemo(() => `pois_${selectedDestination || 'none'}`, [selectedDestination]);
  const [pois, setPois] = useLocalStorage<Poi[]>(poisKey, []);

  const toursKey = useMemo(() => `tours_${selectedDestination || 'none'}`, [selectedDestination]);
  const [tours, setTours] = useLocalStorage<Tour[]>(toursKey, []);

  const aiContactsKey = useMemo(() => `aiContacts_${selectedDestination || 'none'}`, [selectedDestination]);
  const [aiContacts, setAiContacts] = useLocalStorage<Record<string, AiContact[]>>(aiContactsKey, {});
  
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ gemini: '', openai: '', claude: '', mapbox: '' });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const isAdmin = userProfile?.role === 'admin';

  const [startInStakeholderView, setStartInStakeholderView] = useState(false);
  const [landingView, setLandingView] = useState<'selector' | 'explanation'>('selector');
  const lastDestinationFromStorage = JSON.parse(localStorage.getItem('lastSelectedDestination') || '""');
  const [landingBg, setLandingBg] = useState<{ image: string; name: string } | null>(null);


  useEffect(() => {
    const images = allDestinations
        .map(d => ({ name: d.name, image: d.backgroundImage || stakeholderBackgroundImages[d.name] }))
        .filter(item => item.image && item.image !== stakeholderBackgroundImages['default']);

    if (images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length);
        setLandingBg(images[randomIndex]);
    } else {
        setLandingBg({ name: 'Welcome', image: stakeholderBackgroundImages['default']});
    }
}, [allDestinations]);

  // Session restoration and user seeding effect
  useEffect(() => {
    const initializeApp = async () => {
        await seedInitialUsers(); // Seed users on first load
        const userEmail = getCurrentUserEmail();
        if (userEmail) {
            const profile = await loadUserProfile(userEmail);
            if (profile) {
                setUserProfile(profile);
                setApiKeys(profile.apiKeys);
            } else {
                setCurrentUserEmail(null);
            }
        }
    };
    initializeApp();
  }, []);

  // Effect to apply font size changes globally
  useEffect(() => {
    const size = userProfile?.fontSize || 'md';
    const html = document.documentElement;
    html.style.fontSize = size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px';
  }, [userProfile?.fontSize]);

  const isLoggedIn = !!userProfile;
  const userAvatar = userProfile?.avatar || (userProfile ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || userProfile.email)}&background=4b5563&color=e2e8f0&size=96` : undefined);

  useEffect(() => {
    if (isLoggedIn && isAuthPanelOpen) {
      setIsAuthPanelOpen(false);
    }
  }, [isLoggedIn, isAuthPanelOpen]);


  const handleLogin = async (email: string) => {
    try {
      let profile = await loadUserProfile(email);
      if (!profile) {
          // If a user doesn't exist, we create a basic profile.
          // More detailed profiles (like Monitors) are created via seeding or the admin panel.
          const newProfile: UserProfile = {
              id: email,
              email,
              name: email.split('@')[0],
              apiKeys: { gemini: '', openai: '', claude: '', mapbox: '' },
              role: 'user', 
              activeModel: 'gemini',
              fontSize: 'md',
          };
          await saveUserProfile(newProfile);
          profile = newProfile;
      }
      
      setCurrentUserEmail(email);
      setUserProfile(profile);
      setApiKeys(profile.apiKeys);
    } catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred during sign-in. Please try again.");
    }
  };

  const handleLogout = () => {
      setUserProfile(null);
      setCurrentUserEmail(null);
      setApiKeys({ gemini: '', openai: '', claude: '', mapbox: '' });
  };
  
  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
      await saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
      setApiKeys(updatedProfile.apiKeys);
      alert('Settings updated!');
  };

  const handleDestinationSelect = (destination: string) => {
    if (destination) {
        localStorage.setItem('lastSelectedDestination', JSON.stringify(destination));
    }
    if (destination !== selectedDestination) {
      setSelectedDestination(destination);
    }
  };
  
  const handleChangeDestination = () => {
    setStartInStakeholderView(false);
    setSelectedDestination('');
  }
  
  const handleBulkMergeAnswers = (newAnswers: Answers) => {
    const updatedSections = new Set<string>();
    Object.keys(newAnswers).forEach(questionId => {
        const question = questions.find(q => q.id === questionId);
        if (question) {
            updatedSections.add(question.section);
        }
    });

    const now = new Date().toISOString();
    const newTimestamps = Array.from(updatedSections).reduce((acc, section) => {
        acc[section] = now;
        return acc;
    }, {} as Record<string, string>);
    
    setSectionTimestamps(prev => ({...prev, ...newTimestamps}));
    setAnswers(prev => ({...prev, ...newAnswers}));
  };
  
  const selectedDestinationObject = useMemo(() => 
    allDestinations.find(d => d.name === selectedDestination), 
    [allDestinations, selectedDestination]
  );

  const primaryColor = userProfile?.primaryColor || selectedDestinationObject?.color;


  if (!selectedDestination) {
    return (
      <div 
        className="min-h-screen text-white flex flex-col items-center justify-center p-4 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${landingBg?.image || 'https://storage.ning.com/topology/rest/1.0/file/get/13715201495?profile=original'})` }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm p-1 pr-3 rounded-full">
                <button
                    onClick={() => {
                        if (lastDestinationFromStorage) {
                            setStartInStakeholderView(true);
                            handleDestinationSelect(lastDestinationFromStorage);
                        } else {
                            setLandingView('explanation');
                        }
                    }}
                    className="p-1 rounded-full hover:bg-gray-700/50"
                    title={lastDestinationFromStorage ? `Go to ${lastDestinationFromStorage} Dashboard` : "About the Assessment"}
                >
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                       </svg>
                    </div>
                </button>
                {landingBg && <span className="text-sm font-semibold text-gray-300">{landingBg.name}</span>}
            </div>
            <button onClick={() => setIsAuthPanelOpen(true)} className="p-1 rounded-full hover:bg-gray-700/50 bg-gray-800/50 backdrop-blur-sm" title="User Account">
                {isLoggedIn && userAvatar ? (
                    <img src={userAvatar} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                )}
          </button>
        </div>

        {landingView === 'selector' ? (
            <div className="relative z-10 w-full max-w-lg bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-center">
              <img src="https://labs.landsurveyorsunited.com/datareef/icons/web/android-chrome-192x192.png" alt="DataReef Logo" className="mx-auto h-64 w-auto mb-4" />
              <h1 className="text-3xl font-bold text-teal-400 mb-2">DataReef Observatory</h1>
              <p className="text-gray-400 mb-2">Because without the data there will soon be no reef.</p>
              <p className="text-gray-400 text-sm mb-6 italic">Human Sourced Data with AI insights for a more Sustainable Tourism Impact.</p>
              <DestinationSelector 
                destinations={destinationNames}
                selectedDestination={selectedDestination}
                onSelectDestination={handleDestinationSelect}
              />
            </div>
        ) : (
            <ExplanationPage onBack={() => setLandingView('selector')} />
        )}

        <AuthPanel
          isOpen={isAuthPanelOpen}
          onClose={() => setIsAuthPanelOpen(false)}
          onLogin={async (email) => {
            await handleLogin(email);
            setIsAuthPanelOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <ThemeProvider destination={selectedDestination} primaryColor={primaryColor}>
      <MainLayout 
        destination={selectedDestination}
        answers={answers}
        aiContacts={aiContacts}
        apiKeys={apiKeys}
        sectionTimestamps={sectionTimestamps}
        goals={goals}
        pois={pois}
        tours={tours}
        setAnswers={setAnswers}
        setAiContacts={setAiContacts}
        setSectionTimestamps={setSectionTimestamps}
        setGoals={setGoals}
        setPois={setPois}
        setTours={setTours}
        handleChangeDestination={handleChangeDestination}
        userProfile={userProfile}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        handleUpdateProfile={handleUpdateProfile}
        handleBulkMergeAnswers={handleBulkMergeAnswers}
        isAdmin={isAdmin}
        startInStakeholderView={startInStakeholderView}
        onInitialViewRendered={() => setStartInStakeholderView(false)}
        allDestinations={allDestinations}
        onDestinationsUpdate={setAllDestinations}
      />
    </ThemeProvider>
  );
}

export default App;
