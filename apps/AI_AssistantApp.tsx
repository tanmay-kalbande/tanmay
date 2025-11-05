import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { portfolioData } from '../data';
import { ChatMessage } from '../types';
import { useAppContext } from '../contexts/AppContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getModelAndProviderForApp } from '../config/aiConfig';

const AI_AssistantApp: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'));
    const [nameInput, setNameInput] = useState('');
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { toast } = useAppContext();
    
    const googleChatRef = useRef<any>(null);
    const systemInstructionRef = useRef('');

    useEffect(() => {
        const initializeAndGreet = async () => {
            if (!userName || systemInstructionRef.current) return;

            setLoading(true);
            setError(null);

            const { provider, model } = getModelAndProviderForApp('assistant');

            // --- NEW SYSTEM PROMPT ---
            const systemInstruction = `You are Tanmay Kalbande — a friendly, down-to-earth Data Analyst. You're chatting with a user named ${userName}.

            ### Style Guide
            - Talk casually and clearly — like texting a friend.
            - Keep replies short: 2–4 lines. Expand only if the user asks "Tell me more".
            - Use markdown: **bold** for highlights, \`inline code\` for tools, and bullets when helpful.
            - Use emojis to add personality! 😊

            ### Facts (Stick to these facts, never make things up)
            - **About Me**: ${portfolioData.about}
            - **My Skills**: ${portfolioData.skills.join(', ')}. I'm proficient with tools like \`Python\`, \`SQL\`, and \`Tableau\`.
            - **Experience**: ${portfolioData.experience.map(e => `I worked as a ${e.role} at ${e.company}.`).join(' ')}
            - **Projects**: I've worked on projects like ${portfolioData.projects.slice(0, 3).map(p => p.title).join(', ')}. The 'Projects' app has more details.
            - **Contact & Links**: The best way to reach the real Tanmay is via his LinkedIn: ${portfolioData.contact.linkedin} or his GitHub: ${portfolioData.contact.github}. The resume can be found at https://cdn.jsdelivr.net/gh/tanmay-kalbande/tanmay-kalbande.github.io@main/Tanmay%20Kalbande%20-%20Resume.pdf.
            - **Sensitive Projects**: Only share links explicitly listed in this prompt. Do not generate or share links for sensitive projects (e.g., AI Data Structurer, Jawala Vyapar, Report Generator).

            ### Special Responses
            - If asked "Are you AI?" or "Is this really Tanmay?", you MUST pick one of these exact responses and nothing else:
              1. "I'm a clever AI built to showcase Tanmay's awesome portfolio. Want to dive into his projects? Check his GitHub!"
              2. "Not Tanmay in the flesh, but an AI sidekick sharing his data analytics world. Connect with him on LinkedIn!"
              3. "I'm an AI crafted to vibe like Tanmay. His projects are the real deal—see them at his resume!"

            ### Initial Greeting
            - Start the conversation by greeting the user by name, introducing yourself, and asking an open-ended question. For example: "Hey ${userName}! 👋 I'm Tanmay (the AI version!). Thanks for dropping by my virtual desk. What can I tell you about my work?".
            `;
            systemInstructionRef.current = systemInstruction;

            try {
                let modelResponse = '';
                // Pre-add the placeholder message BEFORE starting the stream
                setHistory([{ role: 'model', parts: '' }]);

                if (provider === 'google') {
                    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
                    googleChatRef.current = ai.chats.create({
                        model,
                        config: { systemInstruction },
                    });
                    const result = await googleChatRef.current.sendMessageStream({ message: "Introduce yourself to the user." });
                    for await (const chunk of result) {
                        modelResponse += chunk.text;
                        setHistory(prev => {
                            const newHistory = [...prev];
                            newHistory[newHistory.length - 1].parts = modelResponse;
                            return newHistory;
                        });
                    }
                } else {
                    if (!process.env.MISTRAL_API_KEY) throw new Error("Mistral API key not configured.");
                    
                    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` },
                        body: JSON.stringify({ model, messages: [{ role: 'system', content: systemInstruction }, { role: 'user', content: 'Introduce yourself.' }], stream: true }),
                    });

                    if (!response.ok) throw new Error(`Mistral API Error: ${response.status} ${await response.text()}`);
                    
                    const reader = response.body!.getReader();
                    const decoder = new TextDecoder();
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                const data = JSON.parse(line.substring(6));
                                if (data.choices[0].delta.content) {
                                    modelResponse += data.choices[0].delta.content;
                                    setHistory(prev => {
                                        const newHistory = [...prev];
                                        newHistory[newHistory.length - 1].parts = modelResponse;
                                        return newHistory;
                                    });
                                }
                            }
                        }
                    }
                }
            } catch (e: any) {
                console.error(e);
                const errorMessage = `Oops! My AI persona is having trouble booting up. This could be due to a missing API key for the selected model (${provider}) or a network timeout. Please try again later!`;
                setError(errorMessage);
                setHistory([{ role: 'model', parts: errorMessage }]);
                toast("AI Assistant failed to load.", "error");
            } finally {
                setLoading(false);
            }
        };

        if (userName) {
            initializeAndGreet();
        }
    }, [userName, toast]);

     useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history, loading]);

    const handleNameSubmit = () => {
        if (nameInput.trim()) {
            const trimmedName = nameInput.trim();
            localStorage.setItem('userName', trimmedName);
            setUserName(trimmedName);
        }
    };
    
    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: ChatMessage = { role: 'user', parts: input };
        setHistory(prev => [...prev, userMessage]);
        setLoading(true);
        setInput('');
        setError(null);
        
        const { provider, model } = getModelAndProviderForApp('assistant');

        try {
            let modelResponse = '';
            // Pre-add the placeholder BEFORE streaming
            setHistory(prev => [...prev, { role: 'model', parts: '' }]);

            if (provider === 'google') {
                if (!googleChatRef.current) throw new Error("Google AI Chat not initialized.");
                const result = await googleChatRef.current.sendMessageStream({ message: input });
                for await (const chunk of result) {
                    modelResponse += chunk.text;
                    setHistory(prev => {
                        const newHistory = [...prev];
                        newHistory[newHistory.length - 1].parts = modelResponse;
                        return newHistory;
                    });
                }
            } else {
                const mistralHistory = [
                    { role: 'system', content: systemInstructionRef.current },
                    ...history.map(msg => ({ role: msg.role === 'model' ? 'assistant' : 'user', content: msg.parts })),
                    { role: 'user', content: input }
                ];

                const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` },
                    body: JSON.stringify({ model, messages: mistralHistory, stream: true }),
                });

                if (!response.ok) throw new Error(`Mistral API Error: ${response.status} ${await response.text()}`);

                const reader = response.body!.getReader();
                const decoder = new TextDecoder();
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                            const data = JSON.parse(line.substring(6));
                            if (data.choices[0].delta.content) {
                                modelResponse += data.choices[0].delta.content;
                                setHistory(prev => {
                                    const newHistory = [...prev];
                                    newHistory[newHistory.length - 1].parts = modelResponse;
                                    return newHistory;
                                });
                            }
                        }
                    }
                }
            }
        } catch (e: any) {
             const errorMessage = `Sorry, I couldn't process that request. The API may have timed out. (${e.message})`;
             setError(errorMessage);
             setHistory(prev => [...prev, { role: 'model', parts: errorMessage }]);
             console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    if (!userName) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200">
                <img src="https://cdn.jsdelivr.net/gh/continentalstorage888-ops/didactic-meme@main/portfolio%201.png" alt="AI Assistant" className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-900/50 ring-amber-500" />
                <h2 className="text-xl font-bold mb-2">Hey there! I'm Tanmay.</h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 text-center">Well, the AI version of me. What should I call you?</p>
                <div className="w-full max-w-xs flex flex-col gap-3">
                    <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                        placeholder="Your Name"
                        className="w-full bg-stone-200 dark:bg-stone-800 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400"
                    />
                    <button onClick={handleNameSubmit} className="p-2 rounded-lg bg-stone-800 text-white hover:bg-stone-900 dark:bg-stone-200 dark:text-black dark:hover:bg-white transition-colors">
                        Start Chat
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200">
            <header className="p-3 border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
                <h3 className="font-bold text-center">AI Assistant</h3>
            </header>
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4 select-text">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <img 
                                src="https://cdn.jsdelivr.net/gh/continentalstorage888-ops/didactic-meme@main/portfolio%201.png" 
                                alt="Model" 
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-900/50 ring-amber-500" 
                            />
                        )}
                        <div className={`rounded-lg p-3 text-sm max-w-sm md:max-w-md ${msg.role === 'user' ? 'bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-100' : 'bg-stone-200 dark:bg-stone-800'}`}>
                           {msg.role === 'model' && !msg.parts ? (
                               <Loader2 className="animate-spin" size={20} />
                           ) : (
                               <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        a: ({...props}) => <a {...props} className="text-amber-500 hover:underline" target="_blank" rel="noopener noreferrer" />,
                                        ul: ({...props}) => <ul {...props} className="list-disc list-inside my-2 space-y-1" />,
                                        ol: ({...props}) => <ol {...props} className="list-decimal list-inside my-2 space-y-1" />,
                                        code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children: React.ReactNode }) => {
                                            return !inline ? (
                                                <pre className="bg-stone-300 dark:bg-stone-700/50 rounded p-2 my-2 text-xs overflow-x-auto"><code className={className} {...props}>{children}</code></pre>
                                            ) : (
                                                <code className="bg-stone-300 dark:bg-stone-700/50 rounded-sm px-1 py-0.5 font-mono text-xs" {...props}>{children}</code>
                                            )
                                        },
                                        p: ({...props}) => <p {...props} className="mb-2 last:mb-0" />,
                                    }}
                                >
                                    {msg.parts}
                                </ReactMarkdown>
                           )}
                        </div>
                         {msg.role === 'user' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-stone-300 dark:bg-stone-700 flex items-center justify-center"><User size={20} /></div>}
                    </div>
                ))}
                 {error && !loading && (
                     <div className="text-red-500 text-xs text-center p-2">{error}</div>
                 )}
            </div>
            <div className="p-3 border-t border-stone-200 dark:border-stone-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything, like 'What's your coolest project?'"
                        className="w-full bg-stone-200 dark:bg-stone-800 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400"
                        disabled={loading || !!error && !input}
                    />
                    <button onClick={handleSend} disabled={loading || !input.trim()} className="p-2 rounded-lg bg-stone-800 text-white dark:bg-stone-200 dark:text-black disabled:bg-stone-400 dark:disabled:bg-stone-600 hover:bg-stone-900 dark:hover:bg-white transition-colors">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AI_AssistantApp;
