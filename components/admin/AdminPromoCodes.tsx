

import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { PromoCode, SubscriptionPlanId } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon, CalendarDaysIcon, CheckCircleIcon, ChartBarIcon, SparklesIcon } from '../Icons';
import PromoToggle from './PromoToggle';
import { useAppContext } from '../../context/AppContext';

const ITEMS_PER_PAGE = 5;

const EditModal: React.FC<{
    editingCode: Partial<PromoCode> | null;
    setEditingCode: React.Dispatch<React.SetStateAction<Partial<PromoCode> | null>>;
    onClose: () => void;
    onSave: () => void;
}> = ({ editingCode, setEditingCode, onClose, onSave }) => {
    const { subscriptionPlans } = useAppContext();
    if (!editingCode) return null;
    const isNewCode = !('id' in editingCode);

    const handleApplicablePlanChange = (planId: SubscriptionPlanId) => {
        let current = editingCode.applicablePlanIds;
        if (current === 'all') {
            current = [];
        }

        let newApplicable: SubscriptionPlanId[] = [];
        if (Array.isArray(current) && current.includes(planId)) {
            newApplicable = current.filter(id => id !== planId);
        } else if (Array.isArray(current)) {
            newApplicable = [...current, planId];
        }

        if (newApplicable.length === 0 || newApplicable.length === subscriptionPlans.filter(p=> p.id !== 'free').length) {
            setEditingCode({ ...editingCode, applicablePlanIds: 'all' });
        } else {
            setEditingCode({ ...editingCode, applicablePlanIds: newApplicable });
        }
    };

    const handleSelectAllPlans = () => {
        setEditingCode({ ...editingCode, applicablePlanIds: 'all' });
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-light-bg dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-2xl m-4 relative border border-black/20 dark:border-white/20">
                <h3 className="text-xl font-elsie font-bold mb-6 text-gray-800 dark:text-white">
                    {isNewCode ? "Nouveau code promo" : "Modifier le code promo"}
                </h3>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"> <XMarkIcon className="w-6 h-6" /> </button>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b border-black/10 dark:border-white/10 pb-1">Informations générales</h4>
                        <div>
                            <label className="input-label">Nom du code promo</label>
                            <input type="text" placeholder="Saisir le code promo" className="input-style" value={editingCode.code} onChange={(e) => setEditingCode({ ...editingCode, code: e.target.value.toUpperCase() })} />
                        </div>
                    </div>
                     <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b border-black/10 dark:border-white/10 pb-1">Apparence</h4>
                        <div>
                            <label className="input-label">Couleur du texte du code</label>
                            <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/30 rounded-lg border border-black/20 dark:border-white/20">
                                <input
                                    type="color"
                                    value={editingCode?.textColor || '#A0AEC0'}
                                    onChange={(e) => setEditingCode(prev => ({ ...prev, textColor: e.target.value }))}
                                    className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={editingCode?.textColor || '#A0AEC0'}
                                    onChange={(e) => setEditingCode(prev => ({ ...prev, textColor: e.target.value }))}
                                    className="w-full bg-transparent font-mono text-sm focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b border-black/10 dark:border-white/10 pb-1">Paramètres de réduction</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="input-label">Type</label>
                                <select value={editingCode.type} onChange={(e) => setEditingCode({ ...editingCode, type: e.target.value as 'percentage' | 'fixed' })} className="input-style">
                                    <option value="percentage">Pourcentage (%)</option>
                                    <option value="fixed">Montant fixe (€)</option>
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Valeur</label>
                                <input type="number" placeholder="10" className="input-style text-right" value={editingCode.value ?? ''} onChange={(e) => setEditingCode({ ...editingCode, value: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="input-label">Statut</label>
                                <select value={editingCode.status} onChange={(e) => setEditingCode({ ...editingCode, status: e.target.value as 'active' | 'inactive' })} className="input-style">
                                    <option value="active">Actif</option>
                                    <option value="inactive">Désactivé</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b border-black/10 dark:border-white/10 pb-1">Limite d’utilisation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Utilisations autorisées</label>
                                <input type="number" placeholder="∞ si illimité" className="input-style" value={editingCode.usageLimit ?? ''} onChange={(e) => setEditingCode({ ...editingCode, usageLimit: e.target.value ? Number(e.target.value) : null })} />
                            </div>
                            <div>
                                <label className="input-label">Utilisations effectuées</label>
                                <input type="number" disabled className="input-style disabled:bg-black/10 dark:disabled:bg-black/40" value={editingCode.usageCount} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b border-black/10 dark:border-white/10 pb-1">Validité</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Date de début</label>
                                <input type="date" className="input-style" value={editingCode.startDate} onChange={(e) => setEditingCode({ ...editingCode, startDate: e.target.value })} />
                            </div>
                            <div>
                                <label className="input-label">Date de fin</label>
                                <input type="date" className="input-style" value={editingCode.endDate} onChange={(e) => setEditingCode({ ...editingCode, endDate: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b border-black/10 dark:border-white/10 pb-1">Formules applicables</h4>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={handleSelectAllPlans} className={`px-3 py-1 text-sm rounded-full border ${editingCode.applicablePlanIds === 'all' ? 'bg-accent text-white border-accent' : 'bg-transparent border-gray-400 text-gray-600 dark:text-gray-300'}`}>Toutes</button>
                            {subscriptionPlans.filter(p => p.id !== 'free').map(plan => (
                                <button key={plan.id} onClick={() => handleApplicablePlanChange(plan.id)} className={`px-3 py-1 text-sm rounded-full border ${Array.isArray(editingCode.applicablePlanIds) && editingCode.applicablePlanIds.includes(plan.id) ? 'bg-accent text-white border-accent' : 'bg-transparent border-gray-400 text-gray-600 dark:text-gray-300'}`}>
                                    {plan.name.fr}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-8">
                    <button onClick={onClose} className="px-5 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold">Annuler</button>
                    <button onClick={onSave} className="px-5 py-2.5 bg-accent text-white rounded-lg font-semibold">Enregistrer</button>
                </div>
            </div>
        </div>
    );
}

const DeleteModal: React.FC<{
    codeToDelete: PromoCode | null;
    deleteConfirmText: string;
    setDeleteConfirmText: (text: string) => void;
    onClose: () => void;
    onDelete: () => void;
}> = ({ codeToDelete, deleteConfirmText, setDeleteConfirmText, onClose, onDelete }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-light-bg dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm m-4 relative border border-red-500/50">
            <h3 className="text-lg font-elsie font-bold mb-2 text-red-600 dark:text-red-500">Supprimer le code</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Pour confirmer, veuillez taper <strong className="text-red-500">{codeToDelete?.code}</strong>.
            </p>
            <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500" />
            <div className="flex justify-end space-x-3 mt-6">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold">Annuler</button>
                <button onClick={onDelete} disabled={deleteConfirmText !== codeToDelete?.code} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold disabled:bg-red-400 disabled:cursor-not-allowed">Supprimer</button>
            </div>
        </div>
    </div>
);


const AdminPromoCodes: React.FC = () => {
    const { promoCodes, updatePromoCodes } = useAppContext();
    
    // UI State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCode, setEditingCode] = useState<Partial<PromoCode> | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [codeToDelete, setCodeToDelete] = useState<PromoCode | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    
    // Filtering & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const openAddModal = () => {
        setEditingCode({
            code: '',
            type: 'percentage',
            value: 10,
            status: 'active',
            usageCount: 0,
            usageLimit: 100,
            applicablePlanIds: 'all',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
            textColor: '#A0AEC0',
        });
        setShowEditModal(true);
    };

    const openEditModal = (code: PromoCode) => {
        setEditingCode(JSON.parse(JSON.stringify(code)));
        setShowEditModal(true);
    };
    
    const openDeleteModal = (code: PromoCode) => {
        setCodeToDelete(code);
        setShowDeleteModal(true);
    };

    const handleToggleActive = (codeId: number, newIsActive: boolean) => {
        updatePromoCodes(promoCodes.map(c => 
            c.id === codeId 
            ? { ...c, status: newIsActive ? 'active' : 'inactive' } 
            : c
        ));
    };
    
    const handleDelete = () => {
        if (codeToDelete && deleteConfirmText === codeToDelete.code) {
            updatePromoCodes(promoCodes.filter(p => p.id !== codeToDelete.id));
            setShowDeleteModal(false);
            setCodeToDelete(null);
            setDeleteConfirmText('');
        } else {
            alert('Le code ne correspond pas.');
        }
    };
    
    const handleSave = () => {
        if (!editingCode || !editingCode.code) return;
        const isEditing = 'id' in editingCode && promoCodes.some(c => c.id === editingCode.id);
        if (isEditing) {
            updatePromoCodes(promoCodes.map(c => c.id === editingCode.id ? editingCode as PromoCode : c));
        } else {
            const newId = promoCodes.length > 0 ? Math.max(...promoCodes.map(c => c.id)) + 1 : 1;
            updatePromoCodes([...promoCodes, { ...editingCode, id: newId } as PromoCode]);
        }
        setShowEditModal(false);
        setEditingCode(null);
    };

    const getStatusInfo = (code: PromoCode) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(code.endDate);
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);

        if (endDate < today) {
            return { text: 'Expiré', badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
        }
        if (code.usageLimit !== null && code.usageCount >= code.usageLimit) {
            return { text: 'Épuisé', badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
        }
        if (code.status === 'inactive') {
             return { text: 'Désactivé', badge: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
        }
        if (endDate <= sevenDaysFromNow) {
            return { text: 'Expire bientôt', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' };
        }
        return { text: 'Actif', badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    };

    const filteredCodes = useMemo(() => {
        return promoCodes
            .filter(code => code.code.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(code => {
                if (statusFilter === 'all') return true;
                const statusInfo = getStatusInfo(code);
                if (statusFilter === 'active') return statusInfo.text === 'Actif' || statusInfo.text === 'Expire bientôt';
                if (statusFilter === 'expired') return statusInfo.text === 'Expiré' || statusInfo.text === 'Épuisé';
                if (statusFilter === 'inactive') return statusInfo.text === 'Désactivé';
                return true;
            });
    }, [promoCodes, searchTerm, statusFilter]);

    const paginatedCodes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCodes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCodes, currentPage]);

    const totalPages = Math.ceil(filteredCodes.length / ITEMS_PER_PAGE);
    
    const stats = useMemo(() => {
        const activeCodes = promoCodes.filter(c => getStatusInfo(c).text === 'Actif' || getStatusInfo(c).text === 'Expire bientôt').length;
        const totalUses = promoCodes.reduce((sum, c) => sum + c.usageCount, 0);
        const lastCreated = [...promoCodes].sort((a, b) => b.id - a.id)[0];
        return { activeCodes, totalUses, lastCreated: lastCreated?.code || 'N/A' };
    }, [promoCodes]);
    
    // Components
    const ProgressBar: React.FC<{ value: number; max: number | null }> = ({ value, max }) => {
        if (max === null) return <span className="text-xs font-mono">{value} / ∞</span>;
        const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
        return (
            <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-accent h-2 rounded-full" style={{ width: `${percentage}%` }}></div></div>
                <span className="text-xs font-mono">{value}/{max}</span>
            </div>
        );
    };

    const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
        <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl flex items-center gap-4">
            <div className={`p-3 rounded-full ${color}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );

    const FilterButton: React.FC<{label: string; filterValue: string}> = ({label, filterValue}) => (
        <button onClick={() => setStatusFilter(filterValue)} className={`px-3 py-1.5 text-sm rounded-md font-semibold ${statusFilter === filterValue ? 'bg-accent text-white' : 'bg-white/40 dark:bg-black/20 text-gray-600 dark:text-gray-300'}`}>{label}</button>
    )

    return (
        <AdminPageLayout title="Gestion des Codes Promo">
            <style>{`.input-style { width: 100%; background-color: rgba(255, 255, 255, 0.5); padding: 0.5rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); } .dark .input-style { background-color: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.1); } .input-style:focus { outline: none; box-shadow: 0 0 0 2px var(--tw-ring-color); --tw-ring-color: #64B6AC; } .input-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #4a5568; } .dark .input-label { color: #d1d5db; }`}</style>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-green-500"/>} label="Codes Actifs" value={stats.activeCodes} color="bg-green-500/10" />
                <StatCard icon={<ChartBarIcon className="w-6 h-6 text-blue-500"/>} label="Utilisations Totales" value={stats.totalUses} color="bg-blue-500/10" />
                <StatCard icon={<SparklesIcon className="w-6 h-6 text-purple-500"/>} label="Dernier Créé" value={stats.lastCreated} color="bg-purple-500/10" />
            </div>
            
            <div className="mb-4 p-4 bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-black/30 flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-1/3">
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher un code..." className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="flex-grow flex items-center gap-2">
                    <FilterButton label="Tous" filterValue="all" />
                    <FilterButton label="Actifs" filterValue="active" />
                    <FilterButton label="Expirés" filterValue="expired" />
                    <FilterButton label="Désactivés" filterValue="inactive" />
                </div>
                <button onClick={openAddModal} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors w-full md:w-auto"> <PlusIcon className="w-5 h-5" /> Ajouter un code </button>
            </div>
            
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-black/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Réduction</th>
                                <th className="px-4 py-3">Application</th>
                                <th className="px-4 py-3">Validité</th>
                                <th className="px-4 py-3">Utilisation</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-dark-text">
                            {paginatedCodes.map((code) => {
                                const statusInfo = getStatusInfo(code);
                                const isToggleOn = statusInfo.text === 'Actif' || statusInfo.text === 'Expire bientôt';
                                const isToggleDisabled = statusInfo.text === 'Expiré' || statusInfo.text === 'Épuisé';

                                return (
                                <tr key={code.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0">
                                    <td className="px-4 py-4 font-semibold font-mono">{code.code}</td>
                                    <td className="px-4 py-4 font-mono">{code.type === 'percentage' ? `-${code.value}%` : `-${code.value.toFixed(2)}€`}</td>
                                    <td className="px-4 py-4 text-xs">{code.applicablePlanIds === 'all' ? <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">Toutes</span> : <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full">{code.applicablePlanIds.join(', ')}</span>}</td>
                                    <td className="px-4 py-4 text-xs flex items-center gap-1.5 text-gray-600 dark:text-gray-400"><CalendarDaysIcon className="w-4 h-4"/><span>{new Date(code.startDate).toLocaleDateString('fr-FR')} → {new Date(code.endDate).toLocaleDateString('fr-FR')}</span></td>
                                    <td className="px-4 py-4"><ProgressBar value={code.usageCount} max={code.usageLimit} /></td>
                                    <td className="px-4 py-4"><span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusInfo.badge}`}>{statusInfo.text}</span></td>
                                    <td className="px-4 py-4 flex items-center justify-end gap-2">
                                        <PromoToggle
                                            initialActive={isToggleOn}
                                            expired={isToggleDisabled}
                                            onToggle={(newValue) => handleToggleActive(code.id, newValue)}
                                        />
                                        <button onClick={() => openEditModal(code)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Éditer"><PencilIcon className="w-4 h-4" /></button>
                                        <button onClick={() => openDeleteModal(code)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Supprimer"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                     <div className="p-4 flex justify-between items-center text-sm border-t border-black/10 dark:border-white/10">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-white/50 dark:bg-black/30 disabled:opacity-50">Précédent</button>
                        <span>Page {currentPage} sur {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md bg-white/50 dark:bg-black/30 disabled:opacity-50">Suivant</button>
                    </div>
                )}
            </div>
            {showEditModal && <EditModal 
                editingCode={editingCode}
                setEditingCode={setEditingCode}
                onClose={() => setShowEditModal(false)}
                onSave={handleSave}
            />}
            {showDeleteModal && <DeleteModal 
                codeToDelete={codeToDelete}
                deleteConfirmText={deleteConfirmText}
                setDeleteConfirmText={setDeleteConfirmText}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                }}
                onDelete={handleDelete}
            />}
        </AdminPageLayout>
    );
};

export default AdminPromoCodes;