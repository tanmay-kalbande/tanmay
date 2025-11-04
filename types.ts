import React from 'react';
import type { LucideProps } from 'lucide-react';

// In types.ts

export type AppID = 'about' | 'projects' | 'contact' | 'settings' | 'ai_assistant' | 'terminal' | 'reader' | 'file_explorer' | 'hire_me' | 'tic_tac_toe' | 'games_folder' | 'rock_paper_scissors' | 'connect_four' | 'guess_the_number' | 'hangman' | 'skills_playground' | 'work_with_me' | 'secret_projects' | 'business_card' | 'skills_interests' | 'articles' | 'editor' | 'data_wave_dashboard' | 'case_studies' | 'astro_viewer' | 'astro_tracker' | 'web_browser' | 'insight_engine' | 'apps_folder_shortcut';

export type Theme = 'light' | 'dark';

export type WallpaperID = 'dots' | 'blueprint' | 'circuit' | 'plus' | 'zigzag' | 'woven';

export type DockPosition = 'bottom' | 'left' | 'right';

export interface WindowState {
    id: AppID;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    zIndex: number;
    props?: Record<string, any>;
}

export interface AppDefinition {
    id: AppID;
    title: string;
    icon: React.ComponentType<LucideProps>;
    hidden?: boolean;
}

export interface Project {
  category: string;
  title: string;
  description: string;
  features?: string[];
  contributions?: string[];
  tasks?: string[];
  links: {
    live?: string;
    github?: string;
    website?: string;
    instagram?: string;
  };
  icon: string;
  appId?: AppID;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  project: string;
  content: string;
  snippet: string;
}

export interface MediumArticle {
  title: string;
  snippet: string;
  link: string;
  date: string;
}

export interface Experience {
    role: string;
    company: string;
    duration: string;
    duties: string[];
}

export interface Certification {
    name: string;
    issuer: string;
    date: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
  duration: number; // Add duration property
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
    visualization?: any;
}

export interface Notification {
    id: number;
    icon: React.ComponentType<LucideProps>;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

export interface SearchResultItem {
    id: string;
    type: 'app' | 'project' | 'caseStudy' | 'skill' | 'file' | 'link';
    title: string;
    icon: React.ComponentType<LucideProps>;
    action: () => void;
}

// Virtual File System Types
export interface VFSNode {
    type: 'file' | 'directory';
    name: string;
}
export interface VFSFile extends VFSNode {
    type: 'file';
    content: string;
    isLink?: boolean;
    isShortcut?: boolean;
    appId?: AppID;
}
export interface VFSDirectory extends VFSNode {
    type: 'directory';
    children: { [key: string]: VFSNode };
}

export interface ApodData {
    date: string;
    explanation: string;
    hdurl: string;
    media_type: 'image' | 'video';
    service_version: string;
    title: string;
    url: string;
    copyright?: string;
}

// NASA NEO (Near Earth Object) API Types
export interface NeoData {
    id: string;
    name: string;
    estimated_diameter: {
        kilometers: {
            estimated_diameter_min: number;
            estimated_diameter_max: number;
        };
    };
    is_potentially_hazardous_asteroid: boolean;
    close_approach_data: {
        close_approach_date_full: string;
        relative_velocity: {
            kilometers_per_hour: string;
        };
        miss_distance: {
            kilometers: string;
            lunar: string;
        };
    }[];
}

export interface WebBrowserAppProps {
    initialUrl: string;
    title?: string;
    initialZoom?: number;
}


export interface AppContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    wallpaper: WallpaperID;
    setWallpaper: (wallpaper: WallpaperID) => void;
    windows: Record<AppID, WindowState>;
    openWindow: (id: AppID, title?: string, props?: Record<string, any>) => void;
    closeWindow: (id: AppID) => void;
    toggleMinimize: (id: AppID) => void;
    focusWindow: (id: AppID) => void;
    toast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
    toastMessages: ToastMessage[];
    removeToast: (id: number) => void;
    dockPosition: DockPosition;
    setDockPosition: (position: DockPosition) => void;
    closeAllWindows: () => void;
    refreshDesktop: () => void;
    secretProjectsUnlocked: boolean;
    unlockSecretProjects: () => void;
    clickCount: number;
    incrementClickCount: () => void;
    isGuiding: boolean;
    setIsGuiding: (isGuiding: boolean) => void;
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    clearNotifications: () => void;
    markNotificationsAsRead: () => void;
    isSearchOpen: boolean;
    setSearchOpen: (isOpen: boolean) => void;
    activeFile: VFSFile | null;
    setActiveFile: (file: VFSFile | null) => void;
    // New easter egg states
    showMatrixRain: boolean;
    setShowMatrixRain: (show: boolean) => void;
    showConfetti: boolean;
    setShowConfetti: (show: boolean) => void;
    isPetDoingBackflip: boolean;
    setPetDoingBackflip: (doing: boolean) => void;
    menuBarClickCount: number;
    incrementMenuBarClickCount: () => void;
    resetMenuBarClickCount: () => void;
    secretGameUnlocked: boolean;
    unlockSecretGame: () => void;
    // New demo simulation state
    demoSearchQuery: string;
    setDemoSearchQuery: (query: string) => void;
}
