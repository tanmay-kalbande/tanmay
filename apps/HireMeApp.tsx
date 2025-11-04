import React from 'react';
import { portfolioData } from '../data';
import { BarChart, BrainCircuit, Award, Download, FolderGit2 } from 'lucide-react';
import { useWindowManager } from '../hooks/useWindowManager';

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string }> = ({ icon, value, label }) => (
    <div className="flex items-center p-4 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg">
        <div className="text-amber-500 mr-4">{icon}</div>
        <div>
            <p className="text-2xl font-bold text-stone-900 dark:text-white">{value}</p>
            <p className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

const HireMeApp: React.FC = () => {
    const { openWindow } = useWindowManager();

    return (
        <div className="h-full p-6 text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-900 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white mb-2">
                Tanmay Kalbande: Data Science Specialist
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-xl">
                I transform raw data into actionable insights using Machine Learning, AI, and Python.
                Here's a quick overview of my qualifications.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
                <StatCard icon={<BarChart size={32} />} value={`${portfolioData.stats.experience} Yrs`} label="Experience" />
                <StatCard icon={<BrainCircuit size={32} />} value={portfolioData.stats.projects} label="ML Projects" />
                <StatCard icon={<Award size={32} />} value={portfolioData.stats.certifications} label="Certifications" />
            </div>
            
            <p className="text-stone-600 dark:text-stone-400 mb-6">Ready to see more?</p>

            <div className="flex flex-col sm:flex-row gap-4">
                 <a 
                    href="/tanmay-resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-all duration-200"
                >
                    <Download size={18} className="mr-2" />
                    Download Resume
                </a>
                 <button 
                    onClick={() => openWindow('projects')}
                    className="flex items-center justify-center px-6 py-3 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold rounded-lg shadow-md hover:bg-stone-300 dark:hover:bg-stone-700 transition-all duration-200"
                >
                    <FolderGit2 size={18} className="mr-2" />
                    Explore Projects
                </button>
            </div>
        </div>
    );
};

export default HireMeApp;