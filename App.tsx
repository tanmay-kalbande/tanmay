import React, { useState, useEffect, useMemo } from 'react';
import { AppProvider } from './contexts/AppContext';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import Window from './components/Window';
import BootScreen from './components/BootScreen';
import { useWindowManager } from './hooks/useWindowManager';
import AboutApp from './apps/AboutApp';
import ProjectsApp from './apps/ProjectsApp';
import ContactApp from './apps/ContactApp';
import SettingsApp from './apps/SettingsApp';
import AI_AssistantApp from './apps/AI_AssistantApp';
import TerminalApp from './apps/TerminalApp';
import ReaderApp from './apps/ReaderApp';
import FileExplorerApp from './apps/FileExplorerApp';
import EditorApp from './apps/EditorApp';
import HireMeApp from './apps/HireMeApp';
import TicTacToeApp from './apps/TicTacToeApp';
import GamesFolderApp from './apps/GamesFolderApp';
import RockPaperScissorsApp from './apps/RockPaperScissorsApp';
import ConnectFourApp from './apps/ConnectFourApp';
import GuessTheNumberApp from './apps/GuessTheNumberApp';
import HangmanApp from './apps/HangmanApp';
import SkillsPlaygroundApp from './apps/SkillsPlaygroundApp';
import WorkWithMeApp from './apps/WorkWithMeApp';
import SecretProjectsApp from './apps/SecretProjectsApp';
import BusinessCardApp from './apps/BusinessCardApp';
import SkillsInterestsApp from './apps/SkillsInterestsApp';
import ArticlesApp from './apps/ArticlesApp';
import CaseStudiesApp from './apps/CaseStudiesApp';
import AstroViewerApp from './apps/AstroViewerApp';
import AstroTrackerApp from './apps/AstroTrackerApp';
import WebBrowserApp from './apps/WebBrowserApp';
import InsightEngineApp from './apps/InsightEngineApp';
import Toast from './components/Toast';
import DesktopPet from './components/DesktopPet';
import { AppID } from './types';
import { useAppContext } from './contexts/AppContext';
import { AnimatePresence } from 'framer-motion';
import OnboardingModal from './components/OnboardingModal';
import MenuBar from './components/MenuBar';
import NotificationCenter from './components/NotificationCenter';
import { LockKeyhole, Gamepad2 } from 'lucide-react';
import UniversalSearch from './components/UniversalSearch';
import DataWaveIndiaDashboard from './apps/DataWaveIndiaDashboard';
import MatrixRainOverlay from './components/MatrixRainOverlay';
// import { DemoSimulation } from './components/DemoSimulation'; // Comment or delete this line
import { useWindowSize } from './hooks/useWindowSize';
import MobileStatusBar from './components/MobileStatusBar';
import MobileDesktop from './components/MobileDesktop';
import MobileDock from './components/MobileDock';
import MobileAppLibrary from './components/MobileAppLibrary';

const AppContent: React.FC = () => {
    const { windows } = useWindowManager();
    const { 
        theme, 
        incrementClickCount, 
        unlockSecretProjects, 
        toast, 
        wallpaper, 
        addNotification, 
        isSearchOpen, 
        setSearchOpen,
        showMatrixRain,
        setShowMatrixRain,
        isPetDoingBackflip,
        menuBarClickCount,
        resetMenuBarClickCount,
        unlockSecretGame,
        secretGameUnlocked,
        openWindow
    } = useAppContext();
    const [booting, setBooting] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
    const [isAppLibraryOpen, setIsAppLibraryOpen] = useState(false);
    const [appOpenedFromLibrary, setAppOpenedFromLibrary] = useState(false);
    const { isMobile } = useWindowSize();

    useEffect(() => {
        const timer = setTimeout(() => {
            setBooting(false);
            const hasVisited = localStorage.getItem('hasVisitedPortfolioOS');
            if (!hasVisited && !isMobile) {
                setShowOnboarding(true);
            }
        }, 2500);
        return () => clearTimeout(timer);
    }, [isMobile]);

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    useEffect(() => {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let index = 0;
        const handler = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === konamiCode[index].toLowerCase()) {
                index++;
                if (index === konamiCode.length) {
                    unlockSecretProjects();
                    addNotification({ icon: LockKeyhole, title: 'System Unlocked', message: 'Secret Projects app is now available on your desktop.' });
                    index = 0;
                }
            } else {
                index = 0;
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [unlockSecretProjects, addNotification]);
    
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(!isSearchOpen);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isSearchOpen, setSearchOpen]);

    useEffect(() => {
        if (menuBarClickCount >= 10 && !secretGameUnlocked) {
            unlockSecretGame();
            openWindow('tic_tac_toe', 'Secret Tic-Tac-Toe');
            addNotification({ icon: Gamepad2, title: 'Secret Game Unlocked!', message: 'You found the hidden Tic-Tac-Toe game! Enjoy!' });
            toast('You found a secret game!', 'success');
            resetMenuBarClickCount();
        }
    }, [menuBarClickCount, secretGameUnlocked, unlockSecretGame, openWindow, addNotification, toast, resetMenuBarClickCount]);
    
    const handleCloseOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem('hasVisitedPortfolioOS', 'true');
    };

    const handleBackFromApp = () => {
        if (appOpenedFromLibrary) {
            setIsAppLibraryOpen(true);
            setAppOpenedFromLibrary(false);
        }
    };

    const appComponents: { [key in AppID]: React.FC<any> } = {
        about: AboutApp, projects: ProjectsApp, contact: ContactApp, settings: SettingsApp,
        ai_assistant: AI_AssistantApp, terminal: TerminalApp, reader: ReaderApp,
        file_explorer: FileExplorerApp, editor: EditorApp, hire_me: HireMeApp,
        tic_tac_toe: TicTacToeApp, games_folder: GamesFolderApp,
        rock_paper_scissors: RockPaperScissorsApp, connect_four: ConnectFourApp,
        guess_the_number: GuessTheNumberApp, hangman: HangmanApp,
        skills_playground: SkillsPlaygroundApp, work_with_me: WorkWithMeApp,
        secret_projects: SecretProjectsApp, business_card: BusinessCardApp,
        skills_interests: SkillsInterestsApp, articles: ArticlesApp,
        case_studies: CaseStudiesApp, data_wave_dashboard: DataWaveIndiaDashboard,
        astro_viewer: AstroViewerApp, astro_tracker: AstroTrackerApp,
        web_browser: WebBrowserApp, insight_engine: InsightEngineApp,
    };
    
    const activeWindow = useMemo(() => {
        const openWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized);
        if (openWindows.length === 0) return null;
        return openWindows.reduce((top, win) => (win.zIndex > top.zIndex ? win : top), openWindows[0]);
    }, [windows]);

    if (booting) {
        return <BootScreen />;
    }

    return (
        <div onClick={isMobile ? undefined : incrementClickCount} className={`relative w-screen h-screen overflow-hidden transition-colors duration-500 ${`wallpaper-${wallpaper}-${theme}`} select-none`}>
            {isMobile ? (
                <>
                    {!activeWindow && <MobileStatusBar />}
                    <MobileDesktop />
                    <MobileDock
                        onOpenAppLibrary={() => setIsAppLibraryOpen(true)}
                        onToggleNotifications={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
                        activeWindowId={activeWindow?.id}
                        onBackFromApp={handleBackFromApp}
                    />
                    <MobileAppLibrary 
                        isOpen={isAppLibraryOpen} 
                        onClose={() => {
                            setIsAppLibraryOpen(false);
                            setAppOpenedFromLibrary(false);
                        }}
                        onAppOpen={() => setAppOpenedFromLibrary(true)}
                    />
                    <AnimatePresence>
                        {activeWindow && (
                             <Window
                                key={activeWindow.id}
                                id={activeWindow.id}
                                winState={activeWindow}
                                padding={!['terminal', 'business_card', 'editor', 'data_wave_dashboard', 'astro_viewer', 'astro_tracker', 'web_browser'].includes(activeWindow.id)}
                            >
                                {React.createElement(appComponents[activeWindow.id], activeWindow.props)}
                            </Window>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <>
                    <MenuBar onToggleNotifications={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)} />
                    <Desktop />
                    <div className="absolute inset-0 pointer-events-none">
                        <AnimatePresence>
                            {Object.values(windows).map((win) => {
                                if (!win.isOpen) return null;
                                const AppContentComponent = appComponents[win.id];
                                if (!AppContentComponent) return null;
                                return (
                                    <Window
                                        key={win.id}
                                        id={win.id}
                                        winState={win}
                                        padding={!['terminal', 'business_card', 'editor', 'data_wave_dashboard', 'astro_viewer', 'astro_tracker', 'web_browser'].includes(win.id)}
                                    >
                                        <AppContentComponent {...win.props} />
                                    </Window>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                    <Dock />
                    {/* Remove the DemoSimulation component call below */}
                    {/* <DemoSimulation /> */} 
                </>
            )}

            <DesktopPet isDoingBackflip={isPetDoingBackflip} />
            <Toast />
            <NotificationCenter isOpen={isNotificationCenterOpen} onClose={() => setIsNotificationCenterOpen(false)} />
            <AnimatePresence>
                {isSearchOpen && <UniversalSearch />}
            </AnimatePresence>
            <AnimatePresence>
                {showOnboarding && !isMobile && <OnboardingModal onClose={handleCloseOnboarding} />}
            </AnimatePresence>
            <AnimatePresence>
                {showMatrixRain && <MatrixRainOverlay key="matrix-rain" onClose={() => setShowMatrixRain(false)} />}
            </AnimatePresence>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
