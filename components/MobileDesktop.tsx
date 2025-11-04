import React, { useState, useEffect } from 'react';
import { AppID } from '../types';
import { useWindowManager } from '../hooks/useWindowManager';
import { APPS, MOBILE_DESKTOP_APPS } from '../constants';
import type { LucideProps } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const DesktopItem: React.FC<{
    id: AppID;
    title: string;
    icon: React.ComponentType<LucideProps>;
    onOpen: (id: AppID) => void;
}> = ({ id, title, icon: Icon, onOpen }) => {
    return (
        <div
            className="flex flex-col items-center justify-center text-center w-20 h-20 p-2 rounded-lg cursor-pointer transition-colors duration-200 active:bg-black/20 select-none"
            onClick={() => onOpen(id)}
            tabIndex={0}
            aria-label={`Open ${title}`}
        >
            <Icon className="w-10 h-10 mb-2 drop-shadow-lg text-white" />
            <span className="text-xs font-medium w-full truncate text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.7)]">{title}</span>
        </div>
    );
}

const MobileDesktop: React.FC = () => {
    const { openWindow } = useWindowManager();
    const [time, setTime] = useState(new Date());
    const desktopItems = APPS.filter(app => MOBILE_DESKTOP_APPS.includes(app.id));

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const getGreeting = () => {
        const hour = time.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="absolute inset-0 w-full h-full pt-16 pb-20 overflow-y-auto">
            {/* Greeting and Time Display */}
            <div className="px-4 py-8 text-center">
                <p className="text-xl font-semibold text-white/90 drop-shadow-lg mb-1">
                    {getGreeting()}
                </p>
                <p className="text-5xl font-bold text-white drop-shadow-2xl">
                    {formatTime(time)}
                </p>
                <p className="text-base text-white/80 drop-shadow-lg mt-1">
                    {time.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </p>
            </div>
            
            <div className="px-4 flex flex-wrap gap-2 justify-start">
                 {desktopItems.map((item) => (
                    <DesktopItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        icon={item.icon}
                        onOpen={openWindow}
                    />
                ))}
            </div>
        </div>
    );
};

export default MobileDesktop;
