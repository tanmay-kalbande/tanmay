import React, { useState, useMemo, useEffect, useRef } from 'react';
import { VFS } from '../vfs';
import { VFSNode, VFSDirectory, VFSFile } from '../types';
import { Folder, FileText, ArrowUp, Home, FileUp, ArrowUpRightSquare, LayoutGrid, List } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { APPS } from '../constants'; // Import APPS to get icon data

const getNodeByPath = (path: string[]): VFSNode | null => {
    let currentNode: VFSNode = VFS;
    for (const part of path) {
        if (currentNode.type !== 'directory') return null;
        const children = (currentNode as VFSDirectory).children;
        if (!children[part]) return null;
        currentNode = children[part];
    }
    return currentNode;
};

const FileExplorerContextMenu: React.FC<{
    x: number;
    y: number;
    node: VFSNode;
    onClose: () => void;
    onOpen: (node: VFSNode) => void;
}> = ({ x, y, node, onClose, onOpen }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const fileNode = node.type === 'file' ? node as VFSFile : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ top: y, left: x }}
            className="fixed w-48 bg-stone-200/80 dark:bg-stone-800/80 backdrop-blur-md p-1.5 rounded-lg shadow-xl border border-stone-300/50 dark:border-stone-700/50 z-[2000]"
        >
            <ul className="text-sm text-stone-800 dark:text-stone-200">
                <li
                    onClick={() => { onOpen(node); onClose(); }}
                    className="flex items-center px-3 py-1.5 rounded-md hover:bg-stone-300/50 dark:hover:bg-stone-700/50 cursor-pointer"
                >
                    {fileNode?.isShortcut ? 'Launch App' : 'Open'}
                </li>
                {fileNode?.isLink && (
                     <li
                        onClick={() => { window.open(fileNode.content, '_blank'); onClose(); }}
                        className="flex items-center px-3 py-1.5 rounded-md hover:bg-stone-300/50 dark:hover:bg-stone-700/50 cursor-pointer"
                    >
                        Download File
                    </li>
                )}
            </ul>
        </motion.div>
    );
}

interface FileExplorerAppProps {
    initialPath?: string[];
}

const FileExplorerApp: React.FC<FileExplorerAppProps> = ({ initialPath = [] }) => {
    const [currentPath, setCurrentPath] = useState<string[]>(initialPath);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, node: VFSNode } | null>(null);
    const { openWindow, setActiveFile } = useAppContext();

    const getIconForNode = (node: VFSNode) => {
        if (node.type === 'directory') return Folder;

        const fileNode = node as VFSFile;

        // NEW: Check if it's an app shortcut and find its specific icon
        if (fileNode.isShortcut && fileNode.appId) {
            const app = APPS.find(a => a.id === fileNode.appId);
            if (app) return app.icon; // Use the app's actual icon
        }
        
        // Fallback logic for other file types
        if (fileNode.isShortcut) return ArrowUpRightSquare;
        if (fileNode.isLink) return FileUp;
        if (fileNode.name.endsWith('.md')) return FileText;
        return FileText;
    };

    const currentNode = useMemo(() => getNodeByPath(currentPath), [currentPath]);
    const currentDirectory = currentNode?.type === 'directory' ? (currentNode as VFSDirectory) : null;
    const pathString = `~/${currentPath.join('/')}`;

    const handleNodeDoubleClick = (node: VFSNode) => {
        if (node.type === 'directory') {
            const dirNode = node as VFSDirectory;
            const parent = getNodeByPath(currentPath) as VFSDirectory;
            const key = Object.keys(parent.children).find(k => parent.children[k] === dirNode);
            if (key) {
                setCurrentPath(prev => [...prev, key]);
            }
        } else {
            const fileNode = node as VFSFile;
            if (fileNode.isShortcut && fileNode.appId) {
                 openWindow(fileNode.appId);
            } else if (fileNode.isLink) {
                 window.open(fileNode.content, '_blank');
            } else {
                setActiveFile(fileNode);
                openWindow('editor', `Editor - ${fileNode.name}`);
            }
        }
    };
    
    const handleContextMenu = (e: React.MouseEvent, node: VFSNode) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, node });
    };

    const navigateUp = () => {
        if (currentPath.length > 0) {
            setCurrentPath(prev => prev.slice(0, -1));
        }
    };

    const navigateHome = () => {
        setCurrentPath([]);
    }

    const renderDirectoryTree = (dir: VFSDirectory, path: string[] = []): React.ReactNode => {
        return (
            <ul className="pl-4">
                {Object.entries(dir.children)
                    .filter(([_, node]) => node.type === 'directory')
                    .map(([key, node]) => {
                        const newPath = [...path, key];
                        const newPathStr = newPath.join('/');
                        const currentPathStr = currentPath.join('/');
                        const isActive = currentPathStr.startsWith(newPathStr);
                        
                        return (
                             <li key={key}>
                                <button
                                    onClick={() => setCurrentPath(newPath)}
                                    className={`flex items-center w-full text-left p-1 rounded-md text-sm ${currentPathStr === newPathStr ? 'bg-stone-300 dark:bg-stone-700 font-semibold' : 'hover:bg-stone-200/50 dark:hover:bg-stone-800/50'}`}
                                >
                                    <Folder size={14} className="mr-2 flex-shrink-0" />
                                    <span className="truncate">{node.name}</span>
                                </button>
                                {isActive && renderDirectoryTree(node as VFSDirectory, newPath)}
                            </li>
                        )
                    })}
            </ul>
        );
    }
    
    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200" onClick={() => setContextMenu(null)}>
            <header className="flex items-center gap-2 p-2 border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
                <button onClick={navigateUp} disabled={currentPath.length === 0} className="p-1.5 rounded-md hover:bg-stone-200/50 dark:hover:bg-stone-800/50 disabled:opacity-30">
                    <ArrowUp size={16} />
                </button>
                 <button onClick={navigateHome} className="p-1.5 rounded-md hover:bg-stone-200/50 dark:hover:bg-stone-800/50">
                    <Home size={16} />
                </button>
                <div className="flex-grow bg-stone-200 dark:bg-stone-800 p-1.5 rounded-md text-sm font-mono truncate">
                    {pathString}
                </div>
                <div className="flex items-center bg-stone-200 dark:bg-stone-800 rounded-md">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-stone-300 dark:bg-stone-700' : 'hover:bg-stone-300/50 dark:hover:bg-stone-700/50'}`}><LayoutGrid size={16} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-stone-300 dark:bg-stone-700' : 'hover:bg-stone-300/50 dark:hover:bg-stone-700/50'}`}><List size={16} /></button>
                </div>
            </header>

            <div className="flex flex-grow min-h-0">
                <aside className="w-48 flex-shrink-0 bg-stone-200/50 dark:bg-stone-800/50 p-2 border-r border-stone-200 dark:border-stone-800 overflow-y-auto">
                    <button
                        onClick={navigateHome}
                        className={`flex items-center w-full text-left p-1 rounded-md text-sm mb-2 ${currentPath.length === 0 ? 'bg-stone-300 dark:bg-stone-700 font-semibold' : 'hover:bg-stone-200/50 dark:hover:bg-stone-800/50'}`}
                    >
                        <Home size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">Home (~)</span>
                    </button>
                    {renderDirectoryTree(VFS)}
                </aside>

                <main className="flex-grow p-4 overflow-y-auto">
                    {currentDirectory ? (
                        viewMode === 'grid' ? (
                            <div className="flex flex-wrap gap-2">
                                {Object.values(currentDirectory.children).map(node => {
                                    const Icon = getIconForNode(node);
                                    return (
                                        <div
                                            key={node.name}
                                            onDoubleClick={() => handleNodeDoubleClick(node)}
                                            onContextMenu={(e) => handleContextMenu(e, node)}
                                            className="flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors hover:bg-stone-200/50 dark:hover:bg-stone-800/50 w-28 h-28 justify-center select-none"
                                        >
                                            <Icon className="w-10 h-10 mb-1 text-amber-500" />
                                            <span className="text-xs text-center truncate w-full">{node.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                             <div className="flex flex-col">
                                {Object.values(currentDirectory.children).map(node => {
                                    const Icon = getIconForNode(node);
                                    return (
                                        <div
                                            key={node.name}
                                            onDoubleClick={() => handleNodeDoubleClick(node)}
                                            onContextMenu={(e) => handleContextMenu(e, node)}
                                            className="flex items-center p-2 rounded-lg cursor-pointer transition-colors hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
                                        >
                                            <Icon className="w-6 h-6 mr-3 text-amber-500 flex-shrink-0" />
                                            <span className="text-sm truncate flex-grow">{node.name}</span>
                                            <span className="text-xs text-stone-500 dark:text-stone-400 capitalize flex-shrink-0">{node.type}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    ) : (
                        <p>Could not load directory.</p>
                    )}
                </main>
            </div>
            <AnimatePresence>
                {contextMenu && (
                    <FileExplorerContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        node={contextMenu.node}
                        onClose={() => setContextMenu(null)}
                        onOpen={handleNodeDoubleClick}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileExplorerApp;
