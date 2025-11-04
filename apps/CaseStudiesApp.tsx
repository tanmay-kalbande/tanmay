import React, { useState } from 'react';
import { caseStudies } from '../data';
import { CaseStudy } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FilePieChart } from 'lucide-react';

const CaseStudyCard: React.FC<{ caseStudy: CaseStudy; onRead: () => void }> = ({ caseStudy, onRead }) => (
    <motion.div
        layoutId={`case-study-card-${caseStudy.id}`}
        onClick={onRead}
        className="bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg border border-stone-300/50 dark:border-stone-700/50 cursor-pointer hover:border-amber-500/50 hover:shadow-lg transition-all"
    >
        <motion.h3 layoutId={`case-study-title-${caseStudy.id}`} className="font-bold text-lg text-stone-800 dark:text-stone-100">{caseStudy.title}</motion.h3>
        <motion.p layoutId={`case-study-date-${caseStudy.id}`} className="text-xs text-stone-500 dark:text-stone-400 mb-2">{caseStudy.date}</motion.p>
        <motion.p layoutId={`case-study-snippet-${caseStudy.id}`} className="text-sm text-stone-600 dark:text-stone-400">{caseStudy.snippet}</motion.p>
    </motion.div>
);

const CaseStudyView: React.FC<{ caseStudy: CaseStudy; onBack: () => void }> = ({ caseStudy, onBack }) => (
     <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-full flex flex-col bg-stone-100 dark:bg-stone-900"
    >
        <header className="p-4 border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
            <button onClick={onBack} className="flex items-center text-sm text-amber-600 dark:text-amber-400 hover:underline mb-4">
                <ArrowLeft size={16} className="mr-1" /> Back to Case Studies
            </button>
            <motion.h2 layoutId={`case-study-title-${caseStudy.id}`} className="text-2xl font-extrabold text-stone-900 dark:text-white">{caseStudy.title}</motion.h2>
            <motion.p layoutId={`case-study-date-${caseStudy.id}`} className="text-sm text-stone-500 dark:text-stone-400">{caseStudy.subtitle} &middot; {caseStudy.date}</motion.p>
        </header>
        <main className="flex-grow p-6 overflow-y-auto select-text">
             <div className="prose prose-stone dark:prose-invert max-w-none">
                 <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        a: ({...props}) => <a {...props} className="text-amber-500 hover:underline" target="_blank" rel="noopener noreferrer" />,
                        h3: ({...props}) => <h3 {...props} className="text-xl font-bold mt-8 mb-4 border-b border-stone-300 dark:border-stone-700 pb-2" />,
                        ul: ({...props}) => <ul {...props} className="list-disc list-inside my-4 space-y-2" />,
                        ol: ({...props}) => <ol {...props} className="list-decimal list-inside my-4 space-y-2" />,
                        code: ({ inline, className, children, ...props }) => {
                            return !inline ? (
                                <pre className="bg-stone-200 dark:bg-stone-800 rounded p-3 my-4 text-sm overflow-x-auto"><code className={className} {...props}>{children}</code></pre>
                            ) : (
                                <code className="bg-stone-200 dark:bg-stone-800 rounded-sm px-1.5 py-1 font-mono text-sm" {...props}>{children}</code>
                            )
                        },
                        p: ({...props}) => <p {...props} className="mb-4 leading-relaxed" />,
                        blockquote: ({...props}) => <blockquote {...props} className="border-l-4 border-amber-500 pl-4 italic text-stone-600 dark:text-stone-400 my-4" />,
                        img: ({...props}) => <img {...props} className="rounded-lg shadow-md" />,
                    }}
                >
                    {caseStudy.content}
                </ReactMarkdown>
             </div>
        </main>
    </motion.div>
);


const CaseStudiesApp: React.FC = () => {
    const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string | null>(null);
    const selectedCaseStudy = caseStudies.find(a => a.id === selectedCaseStudyId);

    return (
        <AnimatePresence>
            {selectedCaseStudy ? (
                <CaseStudyView key={selectedCaseStudy.id} caseStudy={selectedCaseStudy} onBack={() => setSelectedCaseStudyId(null)} />
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full bg-stone-100 dark:bg-stone-900 p-4 select-text"
                >
                    <header className="mb-4">
                        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                            <FilePieChart className="text-amber-500" />
                            Case Studies
                        </h2>
                        <p className="text-sm text-stone-600 dark:text-stone-400">A detailed breakdown of key projects, from problem to impact.</p>
                    </header>
                    <main className="space-y-4">
                        {caseStudies.map(caseStudy => (
                            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} onRead={() => setSelectedCaseStudyId(caseStudy.id)} />
                        ))}
                    </main>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CaseStudiesApp;