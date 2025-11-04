import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { AppContextType, Theme, AppID, WindowState, ToastMessage, DockPosition, WallpaperID, Notification, VFSFile } from '../types';
import { APPS, INITIAL_WINDOWS_STATE } from '../constants';
import { Aperture, Info, Gamepad2, MousePointerClick, TerminalSquare, Cat } from 'lucide-react';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [windows, setWindows] = useState<Record<AppID, WindowState>>(INITIAL_WINDOWS_STATE);
    const [zIndexCounter, setZIndexCounter] = useState(10);
    const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
    const [dockPosition, setDockPositionState] = useState<DockPosition>('bottom');
    const [wallpaper, setWallpaperState] = useState<WallpaperID>('dots');
    const [secretProjectsUnlocked, setSecretProjectsUnlocked] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [isGuiding, setIsGuiding] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [activeFile, setActiveFile] = useState<VFSFile | null>(null);
    // New states for easter eggs
    const [showMatrixRain, setShowMatrixRain] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isPetDoingBackflip, setPetDoingBackflip] = useState(false);
    const [menuBarClickCount, setMenuBarClickCount] = useState(0);
    const [secretGameUnlocked, setSecretGameUnlocked] = useState(false);
    // New state for demo simulation
    const [demoSearchQuery, setDemoSearchQuery] = useState('');

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            id: Date.now(),
            timestamp: new Date(),
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        setThemeState(savedTheme || 'dark');

        const savedWallpaper = localStorage.getItem('wallpaper') as WallpaperID | null;
        if (savedWallpaper) {
            setWallpaperState(savedWallpaper);
        }

        const savedPosition = localStorage.getItem('dockPosition') as DockPosition | null;
        if (savedPosition === 'left') {
            localStorage.setItem('dockPosition', 'bottom');
            setDockPositionState('bottom');
        } else if (savedPosition) {
            setDockPositionState(savedPosition);
        }
        
        addNotification({
            icon: Aperture,
            title: 'Welcome to Portfolio OS',
            message: 'Feel free to explore the apps and get to know me better!'
        });

        const tipTimeout = setTimeout(() => {
             addNotification({
                icon: Info,
                title: 'System Tip',
                message: 'You can right-click anywhere on the desktop for quick options.'
            });
             addNotification({
                icon: TerminalSquare,
                title: 'Easter Egg Tip!',
                message: 'Try typing "matrix" or "hire me now" in the Terminal!'
            });
            addNotification({
                icon: Cat,
                title: 'Easter Egg Tip!',
                message: 'Triple-click on the desktop pet for a surprise!'
            });
            addNotification({
                icon: MousePointerClick,
                title: 'Easter Egg Tip!',
                message: 'Click my name in the menu bar 10 times to unlock a secret game!'
            });
        }, 30 * 1000); // 30 seconds

        return () => clearTimeout(tipTimeout);
    }, [addNotification]);

    const setTheme = useCallback((theme: Theme) => {
        setThemeState(theme);
        localStorage.setItem('theme', theme);
    }, []);

    const setWallpaper = useCallback((wallpaper: WallpaperID) => {
        setWallpaperState(wallpaper);
        localStorage.setItem('wallpaper', wallpaper);
    }, []);

    const setDockPosition = useCallback((position: DockPosition) => {
        setDockPositionState(position);
        localStorage.setItem('dockPosition', position);
    }, []);

    const focusWindow = useCallback((id: AppID) => {
        setZIndexCounter(prevCounter => {
            const newZIndex = prevCounter + 1;
            setWindows(prevWindows => ({
                ...prevWindows,
                [id]: { ...prevWindows[id], zIndex: newZIndex, isMinimized: false },
            }));
            return newZIndex;
        });
    }, []);
    
    const openWindow = useCallback((id: AppID, title?: string, props?: Record<string, any>) => {
        setZIndexCounter(prevCounter => {
            const newZIndex = prevCounter + 1;
            const appInfo = APPS.find(app => app.id === id);
            const windowTitle = title || appInfo?.title || 'Window';

            setWindows(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    title: windowTitle,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: newZIndex,
                    props: props || {},
                },
            }));
            if (appInfo && appInfo.id !== 'editor' && appInfo.id !== 'terminal' && appInfo.id !== 'hire_me' && appInfo.id !== 'web_browser') {
                addNotification({
                    icon: appInfo.icon,
                    title: `${windowTitle} Opened`,
                    message: `You've launched the ${appInfo.title} application.`
                });
            }
            return newZIndex;
        });
    }, [addNotification]);


    const closeWindow = useCallback((id: AppID) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], isOpen: false },
        }));
        if (id === 'editor') {
            setActiveFile(null);
        }
    }, []);

    const toggleMinimize = useCallback((id: AppID) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], isMinimized: !prev[id].isMinimized },
        }));
    }, []);

    const closeAllWindows = useCallback(() => {
        setWindows(prev => {
            const newWindows = { ...prev };
            for (const id in newWindows) {
                newWindows[id as AppID].isOpen = false;
            }
            return newWindows;
        });
    }, []);
    
    const refreshDesktop = useCallback(() => closeAllWindows(), [closeAllWindows]);
    
    // *** THIS IS THE UPDATED FUNCTION ***
    const toast = useCallback((message: string, type: ToastMessage['type'] = 'info', duration: number = 3000) => {
        const id = Date.now();
        setToastMessages(prev => [...prev, { id, message, type, duration }]);
    }, []);
    
    const removeToast = useCallback((id: number) => {
        setToastMessages(prev => prev.filter(t => t.id !== id));
    }, []);

    const unlockSecretProjects = useCallback(() => setSecretProjectsUnlocked(true), []);
    const incrementClickCount = useCallback(() => setClickCount(c => c + 1), []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const markNotificationsAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const incrementMenuBarClickCount = useCallback(() => setMenuBarClickCount(prev => prev + 1), []);
    const resetMenuBarClickCount = useCallback(() => setMenuBarClickCount(0), []);
    const unlockSecretGame = useCallback(() => setSecretGameUnlocked(true), []);


    const value: AppContextType = {
        theme, setTheme, 
        wallpaper, setWallpaper,
        windows, openWindow, closeWindow, toggleMinimize, focusWindow, 
        toast, toastMessages, removeToast,
        dockPosition, setDockPosition,
        closeAllWindows,
        refreshDesktop,
        secretProjectsUnlocked, unlockSecretProjects,
        clickCount, incrementClickCount,
        isGuiding, setIsGuiding,
        notifications, addNotification, clearNotifications, markNotificationsAsRead,
        isSearchOpen, setSearchOpen,
        activeFile, setActiveFile,
        // New easter egg values
        showMatrixRain, setShowMatrixRain,
        showConfetti, setShowConfetti,
        isPetDoingBackflip, setPetDoingBackflip,
        menuBarClickCount, incrementMenuBarClickCount, resetMenuBarClickCount,
        secretGameUnlocked, unlockSecretGame,
        // New demo simulation values
        demoSearchQuery, setDemoSearchQuery,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
