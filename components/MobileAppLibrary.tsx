import React from 'react';
import { APPS } from '../constants';
import { useWindowManager } from '../hooks/useWindowManager';
import { AppID } from '../types';
import type { LucideProps } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MobileAppIcon: React.FC<{
    id: AppID;
    title: string;
    icon: React.ComponentType<LucideProps>;
    index: number;
    onSelect: () => void;
}> = ({ id, title, icon: Icon, index, onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.02 }}
            onClick={onSelect}
            className="flex flex-col items-center justify-start text-center p-2 rounded-lg cursor-pointer transition-all duration-150 active:bg-stone-800/30"
            aria-label={`Open ${title}`}
        >
            <div className="w-14 h-14 bg-stone-800/60 rounded-xl flex items-center justify-center mb-1.5 shadow-lg border border-stone-700/50 transition-all duration-150 active:scale-95 active:bg-stone-800/80">
                <Icon className="w-7 h-7 text-stone-200" />
            </div>
            <span className="text-[11px] font-medium text-stone-300 w-full text-center px-1 leading-tight line-clamp-2">
                {title}
            </span>
        </motion.div>
    );
};

interface MobileAppLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAppOpen?: () => void;
}

const MobileAppLibrary: React.FC<MobileAppLibraryProps> = ({ isOpen, onClose, onAppOpen }) => {
    const visibleApps = APPS.filter(app => !app.hidden);
    const { openWindow } = useWindowManager();

    const handleAppClick = (id: AppID) => {
        openWindow(id);
        onAppOpen?.();
        onClose();
    };

    return (
         <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    className="fixed inset-0 z-[2500] bg-stone-900/90 backdrop-blur-xl flex flex-col"
                >
                    <header className="flex items-center justify-between p-4 flex-shrink-0">
                         <h1 className="text-2xl font-semibold text-stone-200">
                            App Library
                        </h1>
                        <button onClick={onClose} className="p-2 rounded-full bg-stone-800/80 active:bg-stone-700/80 transition-colors">
                           <X size={20} className="text-stone-300"/>
                        </button>
                    </header>
                    <div className="flex-1 pt-2 pb-24 px-4 overflow-y-auto">
                        <div className="grid grid-cols-4 gap-x-2 gap-y-5">
                            {visibleApps.map((app, index) => (
                                <MobileAppIcon 
                                    key={app.id} 
                                    id={app.id} 
                                    title={app.title} 
                                    icon={app.icon} 
                                    index={index} 
                                    onSelect={() => handleAppClick(app.id)}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileAppLibrary;
