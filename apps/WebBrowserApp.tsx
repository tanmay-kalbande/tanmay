import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, RefreshCcw, ExternalLink, Globe } from 'lucide-react';
import { WebBrowserAppProps } from '../types';

const WebBrowserApp: React.FC<WebBrowserAppProps> = ({ initialUrl, title = 'Web Browser', initialZoom = 1 }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [currentUrl, setCurrentUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(true);
    const [canGoBack, setCanGoBack] = useState(false);
    
    // History stack for in-app navigation (basic)
    const historyStack = useRef<string[]>([initialUrl]);
    const historyIndex = useRef(0);

    const navigate = useCallback((url: string, pushToHistory = true) => {
        setIsLoading(true);
        setCurrentUrl(url);
        if (pushToHistory) {
            historyStack.current = historyStack.current.slice(0, historyIndex.current + 1);
            historyStack.current.push(url);
            historyIndex.current = historyStack.current.length - 1;
        }
        setCanGoBack(historyIndex.current > 0);
    }, []);

    useEffect(() => {
        // Initial load and handle URL changes
        navigate(initialUrl, true);
    }, [initialUrl, navigate]);

    const handleLoad = () => {
        setIsLoading(false);
        // Attempt to get the actual URL after load, might be blocked by same-origin policy
        try {
            if (iframeRef.current?.contentWindow?.location.href) {
                const actualUrl = iframeRef.current.contentWindow.location.href;
                if (actualUrl !== currentUrl) {
                    // If iframe navigated internally, update currentUrl without pushing to history
                    setCurrentUrl(actualUrl);
                }
            }
        } catch (e) {
            // console.warn("Could not access iframe contentWindow.location.href:", e);
            // This is expected for cross-origin iframes unless allow-same-origin is set,
            // but even then, full access might be restricted by other sandbox rules.
        }
    };

    const handleGoBack = () => {
        if (historyIndex.current > 0) {
            historyIndex.current--;
            navigate(historyStack.current[historyIndex.current], false); // Don't push to history again
        }
    };

    const handleRefresh = () => {
        if (iframeRef.current) {
            setIsLoading(true);
            iframeRef.current.src = currentUrl; // Re-assign src to refresh
        }
    };

    const handleOpenExternal = () => {
        window.open(currentUrl, '_blank');
    };

    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
            <header className="flex-shrink-0 p-2 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2">
                <button
                    onClick={handleGoBack}
                    disabled={!canGoBack}
                    className="p-2 rounded-md hover:bg-stone-200/50 dark:hover:bg-stone-800/50 disabled:opacity-30"
                    aria-label="Go back"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    onClick={handleRefresh}
                    className="p-2 rounded-md hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
                    aria-label="Refresh page"
                >
                    <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <div className="flex-grow bg-stone-200 dark:bg-stone-800 p-1.5 rounded-md text-sm font-mono truncate flex items-center gap-2">
                    <Globe size={14} className="text-stone-500 flex-shrink-0"/>
                    <span className="truncate">{currentUrl}</span>
                </div>
                <button
                    onClick={handleOpenExternal}
                    className="p-2 rounded-md hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
                    aria-label="Open in new browser tab"
                >
                    <ExternalLink size={16} />
                </button>
            </header>

            <main className="flex-grow relative overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-100 dark:bg-stone-900 z-10">
                        <RefreshCcw className="animate-spin text-amber-500" size={32} />
                        <p className="ml-4 text-stone-500">Loading {title}...</p>
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    src={currentUrl}
                    onLoad={handleLoad}
                    onError={() => {
                        setIsLoading(false);
                    }}
                    title={title}
                    className="absolute top-0 left-0 border-none bg-white dark:bg-stone-950"
                    style={{
                        width: `${100 / initialZoom}%`,
                        height: `${100 / initialZoom}%`,
                        transform: `scale(${initialZoom})`,
                        transformOrigin: '0 0',
                    }}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation allow-downloads"
                ></iframe>
            </main>
        </div>
    );
};

export default WebBrowserApp;