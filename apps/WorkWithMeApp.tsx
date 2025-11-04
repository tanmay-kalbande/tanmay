import React, { useState } from 'react';
import { CheckCircle, TrendingUp, Code, TestTube2, Rocket, MessageSquare, ListTodo, Workflow, UserCircle2, Bot, Calendar, BrainCircuit, Coffee, Zap, Users } from 'lucide-react';

type WorkTab = 'workflow' | 'communication' | 'sprint_board' | 'day_in_life';

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

const WorkflowSection: React.FC = () => {
    const steps = [
        { icon: CheckCircle, title: 'Discovery', description: 'Understand project goals and requirements.' },
        { icon: TrendingUp, title: 'Planning', description: 'Define scope, milestones, and success metrics.' },
        { icon: Code, title: 'Development', description: 'Build, train, and validate models and pipelines.' },
        { icon: TestTube2, title: 'Testing', description: 'Ensure accuracy, performance, and reliability.' },
        { icon: Rocket, title: 'Deployment', description: 'Integrate the solution into production systems.' },
        { icon: MessageSquare, title: 'Feedback', description: 'Iterate based on feedback and performance.' },
    ];
    return (
        <div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">My Project Workflow</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">I follow a structured, agile approach to ensure projects are delivered efficiently and effectively.</p>
            <div className="space-y-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg">
                        <step.icon className="w-8 h-8 text-amber-500 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-stone-800 dark:text-stone-100">{step.title}</h4>
                            <p className="text-sm text-stone-600 dark:text-stone-400">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CommunicationSection: React.FC = () => (
    <div>
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">Communication Style</h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">I believe in clear, proactive, and transparent communication. Here's a typical update:</p>
        <div className="p-4 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg border border-stone-300/50 dark:border-stone-700/50">
            <h4 className="font-bold text-amber-600 dark:text-amber-400">[Project X] Weekly Sync - [Date]</h4>
            <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                <li><span className="font-semibold">Last Week:</span> Completed feature A, deployed to staging.</li>
                <li><span className="font-semibold">This Week:</span> Begin work on feature B, address feedback on A.</li>
                <li><span className="font-semibold">Blockers:</span> Awaiting API credentials for third-party service.</li>
            </ul>
        </div>
    </div>
);

const SprintBoardSection: React.FC = () => {
    const tasks = {
        'To Do': [{ icon: ListTodo, title: 'Analyze user engagement data' }, { icon: ListTodo, title: 'Refactor data pipeline for efficiency' }],
        'In Progress': [{ icon: Workflow, title: 'Develop predictive model for churn' }],
        'Done': [{ icon: CheckCircle, title: 'Deploy sentiment analysis API' }, { icon: CheckCircle, title: 'Create Q2 performance dashboard' }],
    };

    return (
        <div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">Example Sprint Board</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">A glimpse into how I track tasks and progress during a sprint.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(tasks).map(([status, taskList]) => (
                    <div key={status} className="bg-stone-200/50 dark:bg-stone-800/50 p-3 rounded-lg">
                        <h4 className="font-bold mb-3 text-center">{status}</h4>
                        <div className="space-y-2">
                            {taskList.map((task, index) => (
                                <div key={index} className="flex items-start gap-2 p-2 bg-stone-100 dark:bg-stone-900 rounded-md text-sm">
                                    <task.icon className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                                    <span>{task.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DayInLifeSection: React.FC = () => {
    const schedule = [
        { time: '9:00 AM', icon: Coffee, activity: 'Morning coffee & review daily priorities' },
        { time: '9:30 AM', icon: BrainCircuit, activity: 'Focused work: model development / analysis' },
        { time: '12:00 PM', icon: Zap, activity: 'Lunch break & quick walk' },
        { time: '1:00 PM', icon: Code, activity: 'Coding, debugging, and implementation' },
        { time: '3:00 PM', icon: Users, activity: 'Collaborative meetings / team sync' },
        { time: '4:30 PM', icon: ListTodo, activity: 'Plan for the next day' },
    ];
    return (
        <div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">A Typical Day</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">My day is a balance of deep work, collaboration, and continuous learning.</p>
            <div className="space-y-2">
                {schedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg">
                        <span className="font-mono text-xs w-16 text-right">{item.time}</span>
                        <item.icon className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="text-sm">{item.activity}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const WorkWithMeApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<WorkTab>('workflow');

    const renderContent = () => {
        switch (activeTab) {
            case 'workflow': return <WorkflowSection />;
            case 'communication': return <CommunicationSection />;
            case 'sprint_board': return <SprintBoardSection />;
            case 'day_in_life': return <DayInLifeSection />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900">
            <header className="flex-shrink-0 border-b border-stone-200 dark:border-stone-800">
                <div className="flex">
                    <TabButton icon={Workflow} label="Workflow" isActive={activeTab === 'workflow'} onClick={() => setActiveTab('workflow')} />
                    <TabButton icon={MessageSquare} label="Communication" isActive={activeTab === 'communication'} onClick={() => setActiveTab('communication')} />
                    <TabButton icon={ListTodo} label="Sprint Board" isActive={activeTab === 'sprint_board'} onClick={() => setActiveTab('sprint_board')} />
                    <TabButton icon={Calendar} label="A Day in Life" isActive={activeTab === 'day_in_life'} onClick={() => setActiveTab('day_in_life')} />
                </div>
            </header>
            <main className="flex-grow p-4 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default WorkWithMeApp;
