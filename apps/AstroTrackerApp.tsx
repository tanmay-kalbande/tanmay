import React, { useState, useEffect, useMemo } from 'react';
import { NeoData } from '../types';
import { Loader2, AlertTriangle, Calendar, Rocket, Maximize, Orbit, Gauge, Sigma } from 'lucide-react';

// Use a dedicated environment variable for the NASA key if available, otherwise fall back to the public demo key.
const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

const KPICard: React.FC<{ icon: React.ReactNode, title: string, value: string, subtext?: string, color: string }> = ({ icon, title, value, subtext, color }) => (
    <div className="bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg flex items-start gap-4">
        <div className={`p-3 bg-opacity-20 rounded-lg ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase">{title}</p>
            <p className="text-xl font-bold text-stone-800 dark:text-stone-100">{value}</p>
            {subtext && <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{subtext}</p>}
        </div>
    </div>
);

const AsteroidCard: React.FC<{ neo: NeoData }> = ({ neo }) => (
    <div className="bg-stone-200/50 dark:bg-stone-800/50 p-4 rounded-lg border border-stone-300/50 dark:border-stone-700/50">
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-2 truncate pr-2">{neo.name}</h4>
            {neo.is_potentially_hazardous_asteroid && (
                <div className="flex-shrink-0 text-xs font-bold bg-red-500/20 text-red-500 px-2 py-1 rounded-full">
                    Hazardous
                </div>
            )}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Maximize size={14} />
                <span>
                    {parseFloat(neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3))} - 
                    {parseFloat(neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3))} km
                </span>
            </div>
             <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Gauge size={14} />
                <span>{parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString('en-US', { maximumFractionDigits: 0 })} km/h</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Orbit size={14} />
                <span>Miss: {parseFloat(neo.close_approach_data[0].miss_distance.lunar).toFixed(2)} LD</span>
            </div>
           
        </div>
    </div>
);

const AstroTrackerApp: React.FC = () => {
    const [neoData, setNeoData] = useState<NeoData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchNeoData = async () => {
            setLoading(true);
            setError(null);
            setNeoData(null);

            try {
                const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${selectedDate}&end_date=${selectedDate}&api_key=${API_KEY}`);
                const responseText = await response.text();

                if (!response.ok) {
                    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                    if (responseText) {
                        try {
                            const errorData = JSON.parse(responseText);
                            errorMessage = errorData.error?.message || errorMessage;
                        } catch (jsonError) {
                            if (responseText.length < 200) {
                                errorMessage = responseText;
                            }
                        }
                    }
                    
                    if (response.status === 429) {
                        errorMessage = `The NASA API key is rate-limited. Please get a personal key from api.nasa.gov.`;
                    } else if (response.status === 403) {
                        errorMessage = 'Invalid NASA API key. Please check your configuration.';
                    }
                    throw new Error(errorMessage);
                }

                if (!responseText) {
                    throw new Error("Received an empty response from NASA. The API might be down.");
                }
                
                const data = JSON.parse(responseText);
                if (!data.near_earth_objects || !data.near_earth_objects[selectedDate]) {
                    setNeoData([]);
                } else {
                    const sortedData = data.near_earth_objects[selectedDate].sort((a: NeoData, b: NeoData) => 
                        parseFloat(a.close_approach_data[0].miss_distance.kilometers) - parseFloat(b.close_approach_data[0].miss_distance.kilometers)
                    );
                    setNeoData(sortedData);
                }

            } catch (e: any) {
                console.error(e);
                setError(e.message || 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchNeoData();
    }, [selectedDate]);

    const kpis = useMemo(() => {
        if (!neoData || neoData.length === 0) return null;
        
        const hazardousCount = neoData.filter(n => n.is_potentially_hazardous_asteroid).length;
        
        const largest = neoData.reduce((max, neo) => 
            neo.estimated_diameter.kilometers.estimated_diameter_max > max.estimated_diameter.kilometers.estimated_diameter_max ? neo : max, neoData[0]);

        const closest = neoData[0]; // Already sorted by miss distance

        const fastest = neoData.reduce((fastest, neo) => 
            parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour) > parseFloat(fastest.close_approach_data[0].relative_velocity.kilometers_per_hour) ? neo : fastest, neoData[0]);

        return {
            count: neoData.length,
            hazardous: hazardousCount,
            largest,
            closest,
            fastest
        };
    }, [neoData]);

    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
            <header className="flex-shrink-0 p-3 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold">Astro Tracker</h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Near-Earth Object Daily Feed</p>
                </div>
                 <div className="relative flex items-center">
                    <Calendar size={16} className="absolute left-3 text-stone-500 pointer-events-none" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={today}
                        className="pl-9 pr-2 py-1.5 bg-stone-200 dark:bg-stone-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        aria-label="Select a date"
                    />
                </div>
            </header>
             <main className="flex-grow p-4 overflow-y-auto">
                {loading && (
                    <div className="h-full flex flex-col items-center justify-center text-stone-500">
                        <Loader2 className="animate-spin mb-4" size={32} />
                        <p>Contacting NASA Deep Space Network...</p>
                    </div>
                )}
                {error && (
                    <div className="h-full flex flex-col items-center justify-center text-red-500">
                        <AlertTriangle className="mb-4" size={32} />
                        <p className="font-semibold">Signal Lost</p>
                        <p className="text-sm text-center">{error}</p>
                    </div>
                )}
                {neoData && kpis && (
                    <div className="space-y-6">
                        <section>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <KPICard icon={<Sigma size={24}/>} title="Total Objects Today" value={kpis.count.toString()} color="text-blue-500 bg-blue-500" />
                                <KPICard icon={<Maximize size={24}/>} title="Largest Object" value={`${kpis.largest.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km`} subtext={kpis.largest.name} color="text-purple-500 bg-purple-500" />
                                <KPICard icon={<Orbit size={24}/>} title="Closest Approach" value={`${parseFloat(kpis.closest.close_approach_data[0].miss_distance.lunar).toFixed(2)} LD`} subtext={kpis.closest.name} color="text-green-500 bg-green-500" />
                                <KPICard icon={<Gauge size={24}/>} title="Fastest Object" value={`${parseFloat(kpis.fastest.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString('en-US', { maximumFractionDigits: 0 })} km/h`} subtext={kpis.fastest.name} color="text-amber-500 bg-amber-500" />
                            </div>
                            {kpis.hazardous > 0 && 
                                <p className="text-center text-xs text-red-500 mt-4 font-semibold">
                                    {kpis.hazardous} potentially hazardous object{kpis.hazardous > 1 ? 's' : ''} detected today.
                                </p>
                            }
                        </section>
                        <section>
                            <h3 className="font-bold mb-3 text-lg">Today's Close Approaches (Sorted by Closest)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {neoData.map(neo => <AsteroidCard key={neo.id} neo={neo} />)}
                            </div>
                        </section>
                    </div>
                )}
                 {neoData && neoData.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-stone-500">
                        <Rocket size={40} className="mb-4" />
                        <p className="font-semibold">All Clear!</p>
                        <p className="text-sm">No near-earth objects recorded for this date.</p>
                    </div>
                 )}
            </main>
        </div>
    );
};

export default AstroTrackerApp;