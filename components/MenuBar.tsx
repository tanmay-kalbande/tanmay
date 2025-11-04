import React from 'react';
import { Aperture, Bell, Search } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Clock from './Clock';
import { motion } from 'framer-motion';

interface MenuBarProps {
    onToggleNotifications: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onToggleNotifications }) => {
    const { openWindow, notifications, markNotificationsAsRead, setSearchOpen, incrementMenuBarClickCount } = useAppContext();
    const hasUnread = notifications.some(n => !n.read);

    const handleBellClick = () => {
        onToggleNotifications();
        markNotificationsAsRead();
    };

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] bg-stone-200/50 dark:bg-stone-800/50 backdrop-blur-lg border border-stone-300/50 dark:border-stone-700/50 flex items-center justify-between px-3 py-1.5 rounded-full shadow-lg select-none gap-4">
            <button
                onClick={() => {
                    openWindow('about');
                    incrementMenuBarClickCount();
                }}
                className="flex items-center gap-2 text-sm font-bold text-stone-800 dark:text-stone-200 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-1 rounded-full transition-colors"
                aria-label="About Tanmay Kalbande"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 8,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    <Aperture size={16} className="text-amber-500" />
                </motion.div>
                <span className="hidden sm:inline">Tanmay Kalbande</span>
            </button>
            
            <div className="w-px h-5 bg-stone-300 dark:bg-stone-700"></div>

            <div className="flex items-center gap-2">
                <button onClick={() => setSearchOpen(true)} className="text-stone-800 dark:text-stone-200 hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full transition-colors" aria-label="Open search (Cmd+K)">
                    <Search size={16} />
                </button>
                <button onClick={handleBellClick} className="relative text-stone-800 dark:text-stone-200 hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full transition-colors" aria-label="Open notifications">
                    <Bell size={16} />
                    {hasUnread && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 border border-stone-200 dark:border-stone-800"></div>
                    )}
                </button>
                <div className="hidden sm:block">
                    <Clock />
                </div>
            </div>
        </header>
    );
};

export default MenuBar;
