import React from 'react';
import { portfolioData } from '../data';
import { Project } from '../types';
import { FolderGit2, ExternalLink, Github, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWindowManager } from '../hooks/useWindowManager';

const ProjectCard: React.FC<{
    project: Project;
}> = ({ project }) => {
    const { openWindow } = useWindowManager();

    const handleExternalLinkClick = (e: React.MouseEvent, url: string) => {
        e.stopPropagation();
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    
    const handleLiveDemoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (project.links.live) {
            openWindow('web_browser', `Live Demo: ${project.title}`, { initialUrl: project.links.live, initialZoom: 0.75 });
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg border border-stone-300/50 dark:border-stone-700/50 transition-all duration-200 hover:border-amber-500/50 hover:shadow-lg"
            aria-label={`Project: ${project.title}`}
        >
            <div className="flex items-start mb-3">
                <span className="text-3xl mr-3 leading-none flex-shrink-0">{project.icon}</span>
                <div className="flex-grow">
                    <div className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 w-fit mb-1">
                        {project.category}
                    </div>
                    <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 leading-tight">{project.title}</h3>
                </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 flex-grow line-clamp-3 select-text">
                {project.description}
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t border-stone-300/50 dark:border-stone-700/50">
                {project.links.live && (
                    <button
                        onClick={handleLiveDemoClick}
                        className="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        <Globe size={14} className="mr-1" /> Live Demo
                    </button>
                )}
                {project.links.github && (
                    <button
                        onClick={(e) => handleExternalLinkClick(e, project.links.github!)}
                        className="inline-flex items-center px-3 py-1.5 bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg hover:bg-stone-400 dark:hover:bg-stone-600 transition-colors"
                        aria-label="GitHub Repository"
                    >
                        <Github size={14} className="mr-1" /> GitHub
                    </button>
                )}
                {project.links.website && (
                    <button
                        onClick={(e) => handleExternalLinkClick(e, project.links.website!)}
                        className="inline-flex items-center px-3 py-1.5 bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg hover:bg-stone-400 dark:hover:bg-stone-600 transition-colors"
                        aria-label="Project Website"
                    >
                        <ExternalLink size={14} className="mr-1" /> Website
                    </button>
                )}
                 {project.links.instagram && (
                    <button
                        onClick={(e) => handleExternalLinkClick(e, project.links.instagram!)}
                        className="inline-flex items-center px-3 py-1.5 bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg hover:bg-stone-400 dark:hover:bg-stone-600 transition-colors"
                        aria-label="Instagram Link"
                    >
                        <ExternalLink size={14} className="mr-1" /> Instagram
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const ProjectsApp: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900 p-4">
            <header className="mb-4 flex-shrink-0">
                <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                    <FolderGit2 className="text-amber-500" />
                    Projects
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">Explore my work. Live demos open in the in-app web browser.</p>
            </header>
            <main className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-start">
                    {portfolioData.projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ProjectsApp;