import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Bell, AppWindow } from 'lucide-react';
import { useWindowManager } from '../hooks/useWindowManager';
import { AppID } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface MobileDockProps {
    onOpenAppLibrary: () => void;
    onToggleNotifications: () => void;
    activeWindowId?: AppID;
    onBackFromApp: () => void;
}

const MobileDock: React.FC<MobileDockProps> = ({ onOpenAppLibrary, onToggleNotifications, activeWindowId, onBackFromApp }) => {
    const { closeWindow } = useWindowManager();
    const { setSearchOpen, notifications, markNotificationsAsRead } = useAppContext();
    const hasUnread = notifications.some(n => !n.read);

    const handleBellClick = () => {
        onToggleNotifications();
        markNotificationsAsRead();
    };

    const handleBackClick = () => {
        if (activeWindowId) {
            closeWindow(activeWindowId);
            onBackFromApp();
        }
    };

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[3000] w-auto pointer-events-auto"
        >
            <div className="flex items-center justify-center gap-2 bg-stone-800/95 backdrop-blur-xl px-3 py-2 rounded-full shadow-xl border border-stone-700/60">
                {activeWindowId ? (
                    <button
                        onClick={handleBackClick}
                        className="p-2 rounded-full transition-all duration-150 active:bg-stone-700/50 active:scale-95"
                        aria-label="Go Back"
                    >
                        <ArrowLeft size={18} className="text-stone-300" />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 rounded-full transition-all duration-150 active:bg-stone-700/50 active:scale-95"
                            aria-label="Open Search"
                        >
                            <Search size={18} className="text-stone-300" />
                        </button>
                        <button
                            onClick={handleBellClick}
                            className="relative p-2 rounded-full transition-all duration-150 active:bg-stone-700/50 active:scale-95"
                            aria-label="Open Notifications"
                        >
                            <Bell size={18} className="text-stone-300" />
                            {hasUnread && (
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 border-2 border-stone-800"></div>
                            )}
                        </button>
                        <button
                            onClick={onOpenAppLibrary}
                            className="p-2 rounded-full transition-all duration-150 active:bg-stone-700/50 active:scale-95"
                            aria-label="Open App Library"
                        >
                            <AppWindow size={18} className="text-stone-300" />
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default MobileDock;
