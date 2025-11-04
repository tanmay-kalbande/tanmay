import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { Notification as NotificationType } from '../types';
import { Bell, X } from 'lucide-react';

const NotificationItem: React.FC<{ notification: NotificationType }> = ({ notification }) => {
    const { icon: Icon, title, message, timestamp } = notification;

    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "m ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    return (
        <div className="bg-stone-200/50 dark:bg-stone-800/50 p-3 rounded-lg border border-stone-300/50 dark:border-stone-700/50 flex gap-3">
            <Icon className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
            <div className="flex-grow">
                <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold text-sm text-stone-800 dark:text-stone-100">{title}</h4>
                    <span className="text-xs text-stone-500 dark:text-stone-400 flex-shrink-0">{timeAgo(timestamp)}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">{message}</p>
            </div>
        </div>
    );
};

const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { notifications, clearNotifications } = useAppContext();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-[1999]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full max-w-sm bg-stone-100/80 dark:bg-stone-900/80 backdrop-blur-xl border-l border-stone-300/50 dark:border-stone-700/50 z-[2000] flex flex-col"
                    >
                        <header className="flex items-center justify-between p-4 border-b border-stone-300/50 dark:border-stone-700/50 flex-shrink-0">
                            <h3 className="font-bold text-lg text-stone-800 dark:text-stone-200">Notifications</h3>
                            <button
                                onClick={clearNotifications}
                                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline disabled:opacity-50 disabled:no-underline"
                                disabled={notifications.length === 0}
                            >
                                Clear All
                            </button>
                        </header>
                        <main className="flex-grow p-4 space-y-3 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(n => <NotificationItem key={n.id} notification={n} />)
                            ) : (
                                <div className="text-center text-stone-500 dark:text-stone-400 pt-10">
                                    <Bell size={40} className="mx-auto mb-4" />
                                    <p className="font-semibold">No New Notifications</p>
                                    <p className="text-sm">You're all caught up!</p>
                                </div>
                            )}
                        </main>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationCenter;