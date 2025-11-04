import React from 'react';
import { secretProjects } from '../data';
import { Lightbulb } from 'lucide-react';

const ProjectCard: React.FC<{ project: { icon: string; title: string; description: string } }> = ({ project }) => (
    <div className="bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg border border-stone-300/50 dark:border-stone-700/50">
        <div className="flex items-start">
            <span className="text-2xl mr-4 mt-1">{project.icon}</span>
            <div>
                <h4 className="font-bold text-stone-800 dark:text-stone-100">{project.title}</h4>
                <p className="text-sm text-stone-600 dark:text-stone-400">{project.description}</p>
            </div>
        </div>
    </div>
);

const SecretProjectsApp: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900 p-4">
             <header className="mb-4">
                <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                    <Lightbulb className="text-amber-500" />
                    Secret Projects & Ideas
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">A peek into my experimental and conceptual work.</p>
             </header>
             <main className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {secretProjects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
             </main>
        </div>
    );
};

export default SecretProjectsApp;