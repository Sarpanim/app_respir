import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { EmailCampaign } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '../Icons';
import AdminEmailCampaignEditor from './AdminEmailCampaignEditor';
import AdminEmailCampaignDetail from './AdminEmailCampaignDetail';

const mockCampaigns: EmailCampaign[] = [
    { id: 1, name: "Lancement Nouveau Cours Yoga", subject: "Nouveau : Le Yoga Énergisant du Matin est là !", content: "Bonjour {{user.name}},\n\nNous sommes ravis de vous présenter notre tout nouveau cours ! Il est conçu pour vous aider à démarrer votre journée avec énergie et sérénité.\n\nCliquez ici pour le découvrir : [Lien vers le cours]\n\nÀ très bientôt sur RESPIR,\nL'équipe", sendDate: "2023-10-15", target: "Tous", status: "Envoyé", openRate: 25.4, clickRate: 5.1 },
    { id: 2, name: "Promo Annuelle Premium", subject: "Économisez 25% sur l'abonnement Premium", content: "Profitez de notre offre exclusive...", sendDate: "2023-11-01", target: "Premium", status: "Programmé", },
    { id: 3, name: "Réactivation Inactifs", subject: "On s'ennuie de vous...", content: "Cela fait un moment que nous ne vous avons pas vu...", sendDate: "2023-09-20", target: "Inactifs > 30j", status: "Envoyé", openRate: 12.8, clickRate: 1.2 },
    { id: 4, name: "Newsletter Octobre", subject: "Nos astuces pour un automne serein", content: "Découvrez nos conseils pour...", sendDate: "2023-10-25", target: "Tous", status: "Brouillon" },
    { id: 5, name: "Erreur de paiement", subject: "Action requise : problème de paiement", content: "Il semble y avoir un problème avec votre dernier paiement...", sendDate: "2023-10-10", target: "Standard", status: "Échec" },
];

const AdminEmailCampaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
    const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
    const [viewingCampaign, setViewingCampaign] = useState<EmailCampaign | null>(null);

    const handleSaveCampaign = (campaign: EmailCampaign) => {
        if (campaign.id === 0) { // New campaign
            const newCampaign = { ...campaign, id: campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1 };
            setCampaigns([...campaigns, newCampaign]);
        } else { // Editing existing
            setCampaigns(campaigns.map(c => c.id === campaign.id ? campaign : c));
        }
        setEditingCampaign(null);
    };

    const handleDeleteCampaign = (campaignId: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette campagne ?")) {
            setCampaigns(campaigns.filter(c => c.id !== campaignId));
            if (viewingCampaign && viewingCampaign.id === campaignId) {
                setViewingCampaign(null);
            }
        }
    };

    const handleCreateNew = () => {
        setEditingCampaign({
            id: 0,
            name: '',
            subject: '',
            content: '',
            sendDate: new Date().toISOString().split('T')[0],
            target: 'Tous',
            status: 'Brouillon',
        });
    };

    const handleDuplicateAndEdit = (campaign: EmailCampaign) => {
        const duplicatedCampaign = {
            ...campaign,
            id: 0,
            name: `${campaign.name} (Copie)`,
            status: 'Brouillon' as const,
            sendDate: new Date().toISOString().split('T')[0],
            openRate: undefined,
            clickRate: undefined,
        };
        setViewingCampaign(null);
        setEditingCampaign(duplicatedCampaign);
    };

    if (viewingCampaign) {
        return (
            <AdminEmailCampaignDetail 
                campaign={viewingCampaign}
                onBack={() => setViewingCampaign(null)}
                onDuplicate={handleDuplicateAndEdit}
                onDelete={handleDeleteCampaign}
            />
        );
    }

    if (editingCampaign) {
        return (
            <AdminEmailCampaignEditor
                campaign={editingCampaign}
                onSave={handleSaveCampaign}
                onCancel={() => setEditingCampaign(null)}
            />
        );
    }
    
    const getStatusBadge = (status: EmailCampaign['status']) => {
        switch (status) {
            case 'Envoyé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Programmé': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Brouillon': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            case 'Échec': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };

    return (
        <AdminPageLayout title="Campagnes Email">
            <div className="flex justify-end mb-4">
                <button onClick={handleCreateNew} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                    <PlusIcon className="w-5 h-5" /> Nouvelle Campagne
                </button>
            </div>
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-black/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="px-4 py-3">Nom</th>
                                <th className="px-4 py-3">Date d'envoi</th>
                                <th className="px-4 py-3">Cible</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3">Taux Ouv.</th>
                                <th className="px-4 py-3">Taux Clic</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-dark-text">
                            {campaigns.map((campaign) => (
                                <tr key={campaign.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0">
                                    <td className="px-4 py-3 font-semibold">{campaign.name}</td>
                                    <td className="px-4 py-3">{new Date(campaign.sendDate).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-4 py-3">{campaign.target}</td>
                                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusBadge(campaign.status)}`}>{campaign.status}</span></td>
                                    <td className="px-4 py-3">{campaign.openRate ? `${campaign.openRate}%` : 'N/A'}</td>
                                    <td className="px-4 py-3">{campaign.clickRate ? `${campaign.clickRate}%` : 'N/A'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => setViewingCampaign(campaign)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Aperçu"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setEditingCampaign(campaign)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Modifier"><PencilIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteCampaign(campaign.id)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Supprimer"><TrashIcon className="w-5 h-5 text-red-500" /></button>
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