import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { BarChart3, BrainCircuit, Database, Loader2 } from 'lucide-react';
import { portfolioData } from '../data';
import { useAppContext } from '../contexts/AppContext';
import { getModelAndProviderForApp } from '../config/aiConfig';

type PlaygroundTab = 'data_viz' | 'ml_sandbox' | 'sql_tester';

const TabButton: React.FC<{
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
            isActive
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
        }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

const DataVizStudio: React.FC = () => {
    const vizData = [
        { name: 'Work', value: portfolioData.projects.filter(p=>p.category === 'Work Project').length, color: 'bg-blue-500' },
        { name: 'AI', value: portfolioData.projects.filter(p=>p.category === 'AI Project').length, color: 'bg-purple-500' },
        { name: 'Fun', value: portfolioData.projects.filter(p=>p.category === 'Fun Project').length, color: 'bg-green-500' },
        { name: 'BI', value: portfolioData.projects.filter(p=>p.category === 'BI Dashboard').length, color: 'bg-yellow-500' },
    ];
    const maxValue = Math.max(...vizData.map(d => d.value));

    return (
        <div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">Project Categories</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">A simple visualization of my projects by category.</p>
            <div className="p-4 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg">
                <div className="space-y-4">
                    {vizData.map(item => (
                        <div key={item.name} className="flex items-center gap-4">
                            <span className="w-16 text-xs font-medium text-right">{item.name}</span>
                            <div className="flex-1 bg-stone-300 dark:bg-stone-700 rounded-full h-6">
                                <div
                                    className={`${item.color} h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold`}
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                >
                                    {item.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MLSandbox: React.FC = () => {
    const [inputText, setInputText] = useState('This portfolio is absolutely fantastic!');
    const [sentiment, setSentiment] = useState<{ result: string; color: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useAppContext();

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;
        setLoading(true);
        setSentiment(null);

        const { provider, model } = getModelAndProviderForApp('playground');
        const prompt = `You are a sentiment analysis model. Analyze the following text and respond with only one word: "Positive", "Negative", or "Neutral". Do not add any other text or punctuation. Text: "${inputText}"`;

        try {
            let result = '';
            if (provider === 'google') {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
                const response = await ai.models.generateContent({ model, contents: prompt });
                result = response.text.trim();
            } else { // Mistral
                if (!process.env.MISTRAL_API_KEY) throw new Error("Mistral API key not configured.");
                const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` },
                    body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] }),
                });
                if (!response.ok) throw new Error(`Mistral API Error: ${response.status} ${await response.text()}`);
                const data = await response.json();
                result = data.choices[0].message.content.trim().replace(/["'.]/g, '');
            }
            
            let color = 'text-stone-500';
            if (result === 'Positive') color = 'text-green-500';
            if (result === 'Negative') color = 'text-red-500';
            
            setSentiment({ result, color });

        } catch (error: any) {
            console.error(error);
            toast(`Failed to analyze sentiment. (${error.message})`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">Sentiment Analysis</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">Test a simple sentiment analysis model powered by your configured AI.</p>
             <div className="space-y-3">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to analyze..."
                    className="w-full h-24 p-2 bg-stone-200 dark:bg-stone-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button onClick={handleAnalyze} disabled={loading} className="w-full flex items-center justify-center p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-400 transition-colors">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analyze Sentiment'}
                </button>
                {sentiment && (
                    <div className="p-4 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg text-center">
                        <p className="font-bold text-lg">Result: <span className={sentiment.color}>{sentiment.result}</span></p>
                    </div>
                )}
             </div>
        </div>
    );
};

const SQLTester: React.FC = () => {
    const [query, setQuery] = useState("SELECT title, category FROM projects WHERE category = 'AI Project';");
    const [result, setResult] = useState<string | null>(null);

    const handleRunQuery = () => {
        const cleanedQuery = query.trim().toLowerCase();
        let queryResult: any = null;

        if (cleanedQuery === "select * from projects;") {
            queryResult = portfolioData.projects.map(({ title, category, icon }) => ({ title, category, icon }));
        } else if (cleanedQuery === "select title, category from projects where category = 'ai project';") {
            queryResult = portfolioData.projects.filter(p => p.category === 'AI Project').map(({ title, category }) => ({ title, category }));
        } else if (cleanedQuery === "select count(*) from projects;") {
             queryResult = { count: portfolioData.projects.length };
        }
        else {
            setResult("Error: Query not recognized. This is a simulation with predefined queries.");
            return;
        }

        setResult(JSON.stringify(queryResult, null, 2));
    };

    return (
         <div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">SQL Query Tester (Simulated)</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                Run basic queries against my project data. Try:
                <code className="bg-stone-200 dark:bg-stone-800 text-xs p-1 rounded-md mx-1">SELECT * FROM projects;</code>
                or
                <code className="bg-stone-200 dark:bg-stone-800 text-xs p-1 rounded-md mx-1">SELECT COUNT(*) FROM projects;</code>
            </p>
            <div className="space-y-3">
                 <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your SQL query..."
                    className="w-full h-24 p-2 bg-stone-200 dark:bg-stone-800 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button onClick={handleRunQuery} className="w-full flex items-center justify-center p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                    Run Query
                </button>
                {result && (
                    <div className="p-4 bg-stone-900 text-stone-200 rounded-lg">
                        <pre className="text-xs whitespace-pre-wrap">{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};


const SkillsPlaygroundApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<PlaygroundTab>('ml_sandbox');

    const renderContent = () => {
        switch (activeTab) {
            case 'data_viz': return <DataVizStudio />;
            case 'ml_sandbox': return <MLSandbox />;
            case 'sql_tester': return <SQLTester />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900">
            <header className="flex-shrink-0 border-b border-stone-200 dark:border-stone-800">
                <div className="flex">
                    <TabButton icon={BarChart3} label="Data Viz Studio" isActive={activeTab === 'data_viz'} onClick={() => setActiveTab('data_viz')} />
                    <TabButton icon={BrainCircuit} label="ML Model Sandbox" isActive={activeTab === 'ml_sandbox'} onClick={() => setActiveTab('ml_sandbox')} />
                    <TabButton icon={Database} label="SQL Query Tester" isActive={activeTab === 'sql_tester'} onClick={() => setActiveTab('sql_tester')} />
                </div>
            </header>
            <main className="flex-grow p-4 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default SkillsPlaygroundApp;