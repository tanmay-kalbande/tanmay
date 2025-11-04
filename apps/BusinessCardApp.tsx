import React from 'react';
import { portfolioData } from '../data';
import { Mail, Phone, Linkedin, Github, Globe, QrCode } from 'lucide-react';

const BusinessCardApp: React.FC = () => {
    const { name, title, contact } = portfolioData;

    return (
        <div className="h-full w-full flex items-center justify-center bg-stone-100 dark:bg-stone-900 select-none p-4">
            <div className="w-full max-w-md md:max-w-[450px] bg-gradient-to-br from-stone-50 to-stone-200 dark:from-stone-800 dark:to-stone-900 rounded-2xl shadow-2xl flex flex-col md:flex-row p-6 transition-all duration-300 ease-in-out hover:shadow-amber-500/20 hover:scale-[1.02] aspect-auto md:aspect-[450/250]">
                {/* Left Side */}
                <div className="flex flex-col justify-between items-center w-full md:w-2/5 pb-6 md:pb-0 md:pr-4 border-b md:border-b-0 md:border-r border-stone-300 dark:border-stone-700">
                    <div className="text-center">
                        <img src="https://cdn.jsdelivr.net/gh/continentalstorage888-ops/didactic-meme@main/portfolio%201.png" alt={name} className="w-24 h-24 rounded-full object-cover mx-auto shadow-lg ring-2 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-800 ring-amber-500" />
                        <h1 className="text-xl font-bold text-stone-900 dark:text-white mt-3 whitespace-nowrap">{name}</h1>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{title}</p>
                    </div>
                    <div className="text-stone-500 dark:text-stone-400 mt-4 md:mt-0">
                         <QrCode size={40} />
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-3/5 pt-6 md:pt-0 md:pl-6 flex flex-col justify-center text-sm text-stone-700 dark:text-stone-300 space-y-3">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 group">
                        <Mail size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:text-amber-500 transition-colors break-all">{contact.email}</span>
                    </a>
                    <div className="flex items-center gap-2 group">
                        <Phone size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                        <span>{contact.phone}</span>
                    </div>
                     <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                        <Linkedin size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:text-amber-500 transition-colors">linkedin.com/in/tanmay-kalbande</span>
                    </a>
                     <a href={contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                        <Github size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:text-amber-500 transition-colors">github.com/tanmay-kalbande</span>
                    </a>
                    <a href="https://tanmay-kalbande-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                        <Globe size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:text-amber-500 transition-colors">Portfolio Website</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BusinessCardApp;