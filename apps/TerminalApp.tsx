import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../data';
import { useAppContext } from '../contexts/AppContext';

const PROMPT = 'guest@tanmay.os:~$';

interface CommandResult {
    output: string[];
    sideEffects?: (() => void)[];
}

const TerminalApp: React.FC = () => {
    const [history, setHistory] = useState<string[]>(['Welcome to Portfolio OS Terminal. Type `help` for a list of commands.']);
    const [input, setInput] = useState('');
    const endOfTerminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { setShowMatrixRain, setShowConfetti, openWindow } = useAppContext();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const executeCommand = (command: string): CommandResult => {
        const [cmd, ...args] = command.toLowerCase().split(' ');

        switch (cmd) {
            case 'help':
                return {
                    output: [
                        'Available commands:',
                        '  <span class="text-cyan-400">whoami</span>    - Display my professional summary.',
                        '  <span class="text-cyan-400">skills</span>    - List my technical skills.',
                        '  <span class="text-cyan-400">projects</span>  - List my projects.',
                        '  <span class="text-cyan-400">contact</span>   - Show my contact information.',
                        '  <span class="text-cyan-400">hire_me</span>   - See a special message.',
                        '  <span class="text-cyan-400">matrix</span>    - Unleash the matrix rain! (try it!)',
                        '  <span class="text-cyan-400">hire me now</span> - Get my immediate attention! (confetti!)',
                        '  <span class="text-cyan-400">clear</span>     - Clear the terminal screen.',
                        '  <span class="text-cyan-400">help</span>      - Show this help message.',
                    ],
                };
            case 'whoami':
                return { output: [`<span class="font-bold">${portfolioData.name}</span> - ${portfolioData.title}`, '', portfolioData.about] };
            case 'skills':
                return { output: ['<span class="font-bold">Skills:</span>', ...portfolioData.skills.map(s => `- ${s}`)] };
            case 'projects':
                return { output: ['<span class="font-bold">Projects:</span>', ...portfolioData.projects.map(p => `- ${p.title} (${p.category})`)] };
            case 'contact':
                return {
                    output: [
                        '<span class="font-bold">Contact Information:</span>',
                        `  Email:    <a href="mailto:${portfolioData.contact.email}" class="text-cyan-400 underline">${portfolioData.contact.email}</a>`,
                        `  LinkedIn: <a href="${portfolioData.contact.linkedin}" target="_blank" class="text-cyan-400 underline">linkedin.com/in/tanmay-kalbande</a>`,
                        `  GitHub:   <a href="${portfolioData.contact.github}" target="_blank" class="text-cyan-400 underline">github.com/tanmay-kalbande</a>`,
                    ],
                };
            case 'hire_me':
                return {
                    output: [
                        '**********************************************',
                        '*                                            *',
                        '*   Thank you for your interest!             *',
                        '*   I am actively seeking new opportunities  *',
                        '*   in Data Science and AI. Let\'s connect!    *',
                        '*                                            *',
                        `*   <a href="mailto:${portfolioData.contact.email}" class="text-cyan-400 underline">Email Me</a> or find me on <a href="${portfolioData.contact.linkedin}" target="_blank" class="text-cyan-400 underline">LinkedIn</a>   *`,
                        '*                                            *',
                        '**********************************************',
                    ],
                };
            case 'matrix':
                return {
                    output: ['Entering the Matrix...'],
                    sideEffects: [
                        () => setShowMatrixRain(true),
                        () => setTimeout(() => setShowMatrixRain(false), 10000),
                    ],
                };
            case 'hire':
                if (args[0] === 'me' && args[1] === 'now') {
                    return {
                        output: ['<span class="text-pink-400">Hiring initiated! Get ready for amazing data solutions! 🎉</span>'],
                        sideEffects: [
                            () => setShowConfetti(true),
                            () => openWindow('hire_me'),
                            () => setTimeout(() => setShowConfetti(false), 5000),
                        ],
                    };
                }
                // Fallthrough to default if not "hire me now"
            default:
                return { output: [`<span class="text-red-400">command not found:</span> ${command}`] };
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const command = input.trim();
            const commandLower = command.toLowerCase();

            if (commandLower === 'clear') {
                setHistory([]);
                setInput('');
                return;
            }

            const newHistory = [...history, `<span class="text-green-500 font-bold">${PROMPT}</span> ${command}`];
            let commandResult: CommandResult = { output: [] };

            if (command) {
                commandResult = executeCommand(command);
                newHistory.push(...commandResult.output.map(line => line || ' '));
            }

            setHistory(newHistory);
            setInput('');

            commandResult.sideEffects?.forEach(effect => effect());
        }
    };
    
    useEffect(() => {
        endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Auto-focus on mount and when clicking terminal
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div 
            className="h-full bg-black text-green-400 font-mono text-sm flex flex-col overflow-hidden select-none" 
            onClick={handleTerminalClick}
        >
            <div className="flex-grow overflow-y-auto p-3 select-text">
                {history.map((line, index) => (
                    <p key={index} className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: line }} />
                ))}
                <div ref={endOfTerminalRef} />
            </div>
            <div className="flex items-center p-3 pt-0 flex-shrink-0 border-t border-green-900/30">
                <span className="text-green-500 font-bold flex-shrink-0">{PROMPT}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    className="flex-grow bg-transparent border-none outline-none text-green-400 ml-2 caret-green-400"
                    autoFocus
                    spellCheck="false"
                />
                <span className="bg-green-400 w-2 h-4 animate-pulse ml-1"></span>
            </div>
        </div>
    );
};

export default TerminalApp;
