import React from 'react';
import { Sun, Moon, Info } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { DockPosition, WallpaperID, Theme } from '../types';

const WallpaperPreview: React.FC<{ wallpaperId: WallpaperID; theme: Theme }> = ({ wallpaperId, theme }) => {
    return (
        <div className={`w-full h-10 rounded-md border border-stone-400/50 mb-2 wallpaper-${wallpaperId}-${theme}`}></div>
    );
};

const SettingsApp: React.FC = () => {
    const { theme, setTheme, dockPosition, setDockPosition, wallpaper, setWallpaper } = useAppContext();

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
    };

    const dockOptions: {id: DockPosition, label: string}[] = [
        { id: 'bottom', label: 'Bottom' },
        { id: 'right', label: 'Right' },
    ];

    const wallpaperOptions: { id: WallpaperID; label: string }[] = [
        { id: 'dots', label: 'Dots' },
        { id: 'blueprint', label: 'Blueprint' },
        { id: 'circuit', label: 'Circuit' },
        { id: 'plus', label: 'Plus' },
        { id: 'zigzag', label: 'Zigzag' },
        { id: 'woven', label: 'Woven' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white mb-6">System Settings</h2>
            
            <div className="mb-6">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3">Appearance</h3>
                <div className="p-4 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg space-y-4">
                    <div>
                        <p className="text-sm font-medium mb-2 text-stone-700 dark:text-stone-300">Theme</p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleThemeChange('light')}
                                className={`flex-1 flex items-center justify-center p-2 rounded-md text-sm transition-colors ${
                                    theme === 'light' 
                                    ? 'bg-amber-500 text-white shadow' 
                                    : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                                }`}
                            >
                                <Sun size={16} className="mr-2" />
                                Light
                            </button>
                            <button
                                onClick={() => handleThemeChange('dark')}
                                className={`flex-1 flex items-center justify-center p-2 rounded-md text-sm transition-colors ${
                                    theme === 'dark' 
                                    ? 'bg-amber-500 text-white shadow' 
                                    : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                                }`}
                            >
                                <Moon size={16} className="mr-2" />
                                Dark
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-2 text-stone-700 dark:text-stone-300">Wallpaper</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {wallpaperOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => setWallpaper(option.id)}
                                    className={`p-2 rounded-lg transition-all ${wallpaper === option.id ? 'ring-2 ring-amber-500' : 'hover:bg-stone-300/50 dark:hover:bg-stone-700/50'}`}
                                >
                                    <WallpaperPreview wallpaperId={option.id} theme={theme} />
                                    <span className="text-xs text-stone-700 dark:text-stone-300">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3">Dock Position</h3>
                <div className="p-4 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg">
                    <div className="flex space-x-2">
                         {dockOptions.map(option => (
                             <button
                                key={option.id}
                                onClick={() => setDockPosition(option.id)}
                                className={`flex-1 p-2 rounded-md text-sm transition-colors ${
                                    dockPosition === option.id 
                                    ? 'bg-amber-500 text-white shadow' 
                                    : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                                }`}
                            >
                                {option.label}
                            </button>
                         ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
                <p>Portfolio OS v1.0 by Tanmay Kalbande</p>
                <p>Inspired by modern operating systems.</p>
            </div>
        </div>
    );
};

export default SettingsApp;
