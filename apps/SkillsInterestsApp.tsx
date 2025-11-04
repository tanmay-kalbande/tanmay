import React from 'react';
import { portfolioData } from '../data';
import { Code, Database, BarChart2, Monitor, Lightbulb, BrainCircuit, Languages, Beaker } from 'lucide-react';

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-8">
        <h3 className="flex items-center text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        {children}
    </div>
);

const SkillCategory: React.FC<{ title: string; skills: string[]; icon: React.ReactNode }> = ({ title, skills, icon }) => (
    <div className="bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg">
        <h4 className="flex items-center text-md font-semibold mb-3 text-stone-700 dark:text-stone-200">
            {icon}
            <span className="ml-2">{title}</span>
        </h4>
        <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
                <span key={skill} className="bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium px-2.5 py-1 rounded-full">
                    {skill}
                </span>
            ))}
        </div>
    </div>
);


const SkillsInterestsApp: React.FC = () => {
    const { tools, interests } = portfolioData;

    return (
        <div className="h-full bg-stone-100 dark:bg-stone-900 p-6">
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white mb-6">Skills & Interests</h2>
            
            <Section title="Technical Skills" icon={<BrainCircuit className="text-amber-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SkillCategory title="Languages" skills={tools.languages} icon={<Languages size={16} />} />
                    <SkillCategory title="Databases" skills={tools.databases} icon={<Database size={16} />} />
                    <SkillCategory title="IDEs & Notebooks" skills={tools.ides} icon={<Monitor size={16} />} />
                    <SkillCategory title="BI Tools" skills={tools.bi} icon={<BarChart2 size={16} />} />
                </div>
            </Section>

            <Section title="Areas of Interest" icon={<Lightbulb className="text-amber-500" />}>
                 <div className="flex flex-wrap gap-3">
                    {interests.map(interest => (
                         <div key={interest} className="flex items-center bg-stone-200/50 dark:bg-stone-800/50 p-3 rounded-lg">
                             <Beaker size={16} className="text-amber-500 mr-2" />
                             <span className="text-sm font-medium text-stone-800 dark:text-stone-200">{interest}</span>
                         </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default SkillsInterestsApp;
