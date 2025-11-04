import React from 'react';
import { Users, IndianRupee, TrendingUp, Signal } from 'lucide-react';

const KPICard: React.FC<{ icon: React.ReactNode, title: string, value: string, subtext: string }> = ({ icon, title, value, subtext }) => (
    <div className="bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg flex items-center gap-4">
        <div className="p-3 bg-amber-500/20 text-amber-500 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase">{title}</p>
            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{value}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">{subtext}</p>
        </div>
    </div>
);

const BarChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="flex justify-around items-end h-48 pt-4">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-1/5">
                    <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">{item.value}</div>
                    <div
                        className="w-8 bg-amber-500 rounded-t-md hover:bg-amber-400 transition-all"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                    ></div>
                    <div className="text-xs font-semibold mt-2">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const LineChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const points = data.map((d, i) => `${i * 33.3},${100 - (d.value - 10) * 8}`).join(' ');
    return (
         <div className="relative h-48 w-full">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <polyline
                    fill="none"
                    stroke="#f59e0b" // amber-500
                    strokeWidth="2"
                    points={points}
                />
                {data.map((item, index) => (
                     <circle key={index} cx={index * 33.3} cy={100 - (item.value - 10) * 8} r="2" fill="#f59e0b" />
                ))}
            </svg>
            <div className="absolute -bottom-6 w-full flex justify-between text-xs font-semibold">
                {data.map(item => <span key={item.label}>{item.label}</span>)}
            </div>
        </div>
    );
};

const PieChart: React.FC = () => (
    <div className="flex items-center justify-center gap-6">
        <div 
            className="w-36 h-36 rounded-full" 
            style={{ background: 'conic-gradient(#3b82f6 0 45%, #8b5cf6 45% 75%, #f59e0b 75% 90%, #a1a1aa 90% 100%)' }}
        ></div>
        <div className="text-xs space-y-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500"></div><span>Reliance Jio (45%)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-purple-500"></div><span>Bharti Airtel (30%)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-500"></div><span>Vodafone Idea (15%)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-stone-400"></div><span>BSNL/MTNL (10%)</span></div>
        </div>
    </div>
);

const DataWaveIndiaDashboard: React.FC = () => {
    const revenueData = [
        { label: "Q1 '24", value: 680 },
        { label: "Q2 '24", value: 695 },
        { label: "Q3 '24", value: 710 },
        { label: "Q4 '24", value: 730 },
    ];
    
    const usageData = [
        { label: "2021", value: 14.1 },
        { label: "2022", value: 17.0 },
        { label: "2023", value: 19.5 },
        { label: "2024", value: 21.5 },
    ];

    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 p-4 select-text space-y-4">
            <header>
                 <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Data Wave Metrics - India Wireless Landscape</h2>
                 <p className="text-sm text-stone-500 dark:text-stone-400">Q4 2024 Snapshot (Simulated Data)</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard icon={<Users size={24}/>} title="Total Subscribers" value="1.21B" subtext="+2.5% vs. Q3" />
                <KPICard icon={<IndianRupee size={24}/>} title="ARPU" value="₹185.7" subtext="+1.8% vs. Q3" />
                <KPICard icon={<TrendingUp size={24}/>} title="Quarterly Revenue" value="₹730B" subtext="+2.8% vs. Q3" />
                <KPICard icon={<Signal size={24}/>} title="Avg. Data Usage" value="21.5 GB" subtext="per user/month" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg">
                    <h3 className="font-bold mb-4">Quarterly Revenue (Billion ₹)</h3>
                    <BarChart data={revenueData} />
                </div>
                <div className="bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg">
                    <h3 className="font-bold mb-4">Avg. Monthly Data Usage (GB)</h3>
                    <LineChart data={usageData} />
                </div>
            </div>

            <div className="bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg">
                <h3 className="font-bold mb-4">Subscriber Market Share</h3>
                <PieChart />
            </div>
        </div>
    );
};

export default DataWaveIndiaDashboard;