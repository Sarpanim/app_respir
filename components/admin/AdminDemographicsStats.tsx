import React, { useState, useMemo, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { MapPinIcon } from '../Icons';

// --- MOCK DATA GENERATION ---
const getDemographicsData = (filter: '7d' | '30d' | '90d') => {
    return {
        gender: [
            { name: "Femmes", value: 58.9 + Math.random(), color: "#00A388" },
            { name: "Hommes", value: 35.3 + Math.random(), color: "#A259FF" },
            { name: "Autre", value: 5.9 + Math.random(), color: "#6B7280" },
        ],
        age: [
            { range: "18-24", value: 26.7 },
            { range: "25-34", value: 42.1 },
            { range: "35-44", value: 20.6 },
            { range: "45-54", value: 10.3 },
            { range: "55+", value: 5.3 },
        ],
        location: [
            { country: "France", code: "FR", value: 70 },
            { country: "Belgique", code: "BE", value: 12 },
            { country: "Suisse", code: "CH", value: 8 },
            { country: "Canada", code: "CA", value: 6 },
            { country: "Autres", code: "Autres", value: 4 },
        ].sort((a,b) => b.value - a.value)
    };
};
// --- END MOCK DATA ---

const PieChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulative = 0;

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <svg viewBox="0 0 42 42" className="w-36 h-36 -rotate-90">
                {data.map((item, index) => {
                    const percentage = (item.value / total) * 100;
                    const offset = cumulative;
                    cumulative += percentage;
                    return (
                        <circle
                            key={index}
                            cx="21" cy="21" r="15.915"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="6"
                            strokeDasharray={`${percentage} ${100 - percentage}`}
                            strokeDashoffset={-offset}
                        />
                    );
                })}
            </svg>
            <div className="space-y-2 text-sm">
                {data.map(item => (
                    <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="font-semibold w-20">{item.name}</span>
                        <span className="text-gray-400">{((item.value/total)*100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HorizontalBarChart: React.FC<{ data: { range: string, value: number }[] }> = ({ data }) => {
    return (
        <div className="space-y-4">
            {data.map(item => (
                <div key={item.range} className="flex items-center gap-4 text-sm">
                    <span className="w-12 text-left font-semibold text-gray-400">{item.range}</span>
                    <div className="flex-1 relative h-2 bg-gray-700/50 rounded-full">
                        <div
                            className="h-2 bg-accent rounded-full"
                            style={{ width: `${item.value}%` }}
                        >
                        </div>
                    </div>
                     <div className="w-12 text-right">
                        <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          {item.value.toFixed(1)}%
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const InteractiveWorldMap: React.FC<{ data: { country: string; value: number }[] }> = ({ data }) => {
    const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

    const countryToContinent: { [key: string]: string } = {
        'France': 'EU', 'Belgique': 'EU', 'Suisse': 'EU', 'Canada': 'NA',
    };

    const continentData = useMemo(() => {
        const continents: { [key: string]: { value: number; countries: string[] } } = {};
        data.forEach(item => {
            const continentCode = countryToContinent[item.country];
            if (continentCode) {
                if (!continents[continentCode]) continents[continentCode] = { value: 0, countries: [] };
                continents[continentCode].value += item.value;
                continents[continentCode].countries.push(`${item.country}: ${item.value}%`);
            }
        });
        return continents;
    }, [data]);

    const maxContinentValue = Math.max(0, ...Object.values(continentData).map((c: { value: number }) => c.value));
    
    const getFill = (value: number) => {
        if (maxContinentValue === 0) return 'rgba(0, 163, 136, 0.2)';
        const opacity = 0.2 + (value / maxContinentValue) * 0.8;
        return `rgba(0, 163, 136, ${opacity})`;
    };

    const handleMouseMove = (e: React.MouseEvent, content: string) => {
        if (!content) return;
        setTooltip({ content, x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => setTooltip(null);
    
    const mapPaths = {
        NA: { path: "M165 240 L150 210 L120 190 L130 160 L180 150 L240 120 L280 160 L270 200 L220 230 Z" },
        SA: { path: "M220 250 L240 280 L230 350 L200 360 L190 290 Z" },
        EU: { path: "M380 180 L420 170 L430 140 L460 140 L450 190 L400 200 Z" },
        AF: { path: "M380 220 L410 210 L440 250 L420 340 L380 330 L360 270 Z" },
        AS: { path: "M480 130 L550 120 L650 150 L630 250 L550 280 L500 220 Z" },
        OC: { path: "M680 340 L710 320 L750 350 L720 380 Z" }
    };

    return (
        <div className="relative aspect-[2/1] text-gray-400 dark:text-gray-600">
            {tooltip && (
                <div className="fixed p-2 bg-black/80 text-white text-xs rounded-md pointer-events-none z-50 transition-all" style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}>
                    <div dangerouslySetInnerHTML={{ __html: tooltip.content.replace(/, /g, '<br/>') }} />
                </div>
            )}
            <svg viewBox="0 0 1000 500" className="w-full h-full">
                <g>
                    {Object.entries(mapPaths).map(([code, { path }]) => {
                        const continentInfo = continentData[code];
                        return (
                            <path
                                key={code}
                                d={path}
                                fill={continentInfo ? getFill(continentInfo.value) : 'rgba(128,128,128,0.2)'}
                                stroke="#191919"
                                strokeWidth="2"
                                onMouseMove={(e) => handleMouseMove(e, continentInfo ? continentInfo.countries.join(', ') : '')}
                                onMouseLeave={handleMouseLeave}
                                className="transition-all duration-200 hover:fill-accent"
                            />
                        )
                    })}
                </g>
            </svg>
        </div>
    );
};


const LocationList: React.FC<{ data: { country: string, code: string, value: number }[] }> = ({ data }) => (
    <div className="space-y-3 pr-2">
        {data.map(item => (
            <div key={item.code} className="flex items-center gap-4 text-sm">
                <span className="w-8 font-bold text-gray-500">{item.code}</span>
                <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-semibold">{item.country}</span>
                        <span className="font-semibold">{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700/50 rounded-full"><div className="h-1.5 bg-accent rounded-full" style={{ width: `${item.value}%` }}></div></div>
                </div>
            </div>
        ))}
    </div>
);


const AdminDemographicsStats: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d'>('30d');
    const [data, setData] = useState(getDemographicsData(timeFilter));
    
    useEffect(() => {
        setData(getDemographicsData(timeFilter));
    }, [timeFilter]);

    const FilterButton: React.FC<{label: string; filter: typeof timeFilter}> = ({label, filter}) => (
        <button onClick={() => setTimeFilter(filter)} className={`px-3 py-1.5 text-sm rounded-md font-semibold ${timeFilter === filter ? 'bg-accent text-white' : 'bg-white/30 dark:bg-black/20'}`}>{label}</button>
    )

    return (
        <AdminPageLayout title="Données Démographiques">
             <div className="mb-6 flex items-center justify-center gap-2">
                <FilterButton label="7 derniers jours" filter="7d" />
                <FilterButton label="30 derniers jours" filter="30d" />
                <FilterButton label="90 derniers jours" filter="90d" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="bg-white/30 dark:bg-black/20 rounded-xl p-6 border border-white/20 dark:border-black/30">
                        <h3 className="font-bold mb-4">Répartition par genre</h3>
                        <PieChart data={data.gender} />
                    </div>
                     <div className="bg-white/30 dark:bg-black/20 rounded-xl p-6 border border-white/20 dark:border-black/30">
                        <h3 className="font-bold mb-4">Répartition par tranche d'âge</h3>
                        <HorizontalBarChart data={data.age} />
                    </div>
                </div>

                <div className="bg-white/30 dark:bg-black/20 rounded-xl p-6 border border-white/20 dark:border-black/30 flex flex-col">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><MapPinIcon className="w-5 h-5"/> Top 5 des localisations</h3>
                    <div className="flex-grow">
                        <LocationList data={data.location} />
                    </div>
                    <div className="mt-4 border-t border-white/10 pt-4">
                        <InteractiveWorldMap data={data.location} />
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminDemographicsStats;