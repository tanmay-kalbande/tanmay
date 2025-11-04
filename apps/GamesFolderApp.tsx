import React from 'react';
import { useWindowManager } from '../hooks/useWindowManager';
import { AppID } from '../types';
import { APPS } from '../constants';

const GameItem: React.FC<{
    id: AppID;
    title: string;
    icon: React.ElementType;
}> = ({ id, title, icon: Icon }) => {
    const { openWindow } = useWindowManager();

    return (
        <div
            onDoubleClick={() => openWindow(id)}
            className="flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors hover:bg-stone-200/50 dark:hover:bg-stone-800/50 w-28 h-28 justify-center select-none"
            aria-label={`Open ${title}`}
        >
            <Icon className="w-12 h-12 mb-2 text-amber-500" />
            <span className="text-sm text-center font-medium text-stone-800 dark:text-stone-200 break-words w-full">{title}</span>
        </div>
    );
};

const GamesFolderApp: React.FC = () => {
    const gameApps = APPS.filter(app => ['tic_tac_toe', 'rock_paper_scissors', 'connect_four', 'guess_the_number', 'hangman'].includes(app.id));

    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900 p-4">
             <header className="mb-4">
                <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Games</h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">Double-click an icon to play.</p>
             </header>
             <main className="flex-grow overflow-y-auto">
                <div className="flex flex-wrap gap-4">
                    {gameApps.map(app => (
                        <GameItem key={app.id} id={app.id} title={app.title} icon={app.icon} />
                    ))}
                </div>
             </main>
        </div>
    );
};

export default GamesFolderApp;