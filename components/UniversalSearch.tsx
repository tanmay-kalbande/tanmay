import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, CornerDownLeft, FileText, Download, ExternalLink, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { SearchResultItem } from '../types';
import { APPS } from '../constants';
import { portfolioData, caseStudies, mediumArticles } from '../data';
import { useWindowSize } from '../hooks/useWindowSize';

const UniversalSearch: React.FC = () => {
    const { setSearchOpen, openWindow, demoSearchQuery, setDemoSearchQuery } = useAppContext();
    const { isMobile } = useWindowSize();
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        // Clear the demo query when the search component is unmounted
        return () => {
            setDemoSearchQuery('');
        }
    }, [setDemoSearchQuery]);

    useEffect(() => {
        if (!demoSearchQuery.trim()) {
            setResults([]);
            return;
        }

        const lowerQuery = demoSearchQuery.toLowerCase();
        const allResults: SearchResultItem[] = [];

        // Search Apps
        APPS.filter(app => !app.hidden).forEach(app => {
            if (app.title.toLowerCase().includes(lowerQuery)) {
                allResults.push({
                    id: `app-${app.id}`,
                    type: 'app',
                    title: app.title,
                    icon: app.icon,
                    action: () => {
                        openWindow(app.id);
                        setSearchOpen(false);
                    },
                });
            }
        });

        // Search Projects
        portfolioData.projects.forEach(project => {
            if (project.title.toLowerCase().includes(lowerQuery)) {
                allResults.push({
                    id: `project-${project.title}`,
                    type: 'project',
                    title: project.title,
                    icon: APPS.find(a => a.id === 'projects')!.icon,
                    action: () => {
                        openWindow('projects');
                        setSearchOpen(false);
                    },
                });
            }
        });
        
        // Search Case Studies
        caseStudies.forEach(caseStudy => {
            if (caseStudy.title.toLowerCase().includes(lowerQuery)) {
                allResults.push({
                    id: `caseStudy-${caseStudy.id}`,
                    type: 'caseStudy',
                    title: caseStudy.title,
                    icon: APPS.find(a => a.id === 'case_studies')!.icon,
                    action: () => {
                        openWindow('case_studies');
                        setSearchOpen(false);
                    },
                });
            }
        });
        
        // Search Medium Articles (as links)
        mediumArticles.forEach(article => {
            if (article.title.toLowerCase().includes(lowerQuery)) {
                allResults.push({
                    id: `link-${article.title}`,
                    type: 'link',
                    title: article.title,
                    icon: ExternalLink,
                    action: () => {
                        window.open(article.link, '_blank');
                        setSearchOpen(false);
                    },
                });
            }
        });

        // Search Skills
        portfolioData.skills.forEach(skill => {
            if (skill.toLowerCase().includes(lowerQuery)) {
                allResults.push({
                    id: `skill-${skill}`,
                    type: 'skill',
                    title: skill,
                    icon: APPS.find(a => a.id === 'skills_interests')!.icon,
                    action: () => {
                        openWindow('skills_interests');
                        setSearchOpen(false);
                    },
                });
            }
        });

        // Search Files
        if ('resume.pdf'.includes(lowerQuery)) {
            allResults.push({
                id: 'file-resume',
                type: 'file',
                title: 'Download Resume',
                icon: Download,
                action: () => {
                     window.open('/tanmay-resume.pdf', '_blank');
                     setSearchOpen(false);
                },
            });
        }
        if ('readme.txt'.includes(lowerQuery)) {
            allResults.push({
                id: 'file-readme',
                type: 'file',
                title: 'README.txt',
                icon: FileText,
                action: () => {
                    openWindow('reader');
                    setSearchOpen(false);
                },
            });
        }
        

        setResults(allResults.slice(0, 7)); // Limit results to 7 for better UI
        setSelectedIndex(0);
    }, [demoSearchQuery, openWindow, setSearchOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % (results.length || 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
            } else if (e.key === 'Enter' && results.length > 0) {
                e.preventDefault();
                results[selectedIndex]?.action();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [results, selectedIndex, setSearchOpen]);
    
    useEffect(() => {
        resultsRef.current?.children[selectedIndex]?.scrollIntoView({
            block: 'nearest',
        });
    }, [selectedIndex]);

    const handleResultClick = (result: SearchResultItem) => {
        result.action();
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[5000] flex items-start justify-center pt-[15vh] md:pt-[15vh] px-4" onClick={() => setSearchOpen(false)}>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full ${isMobile ? 'max-w-md' : 'max-w-2xl'} bg-stone-100/80 dark:bg-stone-900/80 backdrop-blur-2xl rounded-xl shadow-2xl border border-stone-300/50 dark:border-stone-700/50 overflow-hidden`}
            >
                <div className="flex items-center gap-4 p-4 border-b border-stone-200 dark:border-stone-800">
                    <Search size={isMobile ? 18 : 20} className="text-stone-500 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={demoSearchQuery}
                        onChange={(e) => setDemoSearchQuery(e.target.value)}
                        placeholder="Search apps, projects, files..."
                        className={`w-full bg-transparent ${isMobile ? 'text-base' : 'text-lg'} text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none`}
                    />
                    {isMobile && (
                        <button 
                            onClick={() => setSearchOpen(false)}
                            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                        >
                            <X size={18} className="text-stone-500" />
                        </button>
                    )}
                </div>
                
                <div ref={resultsRef} className={`${isMobile ? 'max-h-[40vh]' : 'max-h-[50vh]'} overflow-y-auto`}>
                    {results.length > 0 ? (
                        <ul className="p-2">
                            {results.map((result, index) => {
                                const Icon = result.icon;
                                return (
                                <li
                                    key={result.id}
                                    onClick={() => handleResultClick(result)}
                                    className={`flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer ${selectedIndex === index ? 'bg-amber-500/20' : 'hover:bg-stone-200/50 dark:hover:bg-stone-800/50'}`}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="bg-stone-200 dark:bg-stone-800 p-2 rounded-md flex-shrink-0">
                                            <Icon size={isMobile ? 16 : 18} className="text-stone-600 dark:text-stone-300" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className={`font-semibold text-stone-800 dark:text-stone-200 truncate ${isMobile ? 'text-sm' : 'text-base'}`}>{result.title}</p>
                                            <p className="text-xs text-stone-500 dark:text-stone-400 capitalize">{result.type}</p>
                                        </div>
                                    </div>
                                    {selectedIndex === index && !isMobile && <CornerDownLeft size={16} className="text-stone-500 flex-shrink-0" />}
                                </li>
                                )
                            })}
                        </ul>
                    ) : (
                        demoSearchQuery.trim() && (
                            <div className={`${isMobile ? 'p-6' : 'p-8'} text-center text-stone-500`}>
                                <p className={isMobile ? 'text-sm' : 'text-base'}>No results found for "{demoSearchQuery}"</p>
                            </div>
                        )
                    )}
                </div>

                {results.length > 0 && !isMobile && (
                    <div className="p-2 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex items-center justify-end gap-4">
                        <span>Navigate with ↑↓</span>
                        <span>Open with ↵</span>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default UniversalSearch;
