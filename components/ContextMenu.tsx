import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Info, RefreshCw } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
    const { theme, setTheme, toast, refreshDesktop } = useAppContext();
    const menuRef = useRef<HTMLDivElement>(null);

    const handleThemeChange = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        onClose();
    };

    const handleShowInfo = () => {
        toast('Portfolio OS v1.0 by Tanmay Kalbande', 'info');
        onClose();
    }
    
    const handleRefresh = () => {
        refreshDesktop();
        onClose();
    }

    // Adjust position if menu is off-screen
    const style: React.CSSProperties = { top: y, left: x };
    if (menuRef.current) {
        const { innerWidth, innerHeight } = window;
        const { offsetWidth, offsetHeight } = menuRef.current;
        if (x + offsetWidth > innerWidth) {
            style.left = x - offsetWidth;
        }
        if (y + offsetHeight > innerHeight) {
            style.top = y - offsetHeight;
        }
    }


    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={style}
            className="fixed w-48 bg-stone-200/80 dark:bg-stone-800/80 backdrop-blur-md p-1.5 rounded-lg shadow-xl border border-stone-300/50 dark:border-stone-700/50 z-[2000]"
        >
            <ul className="text-sm text-stone-800 dark:text-stone-200">
                <li
                    onClick={handleThemeChange}
                    className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-stone-300/50 dark:hover:bg-stone-700/50 cursor-pointer"
                >
                    <span>Change Theme</span>
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </li>
                 <li
                    onClick={handleRefresh}
                    className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-stone-300/50 dark:hover:bg-stone-700/50 cursor-pointer"
                >
                    <span>Refresh</span>
                    <RefreshCw size={16} />
                </li>
                 <li
                    onClick={handleShowInfo}
                    className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-stone-300/50 dark:hover:bg-stone-700/50 cursor-pointer"
                >
                    <span>View Info</span>
                    <Info size={16} />
                </li>
            </ul>
        </motion.div>
    );
};

export default ContextMenu;