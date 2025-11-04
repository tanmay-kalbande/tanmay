import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const { theme } = useAppContext();

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const formatDateTime = (date: Date) => {
        // e.g. "Mon, Jun 10, 9:41 PM" -> "Mon Jun 10 9:41 PM"
        return date.toLocaleTimeString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).replace(/,/g, '');
    };

    const textClasses = theme === 'dark' ? 'text-stone-200' : 'text-stone-800';

    return (
        <div className={`text-right ${textClasses} text-sm font-medium`}>
            <p>
                {formatDateTime(time)}
            </p>
        </div>
    );
};

export default Clock;