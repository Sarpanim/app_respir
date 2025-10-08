import React from 'react';
import AdminPageLayout from './AdminPageLayout';
import { EmailCampaign } from '../../types';
import { 
    TrashIcon, ArrowPathIcon, CloudArrowDownIcon,
    EnvelopeIcon, ChartBarIcon, UserGroupIcon, CalendarDaysIcon, MegaphoneIcon, EyeIcon
} from '../Icons';

interface AdminEmailCampaignDetailProps {
    campaign: EmailCampaign;
    onBack: () => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white/50 dark:bg-black/30 p-4 rounded-xl flex items-center gap-4 border border-white/20 dark:border-black/30">
        <div className="text-accent bg-accent/10 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

const AdminEmailCampaignDetail: React.FC<AdminEmailCampaignDetailProps> = ({ campaign, onBack }) => {
    return (
        <AdminPageLayout 
            title={
                <div className="flex items-center gap-3">
                    <MegaphoneIcon className="w-7 h-7" />
                    <span>Détail de la Campagne</span>
                </div>
            }
            onBack={onBack}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white/30 dark:bg-black/20 p-6 rounded-2xl shadow-md border border-white/20 dark:border-black/30">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold font-elsie">{campaign.subject}</h2>
                            <p className="text-gray-500">Envoyée le {new Date(campaign.sendDate).toLocaleString()}</p>
                            <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                campaign.status === 'Envoyé' ? 'bg-green-100 text-green-800' : 
                                campaign.status === 'Brouillon' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {campaign.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-white/50 dark:bg-black/30 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700"><EyeIcon className="w-5 h-5" /></button>
                            <button className="p-2 rounded-lg bg-white/50 dark:bg-black/30 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700"><ArrowPathIcon className="w-5 h-5" /></button>
                            <button className="p-2 rounded-lg bg-white/50 dark:bg-black/30 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700"><TrashIcon className="w-5 h-5 text-red-500" /></button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Destinataires" value={campaign.recipientCount.toLocaleString()} icon={<UserGroupIcon className="w-6 h-6" />} />
                    <StatCard title="Taux d'ouverture" value={`${campaign.openRate}%`} icon={<EnvelopeIcon className="w-6 h-6" />} />
                    <StatCard title="Taux de clics" value={`${campaign.clickRate}%`} icon={<ChartBarIcon className="w-6 h-6" />} />
                    <StatCard title="Désabonnements" value={"0"} icon={<UserGroupIcon className="w-6 h-6" />} />
                </div>

                {/* Email Preview */}
                <div className="bg-white/30 dark:bg-black/20 p-6 rounded-2xl shadow-md border border-white/20 dark:border-black/30">
                    <h3 className="font-bold text-lg mb-4">Aperçu de l'email</h3>
                    <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 text-sm">
                            <p><strong>De:</strong> Respir'{'<contact@respir.app>'}</p>
                            <p><strong>Sujet:</strong> {campaign.subject}</p>
                        </div>
                        <div className="p-6" dangerouslySetInnerHTML={{ __html: campaign.content }} />
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminEmailCampaignDetail;