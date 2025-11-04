import React from 'react';
import { portfolioData } from '../data';
import { Award, Code, Lightbulb, Briefcase, ListChecks } from 'lucide-react';

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-6">
        <h3 className="flex items-center text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        {children}
    </div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
        {children}
    </span>
);

const AboutApp: React.FC = () => {
    return (
        <div className="text-stone-700 dark:text-stone-300 leading-relaxed select-text">
            <div className="flex flex-col md:flex-row items-start mb-6">
                <img src="https://cdn.jsdelivr.net/gh/continentalstorage888-ops/didactic-meme@main/portfolio%201.png" alt="Tanmay Kalbande" className="w-24 h-24 rounded-full object-cover mr-6 mb-4 md:mb-0 flex-shrink-0 shadow-md ring-2 ring-offset-2 ring-offset-stone-100 dark:ring-offset-stone-900 ring-amber-500" />
                <div>
                    <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white">{portfolioData.name}</h2>
                    <p className="text-md text-amber-600 dark:text-amber-400 font-semibold">{portfolioData.title}</p>
                    <p className="mt-2 text-sm">{portfolioData.about}</p>
                </div>
            </div>
            
            <Section title="Technical Summary" icon={<ListChecks className="text-amber-500" />}>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    {portfolioData.technicalSummary.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </Section>

            <Section title="Experience" icon={<Briefcase className="text-amber-500" />}>
                <div className="space-y-4">
                    {portfolioData.experience.map((exp, index) => (
                        <div key={index} className="text-sm">
                            <h4 className="font-bold text-stone-800 dark:text-stone-100">{exp.role} @ {exp.company}</h4>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{exp.duration}</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                {exp.duties.map((duty, i) => <li key={i}>{duty}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Skills" icon={<Code className="text-amber-500" />}>
                <div className="flex flex-wrap">
                    {portfolioData.skills.map(skill => <Tag key={skill}>{skill}</Tag>)}
                </div>
            </Section>

            <Section title="Interests" icon={<Lightbulb className="text-amber-500" />}>
                 <div className="flex flex-wrap">
                    {portfolioData.interests.map(interest => <Tag key={interest}>{interest}</Tag>)}
                </div>
            </Section>
            
            <Section title="Certifications" icon={<Award className="text-amber-500" />}>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    {portfolioData.certifications.map((cert, index) => (
                        <li key={index}>
                            <span className="font-semibold">{cert.name}</span> - {cert.issuer} ({cert.date})
                        </li>
                    ))}
                </ul>
            </Section>
        </div>
    );
};

export default AboutApp;
