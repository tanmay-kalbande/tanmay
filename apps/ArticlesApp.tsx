import React from 'react';
import { mediumArticles } from '../data';
import { portfolioData } from '../data';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';

const ArticleCard: React.FC<{ article: typeof mediumArticles[0] }> = ({ article }) => (
    <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg border border-stone-300/50 dark:border-stone-700/50 cursor-pointer hover:border-amber-500/50 hover:shadow-lg transition-all group"
    >
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{article.title}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">{article.date}</p>
            </div>
            <ExternalLink size={18} className="text-stone-400 dark:text-stone-500 group-hover:text-amber-500 transition-colors flex-shrink-0 ml-4 mt-1" />
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400">{article.snippet}</p>
    </a>
);


const ArticlesApp: React.FC = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full bg-stone-100 dark:bg-stone-900 p-4 select-text"
        >
            <header className="mb-6">
                <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="text-amber-500" />
                    My Articles
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">A collection of my thoughts and writings on data science, AI, and technology.</p>
                 <a 
                    href={portfolioData.contact.medium}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-stone-800 text-white dark:bg-stone-200 dark:text-black text-xs font-semibold rounded-lg hover:bg-stone-950 dark:hover:bg-white transition-colors"
                >
                    View All on Medium <ExternalLink size={14} />
                </a>
            </header>
            <main className="space-y-4">
                {mediumArticles.map(article => (
                    <ArticleCard key={article.title} article={article} />
                ))}
            </main>
        </motion.div>
    );
};

export default ArticlesApp;