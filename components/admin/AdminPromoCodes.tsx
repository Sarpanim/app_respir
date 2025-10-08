import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { PromoCode, SubscriptionPlanId, SubscriptionPlan } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon, CalendarDaysIcon, CheckCircleIcon, ChartBarIcon, SparklesIcon } from '../Icons';
import PromoToggle from './PromoToggle';
import { v4 as uuidv4 } from 'uuid';

const AdminPromoCodes: React.FC = () => {
    const { promoCodes, updatePromoCodes, subscriptionPlans } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

    const openModal = (promo: PromoCode | null = null) => {
        setEditingPromo(promo ? { ...promo } : {
            id: uuidv4(),
            code: '',
            type: 'percentage',
            value: 10,
            status: 'active',
            usageLimit: null,
            startDate: null,
            endDate: null,
            applicablePlanIds: [],
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPromo(null);
    };

    const handleSave = () => {
        if (!editingPromo) return;
        const existing = promoCodes.find(p => p.id === editingPromo.id);
        if (existing) {
            updatePromoCodes(promoCodes.map(p => p.id === editingPromo.id ? editingPromo : p));
        } else { 
            updatePromoCodes([...promoCodes, editingPromo]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) {
            updatePromoCodes(promoCodes.filter(p => p.id !== id));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingPromo) return;
        const { name, value } = e.target;
        setEditingPromo({ ...editingPromo, [name]: name === 'value' || name === 'usageLimit' ? Number(value) : value });
    };
    
    const handleApplicablePlansChange = (planId: SubscriptionPlanId) => {
        if (!editingPromo) return;
        const newPlanIds = editingPromo.applicablePlanIds.includes(planId)
            ? editingPromo.applicablePlanIds.filter(id => id !== planId)
            : [...editingPromo.applicablePlanIds, planId];
        setEditingPromo({ ...editingPromo, applicablePlanIds: newPlanIds });
    };

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <SparklesIcon className="w-7 h-7" />
                <span>Gestion des Codes Promo</span>
            </div>
        }>
            <div className="flex justify-end mb-4">
                <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark">
                    <PlusIcon className="w-5 h-5" />
                    Nouveau Code Promo
                </button>
            </div>

            <div className="bg-white/30 dark:bg-black/20 rounded-xl shadow-md overflow-hidden border border-white/20 dark:border-black/30">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="p-4 font-semibold">Code</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Valeur</th>
                                <th className="p-4 font-semibold">Statut</th>
                                <th className="p-4 font-semibold">Utilisations</th>
                                <th className="p-4 font-semibold">Validité</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promoCodes.map(promo => (
                                <tr key={promo.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                                    <td className="p-4 font-mono font-bold">{promo.code}</td>
                                    <td className="p-4">{promo.type === 'percentage' ? 'Pourcentage' : 'Montant Fixe'}</td>
                                    <td className="p-4">{promo.type === 'percentage' ? `${promo.value}%` : `${promo.value}€`}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {promo.status === 'active' ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="p-4">{promo.usageLimit ? `${promo.usageCount || 0} / ${promo.usageLimit}` : 'Illimité'}</td>
                                    <td className="p-4 text-xs">
                                        {promo.startDate && `Du ${new Date(promo.startDate).toLocaleDateString()}`}
                                        {promo.endDate && ` au ${new Date(promo.endDate).toLocaleDateString()}`}
                                        {!promo.startDate && !promo.endDate && 'Permanent'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => openModal(promo)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></button>
                                            <button onClick={() => handleDelete(promo.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && editingPromo && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold font-elsie">{promoCodes.find(p => p.id === editingPromo.id) ? 'Modifier le Code Promo' : 'Nouveau Code Promo'}</h3>
                            <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                                    <input type="text" name="code" value={editingPromo.code} onChange={handleInputChange} className="w-full input-style" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                                    <select name="status" value={editingPromo.status} onChange={handleInputChange} className="w-full input-style">
                                        <option value="active">Actif</option>
                                        <option value="inactive">Inactif</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de réduction</label>
                                    <select name="type" value={editingPromo.type} onChange={handleInputChange} className="w-full input-style">
                                        <option value="percentage">Pourcentage</option>
                                        <option value="fixed">Montant Fixe</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valeur</label>
                                    <input type="number" name="value" value={editingPromo.value} onChange={handleInputChange} className="w-full input-style" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Limite d'utilisation (laisser vide pour illimité)</label>
                                    <input type="number" name="usageLimit" value={editingPromo.usageLimit || ''} onChange={handleInputChange} className="w-full input-style" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de début</label>
                                    <input type="date" name="startDate" value={editingPromo.startDate || ''} onChange={handleInputChange} className="w-full input-style" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de fin</label>
                                    <input type="date" name="endDate" value={editingPromo.endDate || ''} onChange={handleInputChange} className="w-full input-style" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Applicable aux abonnements (laisser vide pour tous)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {subscriptionPlans.map((plan: SubscriptionPlan) => (
                                        <PromoToggle 
                                            key={plan.id}
                                            planName={plan.name.fr}
                                            planIcon={plan.icon}
                                            planIconColor={plan.iconColor}
                                            isSelected={editingPromo.applicablePlanIds.includes(plan.id)}
                                            onToggle={() => handleApplicablePlansChange(plan.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex justify-end gap-3">
                            <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Annuler</button>
                            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-accent text-white font-semibold">Sauvegarder</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminPromoCodes;