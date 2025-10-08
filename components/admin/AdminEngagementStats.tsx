import React, { useState, useMemo, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { ArrowTrendingUpIcon, ClockHistoryIcon, BookOpenIcon, ChartPieIcon } from '../Icons';

// --- MOCK DATA GENERATION ---
// In a real app, this data would be fetched from a database based on the time filter.
const generateChartData = (days: number) => {
    const data = [];
    for (let i = 0; i < days; i++) {
        data.push(Math.floor(Math.random() * (150 - 50 + 1)) + 50 + (days - i) * 5);
    }
    return data;
};

const getEngagementData = (filter: '7d' | '30d' | '90d') => {
    const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90;
    const factor = days / 7;

    return {
        dau: generateChartData(days),
        retentionCohorts: [
            { name: 'Sem. 1', value: 75 + Math.random() * 5 },
            { name: 'Sem. 2', value: 62 + Math.random() * 5 },
            { name: 'Sem. 3', value: 55 + Math.random() * 5 },
            { name: 'Sem. 4', value: 48 + Math.random() * 5 },
            { name: 'Sem. 5', value: 42 + Math.random() * 5 },
            { name: 'Sem. 6', value: 38 + Math.random() * 5 },
        ].slice(0, Math.max(4, Math.ceil(days / 7))),
        avgCompletion: Math.floor(65 + Math.random() * 10),
        overallRetention: Math.floor(45 + Math.random() * 5),
        avgListenTime: Math.floor(22 * factor + Math.random() * 3),
        popularCourse: "Introduction à la Pleine Conscience",
    };
};
// --- END MOCK DATA ---

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit?: string }> = ({ icon, label, value, unit }) => (
    <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
        <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
            {icon}
            <h4 className="text-sm font-semibold">{label}</h4>
        </div>
        <p className="text-3xl font-bold">{value}<span className="text-xl font-semibold text-gray-500 dark:text-gray-400 ml-1">{unit}</span></p>
    </div>
);

const LineChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
    const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; value: number; label: string }>({ visible: false, x: 0, y: 0, value: 0, label: '' });

    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-gray-500">Aucune donnée</div>;

    const width = 500;
    const height = 250;
    const padding = 30;
    const maxValue = Math.max(...data) * 1.1;
    const points = data.map((d, i) => `${(i / (data.length - 1)) * (width - padding * 2) + padding},${height - padding - (d / maxValue) * (height - padding * 2)}`).join(' ');

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        
        const index = Math.round(((cursorPoint.x - padding) / (width - padding * 2)) * (data.length - 1));
        
        if (index >= 0 && index < data.length) {
            const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
            const y = height - padding - (data[index] / maxValue) * (height - padding * 2);
            setTooltip({ visible: true, x, y, value: data[index], label: labels[index] });
        }
    };

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}>
                {/* Grid */}
                {[0.25, 0.5, 0.75, 1].map(v => (
                    <line key={v} x1={padding} y1={height - padding - (maxValue * v / maxValue) * (height - padding * 2)} x2={width - padding} y2={height - padding - (maxValue * v / maxValue) * (height - padding * 2)} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                ))}
                {/* Axes */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <text x={padding - 10} y={height - padding - (height - padding*2) + 5} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">{Math.round(maxValue)}</text>
                <text x={padding - 10} y={height-padding + 5} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">0</text>
                
                {/* Gradient */}
                <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#00A388', stopOpacity: 0.5 }} />
                        <stop offset="100%" style={{ stopColor: '#00A388', stopOpacity: 0 }} />
                    </linearGradient>
                </defs>
                <polygon points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`} fill="url(#line-gradient)" />
                <polyline points={points} fill="none" stroke="#00A388" strokeWidth="2" />
                
                {/* Tooltip */}
                {tooltip.visible && (
                    <g>
                        <line x1={tooltip.x} y1={padding} x2={tooltip.x} y2={height - padding} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 4" />
                        <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="#00A388" stroke="black" strokeWidth="2" />
                        <rect x={tooltip.x + 10} y={tooltip.y - 15} width="60" height="20" fill="rgba(0,0,0,0.7)" rx="4" />
                        <text x={tooltip.x + 40} y={tooltip.y} fill="white" fontSize="10" textAnchor="middle">{tooltip.value}</text>
                    </g>
                )}
            </svg>
        </div>
    );
};

const BarChart: React.FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const width = 500;
    const height = 250;
    const padding = 30;
    const maxValue = 100;
    const barWidth = (width - padding * 2) / data.length * 0.7;

    return (
        <svg viewBox={`0 0 ${width} ${height}`}>
            {data.map((d, i) => {
                const barHeight = (d.value / maxValue) * (height - padding * 2);
                const x = padding + i * ((width - padding * 2) / data.length) + ((width - padding * 2) / data.length * 0.15);
                const y = height - padding - barHeight;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barWidth} height={barHeight} fill="#00A388" className="opacity-70 hover:opacity-100 transition-opacity" rx="2" />
                        <text x={x + barWidth / 2} y={height - padding + 15} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{d.name}</text>
                        <text x={x + barWidth / 2} y={y - 5} fill="white" fontSize="10" textAnchor="middle">{d.value.toFixed(1)}%</text>
                    </g>
                );
            })}
        </svg>
    );
};

const DonutChart: React.FC<{ value: number; label: string }> = ({ value, label }) => {
    const size = 150;
    const strokeWidth = 15;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={center} cy={center} r={radius} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
                <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#00A388" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold">{value}%</span>
                <span className="text-xs text-gray-400">{label}</span>
            </div>
        </div>
    );
};

const AdminEngagementStats: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d'>('30d');
    const [data, setData] = useState(getEngagementData(timeFilter));
    
    useEffect(() => {
        setData(getEngagementData(timeFilter));
    }, [timeFilter]);

    const FilterButton: React.FC<{label: string; filter: typeof timeFilter}> = ({label, filter}) => (
        <button onClick={() => setTimeFilter(filter)} className={`px-3 py-1.5 text-sm rounded-md font-semibold ${timeFilter === filter ? 'bg-accent text-white' : 'bg-white/30 dark:bg-black/20'}`}>{label}</button>
    )

    const dauLabels = useMemo(() => {
        const days = timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : 90;
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        });
    }, [timeFilter]);

    return (
        <AdminPageLayout title="Engagement & Rétention">
            <div className="mb-6 flex items-center justify-end gap-2">
                <FilterButton label="7 derniers jours" filter="7d" />
                <FilterButton label="30 derniers jours" filter="30d" />
                <FilterButton label="90 derniers jours" filter="90d" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<ArrowTrendingUpIcon className="w-5 h-5"/>} label="Rétention Globale" value={data.overallRetention} unit="%" />
                <StatCard icon={<ClockHistoryIcon className="w-5 h-5"/>} label="Temps d'écoute moyen" value={data.avgListenTime} unit="min" />
                <StatCard icon={<BookOpenIcon className="w-5 h-5"/>} label="Cours le plus populaire" value={data.popularCourse} />
                <StatCard icon={<ChartPieIcon className="w-5 h-5"/>} label="Taux de complétion" value={data.avgCompletion} unit="%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/30 dark:bg-black/20 rounded-xl p-4 border border-white/20 dark:border-black/30">
                    <h3 className="font-bold mb-2">Utilisateurs Actifs Journaliers (DAU)</h3>
                    <LineChart data={data.dau} labels={dauLabels} />
                </div>
                <div className="bg-white/30 dark:bg-black/20 rounded-xl p-4 border border-white/20 dark:border-black/30">
                    <h3 className="font-bold mb-2">Taux de Rétention par Cohorte</h3>
                    <BarChart data={data.retentionCohorts} />
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminEngagementStats;
