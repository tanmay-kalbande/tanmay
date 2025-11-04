import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const EditorApp: React.FC = () => {
    const { activeFile } = useAppContext();

    if (!activeFile) {
        return (
            <div className="h-full flex items-center justify-center bg-stone-100 dark:bg-stone-900 text-stone-500">
                <p>No file open.</p>
            </div>
        );
    }
    
    const isMarkdown = activeFile.name.endsWith('.md');

    return (
        <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200">
            {isMarkdown ? (
                 <main className="flex-grow p-6 overflow-y-auto select-text">
                     <div className="prose prose-stone dark:prose-invert max-w-none">
                         <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                a: ({...props}) => <a {...props} className="text-amber-500 hover:underline" target="_blank" rel="noopener noreferrer" />,
                                h1: ({...props}) => <h1 {...props} className="text-3xl font-extrabold text-stone-900 dark:text-white mb-4 border-b border-stone-300 dark:border-stone-700 pb-2" />,
                                h3: ({...props}) => <h3 {...props} className="text-xl font-bold mt-6 mb-3" />,
                                ul: ({...props}) => <ul {...props} className="list-disc list-inside my-4 space-y-2" />,
                                code: ({ inline, className, children, ...props }) => {
                                    return !inline ? (
                                        <pre className="bg-stone-200 dark:bg-stone-800 rounded p-3 my-4 text-sm overflow-x-auto"><code className={className} {...props}>{children}</code></pre>
                                    ) : (
                                        <code className="bg-stone-200 dark:bg-stone-800 rounded-sm px-1.5 py-1 font-mono text-sm" {...props}>{children}</code>
                                    )
                                },
                                p: ({...props}) => <p {...props} className="mb-4 leading-relaxed" />,
                            }}
                        >
                            {activeFile.content}
                        </ReactMarkdown>
                     </div>
                </main>
            ) : (
                <pre className="w-full h-full p-4 font-mono text-sm overflow-auto select-text">
                    {activeFile.content}
                </pre>
            )}
        </div>
    );
};

export default EditorApp;