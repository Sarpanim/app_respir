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
    onDuplicate: (campaign: EmailCampaign) => void;
    onDelete: (campaignId: number) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl flex items-center gap-4 border border-white/20 dark:border-black/30">
        <div className="p-3 rounded-full bg-accent/10">{icon}</div>
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);


const AdminEmailCampaignDetail: React.FC<AdminEmailCampaignDetailProps> = ({ campaign, onBack, onDuplicate, onDelete }) => {
    
    const getStatusBadge = (status: EmailCampaign['status']) => {
        switch (status) {
            case 'Envoyé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Programmé': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Brouillon': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            case 'Échec': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };

    const previewContent = campaign.content.replace(/\{\{user.name\}\}/g, 'Cher utilisateur');
    
    const emailsSent = campaign.target === 'Tous' ? 12500 : (campaign.target === 'Premium' ? 1250 : 8340);
    const unsubscribes = campaign.openRate ? Math.round((emailsSent * (campaign.openRate / 100)) * 0.01) : 0;

    return (
        <AdminPageLayout title="Détail de la Campagne" onBack={onBack}>
            <div className="mb-8 p-4 bg-white/30 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-black/30">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-elsie font-bold">{campaign.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{campaign.subject}</p>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusBadge(campaign.status)}`}>
                        {campaign.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-elsie font-bold mb-3">Aperçu de l'email</h3>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                De: <span className="font-semibold">contact@respir.app</span><br/>
                                À: <span className="font-semibold">utilisateur@exemple.com</span><br/>
                                Objet: <span className="font-semibold">{campaign.subject}</span>
                            </p>
                        </div>
                        <div className="p-6 text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {previewContent}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-elsie font-bold mb-3">Statistiques</h3>
                        <div className="space-y-3">
                            <StatCard icon={<EnvelopeIcon className="w-6 h-6 text-accent"/>} label="Emails envoyés" value={emailsSent.toLocaleString('fr-FR')} />
                            <StatCard icon={<EyeIcon className="w-6 h-6 text-accent"/>} label="Taux d'ouverture" value={campaign.openRate ? `${campaign.openRate}%` : 'N/A'} />
                            <StatCard icon={<ChartBarIcon className="w-6 h-6 text-accent"/>} label="Taux de clics" value={campaign.clickRate ? `${campaign.clickRate}%` : 'N/A'} />
                            <StatCard icon={<UserGroupIcon className="w-6 h-6 text-accent"/>} label="Désabonnés" value={unsubscribes} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-elsie font-bold mb-3">Infos techniques</h3>
                        <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl space-y-3 text-sm border border-white/20 dark:border-black/30">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2"><CalendarDaysIcon className="w-5 h-5"/> Date d'envoi</span>
                                <span>{new Date(campaign.sendDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2"><MegaphoneIcon className="w-5 h-5"/> Cible</span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full">{campaign.target}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2"><EnvelopeIcon className="w-5 h-5"/> Expéditeur</span>
                                <span>contact@respir.app</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-elsie font-bold mb-3">Actions</h3>
                        <div className="space-y-2">
                             <button onClick={() => onDuplicate(campaign)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                                <ArrowPathIcon className="w-5 h-5" /> Relancer (Dupliquer)
                            </button>
                            <button onClick={() => {}} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
                                <CloudArrowDownIcon className="w-5 h-5" /> Exporter les stats
                            </button>
                            <button onClick={() => onDelete(campaign.id)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                                <TrashIcon className="w-5 h-5" /> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminEmailCampaignDetail;