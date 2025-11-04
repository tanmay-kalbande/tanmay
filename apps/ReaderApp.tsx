import React from 'react';
import { portfolioData } from '../data';

const ReaderApp: React.FC = () => {
    return (
        <div className="h-full text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-900/50 p-4 font-mono text-sm select-text">
            <h1 className="text-xl font-bold mb-4 text-amber-600 dark:text-amber-400">README.txt</h1>
            <pre className="whitespace-pre-wrap leading-relaxed">
                {portfolioData.readme}
            </pre>
        </div>
    );
};

export default ReaderApp;