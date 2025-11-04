import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Bot, User, Send, Loader2, Database, ChevronDown, Upload, X } from 'lucide-react';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SIMPLIFIED_DATASETS } from '../data';
import { useAppContext } from '../contexts/AppContext';
import DynamicChart from '../components/DynamicChart';
import { getModelAndProviderForApp } from '../config/aiConfig';

const googleResponseSchema = {
    type: Type.OBJECT,
    properties: {
        analysis_summary: {
            type: Type.STRING,
            description: "A detailed textual summary of the data analysis and findings in Markdown format."
        },
        visualization: {
            type: Type.OBJECT,
            properties: {
                type: {
                    type: Type.STRING,
                    description: "The type of chart to display. Choose from 'bar', 'line', 'pie', 'doughnut', 'area', 'scatter', 'radar', or 'none'.",
                    enum: ['bar', 'line', 'pie', 'doughnut', 'area', 'scatter', 'radar', 'none']
                },
                title: {
                    type: Type.STRING,
                    description: "The title of the chart."
                },
                xAxisLabel: {
                    type: Type.STRING,
                    description: "The label for the X-axis, REQUIRED for scatter plots."
                },
                yAxisLabel: {
                    type: Type.STRING,
                    description: "The label for the Y-axis, REQUIRED for scatter plots."
                },
                data: {
                    type: Type.ARRAY,
                    description: "The data points for the chart. For scatter plots, provide 'x' and 'y' properties. For all others, provide 'label' and 'value'.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            label: { type: Type.STRING },
                            value: { type: Type.NUMBER },
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER }
                        },
                    }
                }
            },
            required: ["type", "title", "data"]
        }
    },
    required: ["analysis_summary", "visualization"]
};


const InsightEngineApp: React.FC = () => {
    const [selectedDataset, setSelectedDataset] = useState<string>('');
    const [customDataset, setCustomDataset] = useState<{ name: string; data: string } | null>(null);
    const [systemInstruction, setSystemInstruction] = useState<string>('');
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useAppContext();
    const googleChatRef = useRef<any>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history, loading]);
    
    const initializeChat = async (name: string, data: string, description?: string) => {
        setLoading(true);
        setHistory([]);
        googleChatRef.current = null;

        try {
            const { provider, model } = getModelAndProviderForApp('insightEngine');

            const baseInstruction = `You are a world-class data analyst named 'InsightEngine'. Your task is to analyze the provided dataset and answer user questions. The current dataset is "${name}". The data is in CSV format below:\n\`\`\`csv\n${data}\n\`\`\``;
            
            let finalSystemInstruction = baseInstruction;
            
            if (provider === 'google') {
                finalSystemInstruction += `\nYou MUST respond with a valid JSON object that strictly adheres to the provided schema. Do not add any text before or after the JSON object. Intelligently choose the best chart type based on the user's query. For scatter plots, you MUST provide 'xAxisLabel' and 'yAxisLabel' and the data items MUST have 'x' and 'y' properties. If a visualization is not appropriate, set 'visualization.type' to 'none'.`;
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
                googleChatRef.current = ai.chats.create({
                    model,
                    config: { systemInstruction: finalSystemInstruction },
                });
            } else { // Mistral
                // For Mistral, we describe the schema in the prompt.
                finalSystemInstruction += `\nYou MUST respond with a valid JSON object that strictly adheres to the following JSON schema. Do not add any text before or after the JSON object.\n\`\`\`json\n${JSON.stringify(googleResponseSchema, null, 2)}\n\`\`\``;
            }

            setSystemInstruction(finalSystemInstruction);
            
            const initialPrompt = description
                ? `Hello! You've loaded the "${name}" dataset. It is about: ${description}. What would you like to discover?`
                : `Hello! I've successfully loaded your file "${name}". What insights can I find for you?`;
            
            setHistory([{ role: 'model', parts: initialPrompt }]);
        } catch (error: any) {
            console.error(error);
            const errorMessage = `Could not initialize Insight Engine. This might be a missing API key for the selected model. (${error.message})`;
            toast(errorMessage, "error");
            setHistory([{ role: 'model', parts: 'Error: Could not connect to the analysis engine.' }]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDatasetChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const datasetKey = e.target.value;
        setSelectedDataset(datasetKey);
        setCustomDataset(null);
        if (!datasetKey) { setHistory([]); return; }
        const dataset = SIMPLIFIED_DATASETS[datasetKey];
        await initializeChat(dataset.name, dataset.data, dataset.description);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith('.csv')) { toast('Invalid file type. Please upload a .csv file.', 'error'); return; }
        if (file.size > 1 * 1024 * 1024) { toast('File is too large. Max 1MB.', 'error'); return; }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target?.result as string;
            setCustomDataset({ name: file.name, data: content });
            setSelectedDataset('');
            await initializeChat(file.name, content);
        };
        reader.readAsText(file);
    };
    
    const handleClearCustomData = () => {
        setCustomDataset(null);
        setHistory([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    
    const handleSend = async () => {
        if (!input.trim() || loading || (!selectedDataset && !customDataset)) return;
        
        const userMessage: ChatMessage = { role: 'user', parts: input };
        setHistory(prev => [...prev, userMessage]);
        setLoading(true);
        setInput('');

        const { provider, model } = getModelAndProviderForApp('insightEngine');

        try {
            let responseText = '';

            if (provider === 'google') {
                if (!googleChatRef.current) throw new Error("Google AI Chat not initialized.");
                const response = await googleChatRef.current.sendMessage({
                    message: input,
                    config: { systemInstruction, responseMimeType: "application/json", responseSchema: googleResponseSchema }
                });
                responseText = response.text;
            } else { // Mistral
                const mistralHistory = history.slice(1).map(msg => ({
                    role: msg.role === 'model' ? 'assistant' : 'user',
                    content: msg.parts + (msg.visualization ? `\n(A ${msg.visualization.type} chart titled "${msg.visualization.title}" was also generated.)` : '')
                }));

                const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` },
                    body: JSON.stringify({
                        model,
                        messages: [{ role: 'system', content: systemInstruction }, ...mistralHistory, { role: 'user', content: input }],
                        response_format: { type: "json_object" }
                    }),
                });

                if (!response.ok) throw new Error(`Mistral API Error: ${response.status} ${await response.text()}`);
                const data = await response.json();
                responseText = data.choices[0].message.content;
            }
            
            const parsedResponse = JSON.parse(responseText);
            const summary = parsedResponse.analysis_summary;
            const viz = parsedResponse.visualization;
            const newModelMessage: ChatMessage = {
                role: 'model',
                parts: summary,
                visualization: (viz && viz.type !== 'none' && viz.data?.length > 0) ? viz : undefined
            };
            if (newModelMessage.parts || newModelMessage.visualization) {
                setHistory(prev => [...prev, newModelMessage]);
            }

        } catch (e: any) {
             const errorMessage = `Sorry, I couldn't process that. The model may be timing out or returned an unexpected format. (${e.message})`;
             setHistory(prev => [...prev, { role: 'model', parts: errorMessage }]);
             console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200">
            <header className="p-3 border-b border-stone-200 dark:border-stone-800 flex-shrink-0 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h3 className="font-bold">Insight Engine</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Chat with your data. Now with file uploads!</p>
                </div>
                <div className="flex items-center gap-2">
                    {customDataset ? (
                        <div className="flex items-center gap-2 p-2 bg-stone-200 dark:bg-stone-800 rounded-lg text-sm max-w-[150px] md:max-w-xs">
                            <span className="font-semibold truncate">{customDataset.name}</span>
                            <button onClick={handleClearCustomData} className="p-0.5 rounded-full hover:bg-stone-300 dark:hover:bg-stone-700 flex-shrink-0">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                             <select
                                value={selectedDataset}
                                onChange={handleDatasetChange}
                                className="appearance-none w-full bg-stone-200 dark:bg-stone-800 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-8"
                            >
                                <option value="">-- Select a dataset --</option>
                                {Object.entries(SIMPLIFIED_DATASETS).map(([key, { name }]) => (
                                    <option key={key} value={key}>{name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500" />
                        </div>
                    )}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 p-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
                        aria-label="Upload a custom CSV file"
                    >
                        <Upload size={16} />
                        <span className="hidden md:inline">Upload CSV</span>
                    </button>
                    <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".csv,text/csv"
                        className="hidden"
                    />
                </div>
            </header>
            
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4 select-text">
                {history.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-stone-500">
                        <Database size={40} className="mb-4" />
                        <p className="font-semibold">No data loaded</p>
                        <p className="text-sm">Please choose a dataset or upload a CSV file to begin.</p>
                    </div>
                )}
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-amber-500 flex items-center justify-center"><Bot size={20} className="text-white"/></div>}
                        <div className={`rounded-lg p-3 text-sm max-w-sm md:max-w-md ${msg.role === 'user' ? 'bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-100' : 'bg-stone-200 dark:bg-stone-800'}`}>
                           {msg.visualization && (
                               <div className="mb-2">
                                   <DynamicChart vizData={msg.visualization} />
                               </div>
                           )}
                           {msg.parts && <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    a: ({...props}) => <a {...props} className="text-amber-500 hover:underline" target="_blank" rel="noopener noreferrer" />,
                                    ul: ({...props}) => <ul {...props} className="list-disc list-inside my-2 space-y-1" />,
                                    ol: ({...props}) => <ol {...props} className="list-decimal list-inside my-2 space-y-1" />,
                                    table: ({...props}) => <table {...props} className="table-auto w-full my-2 text-xs" />,
                                    thead: ({...props}) => <thead {...props} className="bg-stone-300 dark:bg-stone-700" />,
                                    th: ({...props}) => <th {...props} className="p-2 text-left font-semibold" />,
                                    td: ({...props}) => <td {...props} className="p-2 border-t border-stone-300 dark:border-stone-700" />,
                                    code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children: React.ReactNode }) => {
                                        return !inline ? (
                                            <pre className="bg-stone-900 text-stone-200 rounded p-3 my-2 text-xs overflow-x-auto font-mono"><code className={className} {...props}>{children}</code></pre>
                                        ) : (
                                            <code className="bg-stone-300 dark:bg-stone-700/50 rounded-sm px-1 py-0.5 font-mono text-xs" {...props}>{children}</code>
                                        )
                                    },
                                    p: ({...props}) => <p {...props} className="mb-2 last:mb-0" />,
                                }}
                            >
                                {msg.parts}
                            </ReactMarkdown>}
                        </div>
                         {msg.role === 'user' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-stone-300 dark:bg-stone-700 flex items-center justify-center"><User size={20} /></div>}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-amber-500 flex items-center justify-center"><Bot size={20} className="text-white"/></div>
                        <div className="bg-stone-200 dark:bg-stone-800 rounded-lg p-3 text-sm">
                           <Loader2 className="animate-spin" size={20} />
                        </div>
                    </div>
                )}
            </div>
            <div className="p-3 border-t border-stone-200 dark:border-stone-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={selectedDataset || customDataset ? "e.g., 'Visualize the data'" : "Select or upload data to start"}
                        className="w-full bg-stone-200 dark:bg-stone-800 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400"
                        disabled={loading || (!selectedDataset && !customDataset)}
                    />
                    <button onClick={handleSend} disabled={loading || !input.trim()} className="p-2 rounded-lg bg-stone-800 text-white dark:bg-stone-200 dark:text-black disabled:bg-stone-400 dark:disabled:bg-stone-600 hover:bg-stone-900 dark:hover:bg-white transition-colors">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsightEngineApp;