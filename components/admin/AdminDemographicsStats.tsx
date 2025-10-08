import React from 'react';
import AdminPageLayout from './AdminPageLayout';
import { MapPinIcon } from '../Icons';

const AdminDemographicsStats: React.FC = () => {
    // Mock data
    const demographicsData = {
        ageDistribution: [
            { range: '18-24', percentage: 25 },
            { range: '25-34', percentage: 40 },
            { range: '35-44', percentage: 20 },
            { range: '45+', percentage: 15 },
        ],
        genderDistribution: [
            { gender: 'Femme', percentage: 55 },
            { gender: 'Homme', percentage: 43 },
            { gender: 'Autre', percentage: 2 },
        ],
        topCountries: [
            { country: 'France', users: 5600, flag: '🇫🇷' },
            { country: 'Belgique', users: 1200, flag: '🇧🇪' },
            { country: 'Suisse', users: 950, flag: '🇨🇭' },
            { country: 'Canada', users: 800, flag: '🇨🇦' },
            { country: 'Autres', users: 450, flag: '🌍' },
        ]
    };

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <MapPinIcon className="w-7 h-7" />
                <span>Données Démographiques</span>
            </div>
        }>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Age Distribution */}
                <div className="lg:col-span-1 bg-white/30 dark:bg-black/20 p-6 rounded-2xl shadow-md border border-white/20 dark:border-black/30">
                    <h3 className="font-bold text-lg mb-4">Répartition par âge</h3>
                    <div className="space-y-3">
                        {demographicsData.ageDistribution.map(item => (
                            <div key={item.range}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{item.range} ans</span>
                                    <span className="font-semibold">{item.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-accent h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gender and Country */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/30 dark:bg-black/20 p-6 rounded-2xl shadow-md border border-white/20 dark:border-black/30">
                        <h3 className="font-bold text-lg mb-4">Répartition par genre</h3>
                        <div className="flex justify-around">
                            {demographicsData.genderDistribution.map(item => (
                                <div key={item.gender} className="text-center">
                                    <p className="text-3xl font-bold">{item.percentage}%</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.gender}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/30 dark:bg-black/20 p-6 rounded-2xl shadow-md border border-white/20 dark:border-black/30">
                        <h3 className="font-bold text-lg mb-4">Top 5 des pays</h3>
                        <ul className="space-y-2">
                            {demographicsData.topCountries.map(item => (
                                <li key={item.country} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                                    <span className="flex items-center gap-3">
                                        <span className="text-xl">{item.flag}</span>
                                        <span>{item.country}</span>
                                    </span>
                                    <span className="font-semibold">{item.users.toLocaleString()} utilisateurs</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminDemographicsStats;