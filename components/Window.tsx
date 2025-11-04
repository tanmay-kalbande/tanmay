import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, Variants, useDragControls } from 'framer-motion';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { AppID, WindowState, DockPosition } from '../types';
import { useWindowManager } from '../hooks/useWindowManager';
import { DOCK_APPS } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';

interface WindowProps {
    id: AppID;
    children: ReactNode;
    winState: WindowState;
    padding?: boolean;
}

const DOCK_APP_IDS = DOCK_APPS.map(app => app.id);

const getVariants = (position: DockPosition, isMaximized: boolean, isMobile: boolean): Variants => {
    const springTransition = { type: "spring" as const, stiffness: 400, damping: 30 };
    const easeTransition = { ease: [0.25, 1, 0.5, 1], duration: 0.4 };

    if (isMobile) {
        return {
            hidden: { y: "100%", opacity: 0.8 },
            visible: { 
                y: "0%", 
                opacity: 1, 
                transition: easeTransition,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh'
            },
            minimized: { y: "100%", opacity: 0.8, transition: { ...easeTransition, duration: 0.3 } }
        };
    }

    const desktopState = isMaximized 
        ? { top: '4rem', left: '2rem', width: 'calc(100vw - 4rem)', height: 'calc(100vh - 6rem)' } 
        : { top: '15%', left: '10%', width: '80vw', height: '70vh' };

    const initialState = { opacity: 0, scale: 0.8, ...desktopState };
    
    let minimizedState = {};
    if (position === 'right') {
        minimizedState = { opacity: 0, scale: 0.3, x: "50vw", ...desktopState };
    } else if (position === 'left') {
        minimizedState = { opacity: 0, scale: 0.3, x: "-50vw", ...desktopState };
    } else {
        minimizedState = { opacity: 0, scale: 0.3, y: "50vh", ...desktopState };
    }

    return {
        hidden: initialState,
        visible: { opacity: 1, scale: 1, transition: springTransition, ...desktopState },
        minimized: { ...minimizedState, transition: { duration: 0.2 } }
    };
};

const Window: React.FC<WindowProps> = ({ id, children, winState, padding = true }) => {
    const { closeWindow, toggleMinimize, focusWindow } = useWindowManager();
    const { dockPosition } = useAppContext();
    const { isMobile } = useWindowSize();
    const [isMaximized, setIsMaximized] = useState(false);
    const constraintsRef = useRef(null);
    const dragControls = useDragControls();
    const isDockApp = DOCK_APP_IDS.includes(id);

    useEffect(() => {
        if (isMobile) setIsMaximized(true);
    }, [isMobile]);

    const variants = getVariants(dockPosition, isMaximized, isMobile);

    const handlePointerDownHeader = (e: React.PointerEvent) => {
        e.stopPropagation();
        focusWindow(id);
        if (!isMaximized && !isMobile) {
            dragControls.start(e);
        }
    };

    return (
        <>
            <div ref={constraintsRef} className="absolute inset-0 pointer-events-none" />
            <motion.div
                drag={!isMaximized && !isMobile}
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                dragConstraints={constraintsRef}
                initial="hidden"
                exit="minimized"
                variants={variants}
                animate={winState.isMinimized ? "minimized" : "visible"}
                style={{ 
                    zIndex: winState.zIndex,
                    position: 'fixed',
                }}
                onPointerDown={() => focusWindow(id)}
                className="pointer-events-auto"
            >
                <div className={`w-full h-full bg-stone-100 dark:bg-stone-900 md:shadow-2xl md:rounded-xl flex flex-col overflow-hidden md:border border-stone-300/50 dark:border-stone-700/50`}>
                    <header 
                        onPointerDown={handlePointerDownHeader} 
                        className={`flex items-center justify-between pl-4 pr-2 py-2 bg-stone-200/50 dark:bg-stone-800/50 select-none flex-shrink-0 shadow-sm md:shadow-none ${isMaximized || isMobile ? 'cursor-default' : 'cursor-move'}`}
                    >
                        <div className="w-4" />
                        <h2 className="font-semibold text-sm text-stone-800 dark:text-stone-200 truncate flex-1 text-center">{winState.title}</h2>
                        <div className="flex items-center space-x-1">
                            {isDockApp && !isMobile && (
                                <button onClick={() => toggleMinimize(id)} className="p-1.5 rounded-full hover:bg-stone-300/50 dark:hover:bg-stone-700/50 transition-colors" aria-label="Minimize">
                                    <Minus size={14} />
                                </button>
                            )}
                            {!isMobile && (
                                <button onClick={() => setIsMaximized(!isMaximized)} className="p-1.5 rounded-full hover:bg-stone-300/50 dark:hover:bg-stone-700/50 transition-colors hidden md:block" aria-label="Maximize">
                                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                </button>
                            )}
                            <button onClick={() => closeWindow(id)} className={`p-1.5 rounded-full hover:bg-red-500/80 group transition-colors ${isMobile ? 'opacity-0' : ''}`} aria-label="Close">
                                <X size={14} className="text-stone-800 dark:text-stone-200 group-hover:text-white" />
                            </button>
                        </div>
                    </header>
                    <main 
                        className={`flex-1 ${padding ? 'p-4' : ''} overflow-y-auto overflow-x-hidden`}
                        style={isMobile ? { 
                            WebkitOverflowScrolling: 'touch',
                            paddingBottom: '6rem',
                            overscrollBehavior: 'contain'
                        } : undefined}
                    >
                        {children}
                    </main>
                </div>
            </motion.div>
        </>
    );
};

export default Window;
