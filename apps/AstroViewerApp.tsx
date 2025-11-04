import React, { useState, useEffect } from 'react';
import { ApodData } from '../types';
import { Loader2, AlertTriangle, Calendar } from 'lucide-react';

// Use a dedicated environment variable for the NASA key if available, otherwise fall back to the public demo key.
const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

const AstroViewerApp: React.FC = () => {
    const [apodData, setApodData] = useState<ApodData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchApodData = async () => {
            setLoading(true);
            setError(null);
            setApodData(null);

            // Client-side validation for future dates
            if (selectedDate > today) {
                setError("Future dates are not available. Please select today or a date in the past.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`);
                const responseText = await response.text();

                if (!response.ok) {
                    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                    if (responseText) {
                        try {
                            const errorData = JSON.parse(responseText);
                            errorMessage = errorData.msg || errorMessage;
                        } catch (jsonError) {
                            // Not a JSON error response, use the text if it's short
                            if (responseText.length < 200) {
                                errorMessage = responseText;
                            }
                        }
                    }
                    
                    if (response.status === 429) {
                        errorMessage = `The NASA API key is rate-limited. Please get a personal key from api.nasa.gov.`;
                    } else if (response.status === 403) {
                        errorMessage = 'Invalid NASA API key. Please check your configuration.';
                    } else if (errorMessage.toLowerCase().includes('no data available for date')) {
                        errorMessage = "Data for the selected date is not available in NASA's records. Please try another date.";
                    }
                    throw new Error(errorMessage);
                }
                
                if (!responseText) {
                    throw new Error("Received an empty response from NASA. The API might be down.");
                }
                
                const data: ApodData = JSON.parse(responseText);
                setApodData(data);

            } catch (e: any) {
                console.error(e);
                setError(e.message || 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchApodData();
    }, [selectedDate, today]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    const renderMedia = () => {
        if (!apodData) return null;

        if (apodData.media_type === 'image') {
            return (
                <a href={apodData.hdurl} target="_blank" rel="noopener noreferrer" title="View HD Image">
                    <img
                        src={apodData.url}
                        alt={apodData.title}
                        className="w-full h-auto object-contain rounded-lg shadow-lg cursor-pointer"
                    />
                </a>
            );
        }

        if (apodData.media_type === 'video') {
            return (
                <div className="aspect-video w-full">
                    <iframe
                        src={apodData.url}
                        title={apodData.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg shadow-lg"
                    ></iframe>
                </div>
            );
        }

        return <p>Unsupported media type.</p>;
    };

    return (
        <div className="h-full flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
            <header className="flex-shrink-0 p-3 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold">NASA's Picture of the Day</h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">An interactive data science demo</p>
                </div>
                <div className="relative flex items-center">
                    <Calendar size={16} className="absolute left-3 text-stone-500 pointer-events-none" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
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
                        <p>Fetching data from NASA...</p>
                    </div>
                )}
                {error && (
                    <div className="h-full flex flex-col items-center justify-center text-red-500">
                        <AlertTriangle className="mb-4" size={32} />
                        <p className="font-semibold">Could Not Load Image</p>
                        <p className="text-sm text-center">{error}</p>
                    </div>
                )}
                {apodData && (
                    <div className="max-w-4xl mx-auto space-y-4 select-text">
                        {renderMedia()}
                        <div>
                            <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">{apodData.title}</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">
                                {new Date(apodData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                                {apodData.copyright && ` - © ${apodData.copyright}`}
                            </p>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{apodData.explanation}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AstroViewerApp;