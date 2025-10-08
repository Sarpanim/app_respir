import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { EmailCampaign } from '../../types';
import { MegaphoneIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '../Icons';
import AdminEmailCampaignDetail from './AdminEmailCampaignDetail';
import AdminEmailCampaignEditor from './AdminEmailCampaignEditor';

const AdminEmailCampaigns: React.FC = () => {
    const { emailCampaigns, setEmailCampaigns } = useAppContext();
    const [view, setView] = useState<'list' | 'detail' | 'editor'>('list');
    const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

    const handleViewDetails = (campaign: EmailCampaign) => {
        setSelectedCampaign(campaign);
        setView('detail');
    };

    const handleEdit = (campaign: EmailCampaign) => {
        setSelectedCampaign(campaign);
        setView('editor');
    };

    const handleCreate = () => {
        setSelectedCampaign(null); // For a new campaign
        setView('editor');
    };

    const handleSaveCampaign = (campaign: EmailCampaign) => {
        if (selectedCampaign) {
            setEmailCampaigns(emailCampaigns.map(c => c.id === campaign.id ? campaign : c));
        } else {
            setEmailCampaigns([...emailCampaigns, { ...campaign, id: Date.now() }]);
        }
        setView('list');
        setSelectedCampaign(null);
    };

    const handleDeleteCampaign = (campaignId: number) => {
        if (window.confirm("Supprimer cette campagne ?")) {
            setEmailCampaigns(emailCampaigns.filter(c => c.id !== campaignId));
            setView('list');
            setSelectedCampaign(null);
        }
    };

    const handleDuplicateAndEdit = (campaign: EmailCampaign) => {
        const newCampaign = {
            ...campaign,
            id: Date.now(),
            subject: `${campaign.subject} (Copie)`,
            status: 'Brouillon' as const,
        };
        setSelectedCampaign(newCampaign);
        setView('editor');
    };

    if (view === 'detail' && selectedCampaign) {
        return <AdminEmailCampaignDetail campaign={selectedCampaign} onBack={() => setView('list')} />;
    }

    if (view === 'editor') {
        return <AdminEmailCampaignEditor campaign={selectedCampaign} onSave={handleSaveCampaign} onBack={() => setView('list')} />;
    }

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <MegaphoneIcon className="w-7 h-7" />
                <span>Campagnes Email</span>
            </div>
        }>
            <div className="flex justify-end mb-4">
                <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark">
                    <PlusIcon className="w-5 h-5" />
                    Nouvelle Campagne
                </button>
            </div>

            <div className="bg-white/30 dark:bg-black/20 rounded-xl shadow-md overflow-hidden border border-white/20 dark:border-black/30">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="p-4 font-semibold">Sujet</th>
                                <th className="p-4 font-semibold">Date d'envoi</th>
                                <th className="p-4 font-semibold">Statut</th>
                                <th className="p-4 font-semibold">Destinataires</th>
                                <th className="p-4 font-semibold">Taux d'ouverture</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emailCampaigns.map(campaign => (
                                <tr key={campaign.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                                    <td className="p-4 font-semibold cursor-pointer" onClick={() => handleViewDetails(campaign)}>{campaign.subject}</td>
                                    <td className="p-4">{new Date(campaign.sendDate).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            campaign.status === 'Envoyé' ? 'bg-green-100 text-green-800' :
                                            campaign.status === 'Brouillon' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{campaign.recipientCount.toLocaleString()}</td>
                                    <td className="p-4">{campaign.openRate}%</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => handleEdit(campaign)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></button>
                                            <button onClick={() => handleDeleteCampaign(campaign.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminEmailCampaigns;