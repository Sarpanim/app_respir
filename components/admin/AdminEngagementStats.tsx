import React from 'react';
import AdminPageLayout from './AdminPageLayout';
import { ArrowTrendingUpIcon, ClockIcon as ClockHistoryIcon, BookOpenIcon, ChartPieIcon } from '../Icons';

const StatCard: React.FC<{ title: string; value: string; change?: string; icon: React.ReactNode }> = ({ title, value, change, icon }) => (
    <div className="bg-white/50 dark:bg-black/30 p-6 rounded-2xl shadow-md flex items-center gap-6 border border-white/20 dark:border-black/30">
        <div className="text-accent bg-accent/10 p-3 rounded-xl">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && <p className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>}
        </div>
    </div>
);

const AdminEngagementStats: React.FC = () => {
    // Mock data
    const engagementData = {
        dailyActiveUsers: { value: '1,250', change: '+5.2%' },
        monthlyActiveUsers: { value: '8,900', change: '+2.1%' },
        sessionDuration: { value: '12m 45s', change: '-1.5%' },
        retentionRate: { value: '45%', change: '+3%' },
        coursesCompleted: { value: '5,678', change: '+150 this week' },
        lessonsPlayed: { value: '102,430', change: '+1.2k today' },
    };

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <ChartPieIcon className="w-7 h-7" />
                <span>Statistiques d'Engagement</span>
            </div>
        }>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Utilisateurs Actifs (Jour)" 
                    value={engagementData.dailyActiveUsers.value} 
                    change={engagementData.dailyActiveUsers.change}
                    icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
                />
                <StatCard 
                    title="Utilisateurs Actifs (Mois)" 
                    value={engagementData.monthlyActiveUsers.value} 
                    change={engagementData.monthlyActiveUsers.change}
                    icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
                />
                <StatCard 
                    title="Durée de session moyenne" 
                    value={engagementData.sessionDuration.value} 
                    change={engagementData.sessionDuration.change}
                    icon={<ClockHistoryIcon className="w-6 h-6" />}
                />
                <StatCard 
                    title="Taux de rétention (30j)" 
                    value={engagementData.retentionRate.value} 
                    change={engagementData.retentionRate.change}
                    icon={<ChartPieIcon className="w-6 h-6" />}
                />
                <StatCard 
                    title="Cours terminés" 
                    value={engagementData.coursesCompleted.value} 
                    change={engagementData.coursesCompleted.change}
                    icon={<BookOpenIcon className="w-6 h-6" />}
                />
                <StatCard 
                    title="Leçons jouées" 
                    value={engagementData.lessonsPlayed.value} 
                    change={engagementData.lessonsPlayed.change}
                    icon={<BookOpenIcon className="w-6 h-6" />}
                />
            </div>
            
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Graphiques d'activité</h3>
                <div className="bg-white/30 dark:bg-black/20 p-6 rounded-2xl shadow-md border border-white/20 dark:border-black/30">
                    {/* Placeholder for charts */}
                    <p className="text-center text-gray-500">Les graphiques d'engagement seront affichés ici.</p>
                    <div className="h-64 flex items-center justify-center">
                        <ChartPieIcon className="w-24 h-24 text-gray-300 dark:text-gray-700" />
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminEngagementStats;