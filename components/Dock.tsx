import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOCK_APPS } from '../constants';
import { useWindowManager } from '../hooks/useWindowManager';
import { AppID } from '../types';
import { useAppContext } from '../contexts/AppContext';

const Dock: React.FC = () => {
    const { windows, openWindow, focusWindow, toggleMinimize } = useWindowManager();
    const { dockPosition } = useAppContext();

    const handleIconClick = (id: AppID) => {
        const win = windows[id];

        // Case 1: App is not open. Open it.
        if (!win.isOpen) {
            openWindow(id);
            return;
        }

        // Case 2: App is minimized. Un-minimize and focus it.
        if (win.isMinimized) {
            focusWindow(id);
            return;
        }
        
        // Case 3 & 4: App is open and not minimized.
        // Check if it's the top-most window.
        const maxZIndex = Math.max(0, ...Object.values(windows)
            .filter(w => w.isOpen && !w.isMinimized)
            .map(w => w.zIndex));
        
        const isTopWindow = win.zIndex === maxZIndex;

        if (isTopWindow) {
            // If it's already on top, minimize it.
            toggleMinimize(id);
        } else {
            // If it's in the background, focus it.
            focusWindow(id);
        }
    };

    const positionClasses = {
        bottom: "bottom-4 left-1/2 -translate-x-1/2 flex-row",
        left: "left-4 top-1/2 -translate-y-1/2 flex-col",
        right: "right-4 top-1/2 -translate-y-1/2 flex-col",
    };

    const animationVariants = {
        bottom: { initial: { y: 60, opacity: 0 }, animate: { y: 0, opacity: 1 } },
        left: { initial: { x: -60, opacity: 0 }, animate: { x: 0, opacity: 1 } },
        right: { initial: { x: 60, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    };
    
    const tooltipPositionClasses = {
        bottom: "bottom-full mb-4",
        left: "left-full ml-4",
        right: "right-full mr-4",
    }

    return (
        <div className={`fixed flex items-center justify-center z-[1000] ${positionClasses[dockPosition]}`}>
            <motion.div
                initial={animationVariants[dockPosition].initial}
                animate={animationVariants[dockPosition].animate}
                transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 2.5 }}
                className={`flex items-center justify-center gap-2 ${dockPosition !== 'bottom' ? 'flex-col' : 'flex-row'} bg-stone-200/50 dark:bg-stone-800/50 backdrop-blur-lg p-2 rounded-xl border border-stone-300/50 dark:border-stone-700/50 shadow-lg`}
            >
                {DOCK_APPS.map((app) => (
                    <div key={app.id} className="relative flex flex-col items-center group">
                        <span className={`absolute text-xs whitespace-nowrap bg-stone-800 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${tooltipPositionClasses[dockPosition]}`}>{app.title}</span>
                        <motion.button
                            onClick={() => handleIconClick(app.id)}
                            aria-label={`Open ${app.title}`}
                            whileHover={{ scale: 1.2, y: dockPosition === 'bottom' ? -8 : 0, x: dockPosition === 'left' ? 8 : (dockPosition === 'right' ? -8 : 0) }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="w-12 h-12 bg-stone-300/70 dark:bg-stone-700/70 rounded-lg flex items-center justify-center transition-colors hover:bg-stone-400 dark:hover:bg-stone-600"
                        >
                            <app.icon className="w-7 h-7 text-stone-800 dark:text-stone-200" />
                        </motion.button>
                        
                        <AnimatePresence>
                        {windows[app.id]?.isOpen && (
                             <motion.div
                                layoutId={`dot-${app.id}`}
                                className={`absolute 
                                    ${dockPosition === 'bottom' ? 'bottom-[-5px]' : ''}
                                    ${dockPosition === 'left' ? 'left-[-5px]' : ''}
                                    ${dockPosition === 'right' ? 'right-[-5px]' : ''}
                                `}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                           >
                            <div className={`w-2 h-2 rounded-full ${windows[app.id].isMinimized ? 'border-2 border-amber-500' : 'bg-amber-500'}`} />
                           </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Dock;