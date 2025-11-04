import React from 'react';
import { motion } from 'framer-motion';

interface ChartData {
    label: string;
    value: number;
    x?: number;
    y?: number;
}

const BarChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
    const colors = ['bg-amber-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-indigo-500'];

    return (
        <div className="flex justify-around items-end h-40 pt-6 gap-2">
            {data.map((item, index) => (
                <div key={item.label} className="relative flex flex-col items-center w-full h-full">
                    <motion.div
                        className="absolute -top-5 text-xs font-bold text-stone-700 dark:text-stone-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: item.value > 0 ? 1 : 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                    >
                        {item.value.toLocaleString()}
                    </motion.div>
                    <motion.div
                        className={`w-full rounded-t-md hover:opacity-80 transition-opacity ${colors[index % colors.length]}`}
                        initial={{ height: '0%' }}
                        animate={{ height: `${(item.value / maxValue) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: index * 0.1 }}
                    />
                    <div className="text-xs font-semibold mt-2 text-stone-600 dark:text-stone-400 truncate w-full text-center">
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

const LineChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    if (data.length < 2) return <div className="text-xs text-center text-stone-500">Line chart requires at least 2 data points.</div>;

    const width = 280;
    const height = 160;
    const padding = { top: 10, right: 10, bottom: 20, left: 30 };
    
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = data.every(d => d.value === maxValue) ? 0 : Math.min(...data.map(d => d.value));
    
    const getX = (index: number) => padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
    const getY = (value: number) => {
        if (maxValue === minValue) return height / 2;
        return height - padding.bottom - ((value - minValue) / (maxValue - minValue)) * (height - padding.top - padding.bottom);
    }

    const pathData = data.map((point, index) => `${getX(index)},${getY(point.value)}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
            <text x={padding.left - 5} y={getY(maxValue) + 5} textAnchor="end" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{maxValue.toLocaleString()}</text>
            <text x={padding.left - 5} y={getY(minValue) + 5} textAnchor="end" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{minValue.toLocaleString()}</text>
            
            <motion.polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                points={pathData}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
            />
            
            {data.map((point, index) => (
                <motion.circle
                    key={index}
                    cx={getX(index)}
                    cy={getY(point.value)}
                    r="4"
                    fill="#f59e0b"
                    stroke="white"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                />
            ))}

            {data.map((point, index) => (
                <text key={index} x={getX(index)} y={height - 5} textAnchor="middle" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{point.label}</text>
            ))}
        </svg>
    );
};

const PieChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#6366f1'];
    let startAngle = -90;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-40 h-40">
                {data.map((item, index) => {
                    const percent = item.value / total;
                    const [startX, startY] = getCoordinatesForPercent(startAngle / 360);
                    startAngle += percent * 360;
                    const [endX, endY] = getCoordinatesForPercent(startAngle / 360);
                    const largeArcFlag = percent > 0.5 ? 1 : 0;
                    
                    const pathData = [
                        `M ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `L 0 0`,
                    ].join(' ');

                    return (
                        <motion.path
                            key={item.label}
                            d={pathData}
                            fill={colors[index % colors.length]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                    );
                })}
            </svg>
            <div className="text-xs space-y-2">
                {data.map((item, index) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[index % colors.length] }}></div>
                        <span className="font-semibold text-stone-700 dark:text-stone-300">{item.label}</span>
                        <span className="text-stone-500 dark:text-stone-400">({((item.value / total) * 100).toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DoughnutChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#6366f1'];
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
                {data.map((item, index) => {
                    const percent = item.value / total;
                    const strokeDashoffset = circumference * (1 - percent);
                    const rotation = accumulatedPercent * 360;
                    accumulatedPercent += percent;

                    return (
                        <motion.circle
                            key={item.label}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke={colors[index % colors.length]}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }}
                        />
                    );
                })}
            </svg>
            <div className="text-xs space-y-2">
                {data.map((item, index) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[index % colors.length] }}></div>
                        <span className="font-semibold text-stone-700 dark:text-stone-300">{item.label}</span>
                        <span className="text-stone-500 dark:text-stone-400">({((item.value / total) * 100).toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AreaChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    if (data.length < 2) return <div className="text-xs text-center text-stone-500">Area chart requires at least 2 data points.</div>;

    const width = 280;
    const height = 160;
    const padding = { top: 10, right: 10, bottom: 20, left: 30 };

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = 0; // Area charts usually start from 0

    const getX = (index: number) => padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
    const getY = (value: number) => {
        if (maxValue === minValue) return height / 2;
        return height - padding.bottom - ((value - minValue) / (maxValue - minValue)) * (height - padding.top - padding.bottom);
    }

    const pathData = data.map((point, index) => `${getX(index)},${getY(point.value)}`).join(' ');
    const areaPath = `M${getX(0)},${getY(data[0].value)} ` + pathData + ` L${getX(data.length - 1)},${height - padding.bottom} L${getX(0)},${height - padding.bottom} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
            <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
            </defs>
            <text x={padding.left - 5} y={getY(maxValue) + 5} textAnchor="end" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{maxValue.toLocaleString()}</text>
            <text x={padding.left - 5} y={getY(minValue) + 5} textAnchor="end" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{minValue.toLocaleString()}</text>
            
            <motion.path
                fill="url(#areaGradient)"
                d={areaPath}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                points={pathData}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
            />
            
            {data.map((point, index) => (
                <text key={index} x={getX(index)} y={height - 5} textAnchor="middle" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{point.label}</text>
            ))}
        </svg>
    );
};

const ScatterPlot: React.FC<{ data: ChartData[]; xAxisLabel: string; yAxisLabel: string }> = ({ data, xAxisLabel, yAxisLabel }) => {
    const width = 280;
    const height = 180;
    const padding = { top: 10, right: 10, bottom: 30, left: 35 };

    const xValues = data.map(d => d.x).filter((v): v is number => v !== undefined);
    const yValues = data.map(d => d.y).filter((v): v is number => v !== undefined);
    
    if (xValues.length === 0 || yValues.length === 0) {
        return <div className="text-xs text-center text-stone-500">Scatter plot requires 'x' and 'y' data points.</div>;
    }

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    const getX = (value: number) => padding.left + ((value - minX) / (maxX - minX)) * (width - padding.left - padding.right);
    const getY = (value: number) => height - padding.bottom - ((value - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="currentColor" strokeWidth="0.5" className="text-stone-300 dark:text-stone-700" />
            <text x={padding.left - 8} y={padding.top + 5} textAnchor="end" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{maxY.toLocaleString()}</text>
            <text x={padding.left - 8} y={height - padding.bottom + 3} textAnchor="end" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{minY.toLocaleString()}</text>
            <text transform={`translate(10, ${height / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor" className="text-stone-600 dark:text-stone-300">{yAxisLabel}</text>

            <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="currentColor" strokeWidth="0.5" className="text-stone-300 dark:text-stone-700" />
            <text x={padding.left} y={height - padding.bottom + 12} textAnchor="start" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{minX.toLocaleString()}</text>
            <text x={width - padding.right} y={height - padding.bottom + 12} textAnchor="end" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{maxX.toLocaleString()}</text>
            <text x={width/2} y={height-5} textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor" className="text-stone-600 dark:text-stone-300">{xAxisLabel}</text>

            {data.map((point, index) => (
                <motion.circle
                    key={index}
                    cx={getX(point.x!)}
                    cy={getY(point.y!)}
                    r="3.5"
                    fill="#f59e0b"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.7 }}
                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
                />
            ))}
        </svg>
    );
};

const RadarChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    if (data.length < 3) return <div className="text-xs text-center text-stone-500">Radar chart requires at least 3 data points.</div>;

    const size = 200;
    const center = size / 2;
    const radius = size * 0.4;
    const levels = 5;
    const angleSlice = (Math.PI * 2) / data.length;
    const maxValue = Math.max(...data.map(d => d.value), 1);

    const dataPoints = data.map((d, i) => {
        const r = (d.value / maxValue) * radius;
        const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
        const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-56">
            {[...Array(levels)].map((_, levelIndex) => {
                const levelRadius = radius * ((levelIndex + 1) / levels);
                const points = data.map((_, i) => {
                    const x = center + levelRadius * Math.cos(angleSlice * i - Math.PI / 2);
                    const y = center + levelRadius * Math.sin(angleSlice * i - Math.PI / 2);
                    return `${x},${y}`;
                }).join(' ');
                return <polygon key={levelIndex} points={points} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-stone-300 dark:text-stone-700" />;
            })}
            
            {data.map((d, i) => {
                const x2 = center + radius * Math.cos(angleSlice * i - Math.PI / 2);
                const y2 = center + radius * Math.sin(angleSlice * i - Math.PI / 2);
                const labelX = center + (radius + 15) * Math.cos(angleSlice * i - Math.PI / 2);
                const labelY = center + (radius + 15) * Math.sin(angleSlice * i - Math.PI / 2);
                
                return (
                    <g key={d.label}>
                        <line x1={center} y1={center} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" className="text-stone-300 dark:text-stone-700" />
                        <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="currentColor" className="text-stone-500 dark:text-stone-400">{d.label}</text>
                    </g>
                );
            })}

            <motion.polygon
                points={dataPoints}
                fill="rgba(245, 158, 11, 0.4)"
                stroke="#f59e0b"
                strokeWidth="2"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                style={{ transformOrigin: 'center' }}
            />
        </svg>
    );
};

interface DynamicChartProps {
    vizData: {
        type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'radar' | 'none';
        title: string;
        data: ChartData[];
        xAxisLabel?: string;
        yAxisLabel?: string;
    };
}

const DynamicChart: React.FC<DynamicChartProps> = ({ vizData }) => {
    if (!vizData || vizData.type === 'none' || !vizData.data || vizData.data.length === 0) {
        return null;
    }

    const renderChart = () => {
        switch (vizData.type) {
            case 'bar':
                return <BarChart data={vizData.data} />;
            case 'line':
                return <LineChart data={vizData.data} />;
            case 'pie':
                return <PieChart data={vizData.data} />;
            case 'doughnut':
                return <DoughnutChart data={vizData.data} />;
            case 'area':
                return <AreaChart data={vizData.data} />;
            case 'scatter':
                return <ScatterPlot data={vizData.data} xAxisLabel={vizData.xAxisLabel || 'X-Axis'} yAxisLabel={vizData.yAxisLabel || 'Y-Axis'} />;
            case 'radar':
                return <RadarChart data={vizData.data} />;
            default:
                return <p className="text-center text-sm text-stone-500">Chart type '{vizData.type}' is not supported yet.</p>;
        }
    };

    return (
        <div>
            <h3 className="font-bold text-stone-800 dark:text-stone-100 text-center mb-2">{vizData.title}</h3>
            {renderChart()}
        </div>
    );
};

export default DynamicChart;