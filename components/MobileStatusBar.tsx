import React from 'react';
import { motion } from 'framer-motion';
import { Aperture, Search } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const MobileStatusBar: React.FC = () => {
    const { openWindow, setSearchOpen } = useAppContext();

    return (
        <div className="fixed top-0 left-0 right-0 z-[2000] flex items-center justify-center pt-2 px-4 pointer-events-none">
            <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
                className="flex items-center justify-between gap-2 backdrop-blur-xl px-2.5 py-1.5 rounded-full shadow-lg border border-stone-700/60 bg-stone-900/80 w-auto pointer-events-auto"
            >
                {/* Left side: Branding and "About Me" button */}
                <button
                    onClick={() => openWindow('about')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 py-1 px-2 rounded-full hover:bg-stone-800/50 active:bg-stone-700/50 transition-colors"
                    aria-label="About Tanmay Kalbande"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                    >
                        <Aperture size={16} className="text-amber-500 flex-shrink-0" />
                    </motion.div>
                    <span className="whitespace-nowrap">Tanmay | Portfolio OS</span>
                </button>

                {/* Right side: Functional Search Button */}
                <button
                    onClick={() => setSearchOpen(true)}
                    className="p-1.5 rounded-full transition-all duration-150 hover:bg-stone-800/50 active:bg-stone-700/50 active:scale-95 flex-shrink-0"
                    aria-label="Open Search"
                >
                    <Search size={16} className="text-stone-300" />
                </button>
            </motion.div>
        </div>
    );
};

export default MobileStatusBar;
