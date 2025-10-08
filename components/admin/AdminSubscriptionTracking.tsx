

import React, { useState, useMemo, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { AVAILABLE_ICONS, PRO_ICONS } from '../../constants';
import { SubscriptionPlan, SubscriptionPlanId } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon, StarIcon, UserGroupIcon, ArrowUpTrayIcon, ImageIcon, CreditCardIcon, GiftIcon } from '../Icons';
import { useAppContext } from '../../context/AppContext';
import DynamicIcon from '../DynamicIcon';

type Lang = 'fr' | 'en' | 'es';


const IconPickerModal: React.FC<{ onSelect: (iconName: string) => void; onClose: () => void; }> = ({ onSelect, onClose }) => {
    const [activeTab, setActiveTab] = useState('library');
    const [searchTerm, setSearchTerm] = useState('');
    const [customSvg, setCustomSvg] = useState('');

    const filteredIcons = useMemo(() => {
        if (activeTab === 'custom') return [];
        const sourceIcons = activeTab === 'library' ? AVAILABLE_ICONS : PRO_ICONS;
        if (!searchTerm) return Object.entries(sourceIcons).sort(([a], [b]) => a.localeCompare(b));
        return Object.entries(sourceIcons).filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase())).sort(([a], [b]) => a.localeCompare(b));
    }, [searchTerm, activeTab]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCustomSvg(event.target?.result as string);
            };
            reader.readAsText(file);
        } else {
            alert("Veuillez sélectionner un fichier .svg valide.");
        }
    };
    
    const selectCustomSvg = () => {
        if (!customSvg.trim().startsWith('<svg')) {
            alert("Le code SVG semble invalide. Il doit commencer par `<svg...`.");
            return;
        }
        try {
            const unescapedSvg = decodeURIComponent(encodeURIComponent(customSvg));
            const base64Svg = btoa(unescapedSvg);
            const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;
            onSelect(dataUrl);
        } catch (error) {
            console.error("Error encoding SVG:", error);
            alert("Erreur lors de l'encodage du SVG. Assurez-vous que le code est valide.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-2xl shadow-2xl w-full max-w-3xl m-4 relative border border-black/20 dark:border-white/20 flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="flex-shrink-0">
                    <h3 className="text-xl font-elsie font-bold mb-4">Choisir une icône</h3>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                    
                    <div className="border-b border-black/10 dark:border-white/10 mb-4">
                        <button onClick={() => setActiveTab('library')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'library' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Bibliothèque</button>
                        <button onClick={() => setActiveTab('pro')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'pro' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Pro</button>
                        <button onClick={() => setActiveTab('custom')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'custom' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Personnalisé</button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto pr-2">
                    {activeTab !== 'custom' && (
                        <div>
                            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Rechercher une icône..." className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 mb-4 focus:outline-none focus:ring-2 focus:ring-accent" />
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                                {filteredIcons.map(([name, IconComponent]: [string, React.FC<{className?: string}>]) => (
                                    <button key={name} onClick={() => onSelect(name)} className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title={name}>
                                        <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                                        <span className="text-xs text-gray-500 truncate">{name}</span>
                                    </button>
                                ))}
                                {filteredIcons.length === 0 && <p className="col-span-full text-center text-gray-500">Aucune icône trouvée.</p>}
                            </div>
                        </div>
                    )}
                    {activeTab === 'custom' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold mb-2">Coller le code SVG</label>
                                <textarea value={customSvg} onChange={e => setCustomSvg(e.target.value)} placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>' className="w-full flex-grow bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
                            </div>
                             <div className="flex flex-col items-center justify-center gap-4">
                                 <h4 className="text-sm font-semibold">...ou téléverser un fichier</h4>
                                 <input id="svg-upload" type="file" accept="image/svg+xml" onChange={handleFileUpload} className="hidden" />
                                 <label htmlFor="svg-upload" className="w-full flex flex-col items-center justify-center gap-2 p-6 bg-black/5 dark:bg-white/5 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-accent hover:text-accent">
                                    <ArrowUpTrayIcon className="w-8 h-8"/>
                                    <span>Choisir un fichier .svg</span>
                                 </label>
                                 <h4 className="text-sm font-semibold mt-4">Aperçu</h4>
                                 <div className="w-24 h-24 p-4 bg-black/10 dark:bg-white/10 rounded-lg flex items-center justify-center">
                                    {customSvg.trim() ? (
                                        <div className="w-full h-full text-accent" dangerouslySetInnerHTML={{ __html: customSvg }} />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                    )}
                                 </div>
                                 <button onClick={selectCustomSvg} disabled={!customSvg.trim()} className="w-full mt-4 px-4 py-2 bg-accent text-white rounded-lg font-semibold disabled:bg-gray-400">Utiliser cette icône</button>
                             </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EditModal: React.FC<{
    editingPlan: Partial<SubscriptionPlan> | null;
    setEditingPlan: React.Dispatch<React.SetStateAction<Partial<SubscriptionPlan> | null>>;
    editLang: Lang;
    setEditLang: React.Dispatch<React.SetStateAction<Lang>>;
    onClose: () => void;
    onSave: () => void;
    onOpenIconPicker: () => void;
}> = ({ editingPlan, setEditingPlan, editLang, setEditLang, onClose, onSave, onOpenIconPicker }) => {

    useEffect(() => {
        if (!editingPlan) return;

        const monthlyPriceStr = editingPlan.price || '0';
        const monthsOffered = editingPlan.monthsOfferedAnnual || 0;
        
        const priceMatch = monthlyPriceStr.match(/(\d+[,.]\d+)/);
        const monthlyPrice = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : 0;
        
        if (monthlyPrice > 0 && monthsOffered > 0 && monthsOffered < 12) {
            const annualPrice = monthlyPrice * (12 - monthsOffered);
            const monthlyEquivalent = annualPrice / 12;

            const newPriceAnnual = `${annualPrice.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}€ / an`;
            const newPriceAnnualMonthlyEquivalent = `${monthlyEquivalent.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}€/mois`;

            if (newPriceAnnual !== editingPlan.priceAnnual || newPriceAnnualMonthlyEquivalent !== editingPlan.priceAnnualMonthlyEquivalent) {
                setEditingPlan(prev => ({
                    ...prev,
                    priceAnnual: newPriceAnnual,
                    priceAnnualMonthlyEquivalent: newPriceAnnualMonthlyEquivalent,
                }));
            }
        }
    }, [editingPlan?.price, editingPlan?.monthsOfferedAnnual]);


    const handleFeatureChange = (index: number, value: string) => {
        if (editingPlan && editingPlan.features) {
            const newFeatures = { ...editingPlan.features };
            newFeatures[editLang][index] = value;
            setEditingPlan({ ...editingPlan, features: newFeatures });
        }
    };

    const addFeature = () => {
        if (editingPlan && editingPlan.features) {
            const newFeatures = { ...editingPlan.features };
            newFeatures[editLang].push('');
            setEditingPlan({ ...editingPlan, features: newFeatures });
        }
    };

    const removeFeature = (index: number) => {
        if (editingPlan && editingPlan.features) {
            const newFeatures = { ...editingPlan.features };
            newFeatures[editLang] = newFeatures[editLang].filter((_, i) => i !== index);
            setEditingPlan({ ...editingPlan, features: newFeatures });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-light-bg dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md m-4 relative border border-black/20 dark:border-white/20">
            <h3 className="text-xl font-elsie font-bold mb-4 text-gray-800 dark:text-white">
              {editingPlan?.id ? "Modifier la formule" : "Nouvelle formule"}
            </h3>
             <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"> <XMarkIcon className="w-6 h-6" /> </button>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Icône</label>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-lg flex items-center justify-center">
                            {editingPlan?.icon ? <DynamicIcon icon={editingPlan.icon} className="w-8 h-8" style={{ color: editingPlan.iconColor || '#00A388' }} /> : <div className="w-8 h-8 bg-gray-400 rounded" />}
                        </div>
                        <button onClick={onOpenIconPicker} className="text-accent text-sm font-semibold hover:underline">Modifier l'icône</button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Couleur de l'icône</label>
                    <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/30 rounded-lg border border-black/20 dark:border-white/20">
                        <input
                            type="color"
                            value={editingPlan?.iconColor || '#00A388'}
                            onChange={(e) => setEditingPlan(prev => ({ ...prev, iconColor: e.target.value }))}
                            className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                        />
                        <input
                            type="text"
                            value={editingPlan?.iconColor || '#00A388'}
                            onChange={(e) => setEditingPlan(prev => ({ ...prev, iconColor: e.target.value }))}
                            className="w-full bg-transparent font-mono text-sm focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Typographie du Titre</label>
                    <select
                        value={editingPlan?.titleFont || 'Montserrat'}
                        onChange={(e) => setEditingPlan(prev => ({ ...prev, titleFont: e.target.value }))}
                        className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="Montserrat">Montserrat (Défaut)</option>
                        <option value="Elsie">Elsie</option>
                        <option value="Dancing Script">Dancing Script</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Taille du Titre</label>
                    <select
                        value={editingPlan?.titleSize || 'text-xl'}
                        onChange={(e) => setEditingPlan(prev => ({ ...prev, titleSize: e.target.value }))}
                        className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="text-lg">Large (lg)</option>
                        <option value="text-xl">Extra Large (xl)</option>
                        <option value="text-2xl">2x Extra Large (2xl)</option>
                        <option value="text-3xl">3x Extra Large (3xl)</option>
                        <option value="text-4xl">4x Extra Large (4xl)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Couleur du Titre</label>
                    <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/30 rounded-lg border border-black/20 dark:border-white/20">
                        <input
                            type="color"
                            value={editingPlan?.titleColor || '#FFFFFF'}
                            onChange={(e) => setEditingPlan(prev => ({ ...prev, titleColor: e.target.value }))}
                            className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                        />
                        <input
                            type="text"
                            value={editingPlan?.titleColor || '#FFFFFF'}
                            onChange={(e) => setEditingPlan(prev => ({ ...prev, titleColor: e.target.value }))}
                            className="w-full bg-transparent font-mono text-sm focus:outline-none"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Prix mensuel (ex: 2,99€ / mois)" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" value={editingPlan?.price} onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}/>
                    <div className="relative">
                        <input type="number" placeholder="Mois offerts" title="Mois offerts pour l'annuel" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" value={editingPlan?.monthsOfferedAnnual || ''} onChange={(e) => setEditingPlan({ ...editingPlan, monthsOfferedAnnual: parseInt(e.target.value) || 0 })}/>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Prix annuel (calculé)" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70" disabled value={editingPlan?.priceAnnual} onChange={(e) => setEditingPlan({ ...editingPlan, priceAnnual: e.target.value })}/>
                    <input type="text" placeholder="Équivalent mensuel (calculé)" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70" disabled value={editingPlan?.priceAnnualMonthlyEquivalent} onChange={(e) => setEditingPlan({ ...editingPlan, priceAnnualMonthlyEquivalent: e.target.value })}/>
                </div>
                <div>
                    <div className="flex border-b border-black/20 dark:border-white/20 mb-2">
                        <button onClick={() => setEditLang('fr')} className={`px-4 py-2 text-sm font-semibold ${editLang === 'fr' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}>Français</button>
                        <button onClick={() => setEditLang('en')} className={`px-4 py-2 text-sm font-semibold ${editLang === 'en' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}>English</button>
                        <button onClick={() => setEditLang('es')} className={`px-4 py-2 text-sm font-semibold ${editLang === 'es' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}>Español</button>
                    </div>
                    <input type="text" placeholder={`Nom de la formule (${editLang})`} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent mb-3" value={editingPlan?.name?.[editLang]} onChange={(e) => setEditingPlan({ ...editingPlan, name: {...editingPlan?.name, [editLang]: e.target.value} as any })} />
                    <textarea placeholder={`Description (${editLang})`} rows={3} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent mb-3" value={editingPlan?.description?.[editLang]} onChange={(e) => setEditingPlan({ ...editingPlan, description: {...editingPlan?.description, [editLang]: e.target.value} as any })} />

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Avantages ({editLang})</label>
                        {editingPlan?.features?.[editLang].map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input type="text" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} />
                                <button onClick={() => removeFeature(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"> <TrashIcon className="w-5 h-5" /> </button>
                            </div>
                        ))}
                        <button onClick={addFeature} className="text-accent text-sm font-semibold flex items-center gap-1 mt-2"> <PlusIcon className="w-4 h-4" /> Ajouter un avantage </button>
                    </div>
                </div>
                <div className="mt-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                        <label htmlFor="showAnnualSavings" className="text-sm font-medium text-gray-800 dark:text-gray-300">Afficher l'économie</label>
                        <button onClick={() => setEditingPlan(prev => ({...prev, showAnnualSavings: !prev?.showAnnualSavings}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${editingPlan?.showAnnualSavings ? 'bg-accent' : 'bg-gray-400'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${editingPlan?.showAnnualSavings ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                    {editingPlan?.showAnnualSavings && (
                        <div className="mt-3 pt-3 border-t border-black/20 dark:border-white/20 space-y-3">
                             <input type="text" placeholder={`Texte de l'économie (${editLang})`} title="Utilisez %s pour la variable de prix" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" value={editingPlan?.annualSavingsText?.[editLang]} onChange={(e) => setEditingPlan({ ...editingPlan, annualSavingsText: {...editingPlan?.annualSavingsText, [editLang]: e.target.value} as any })} />
                             <div>
                                <label className="block text-xs font-medium text-gray-800 dark:text-gray-300 mb-1">Couleur du texte</label>
                                <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/30 rounded-lg border border-black/20 dark:border-white/20">
                                    <input type="color" value={editingPlan?.annualSavingsTextColor || '#00A388'} onChange={(e) => setEditingPlan(prev => ({ ...prev, annualSavingsTextColor: e.target.value }))} className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent" />
                                    <input type="text" value={editingPlan?.annualSavingsTextColor || '#00A388'} onChange={(e) => setEditingPlan(prev => ({ ...prev, annualSavingsTextColor: e.target.value }))} className="w-full bg-transparent font-mono text-sm focus:outline-none" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                 <div className="flex items-center justify-between mt-4 p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                    <label htmlFor="isPopular" className="text-sm font-medium text-gray-800 dark:text-gray-300">Mettre en avant (populaire)</label>
                    <button onClick={() => setEditingPlan(prev => ({...prev, isPopular: !prev?.isPopular}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${editingPlan?.isPopular ? 'bg-accent' : 'bg-gray-400'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${editingPlan?.isPopular ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold"> Annuler </button>
              <button onClick={onSave} className="px-4 py-2 bg-accent text-white rounded-lg font-semibold"> Enregistrer </button>
            </div>
          </div>
        </div>
    );
};

const DeleteModal: React.FC<{
    planToDelete: SubscriptionPlan | null;
    deleteConfirmText: string;
    setDeleteConfirmText: (text: string) => void;
    onClose: () => void;
    onDelete: () => void;
}> = ({ planToDelete, deleteConfirmText, setDeleteConfirmText, onClose, onDelete }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-light-bg dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm m-4 relative border border-red-500/50">
            <h3 className="text-lg font-elsie font-bold mb-2 text-red-600 dark:text-red-500">Supprimer la formule</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Cette action est irréversible. Pour confirmer, veuillez taper <strong className="text-red-500">{planToDelete?.name.fr}</strong> dans le champ ci-dessous.
            </p>
            <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500" />
            <div className="flex justify-end space-x-3 mt-6">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold">Annuler</button>
                <button onClick={onDelete} disabled={deleteConfirmText !== planToDelete?.name.fr} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold disabled:bg-red-400 disabled:cursor-not-allowed">Supprimer</button>
            </div>
        </div>
    </div>
);

const AdminSubscriptionTracking: React.FC = () => {
    const { generalSettings, subscriptionPlans, updateSubscriptionPlans, promoCodes } = useAppContext();
    
    // Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan> | null>(null);
    const [editLang, setEditLang] = useState<Lang>('fr');
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    const openAddModal = () => {
        setEditingPlan({
            name: { fr: '', en: '', es: '' },
            description: { fr: '', en: '', es: '' },
            icon: 'StarIcon',
            iconColor: '#00A388',
            price: '',
            priceAnnual: '',
            priceAnnualMonthlyEquivalent: '',
            monthsOfferedAnnual: 2,
            features: { fr: [''], en: [''], es: [''] },
            isActive: true,
            isPopular: false,
            userCount: 0,
            showAnnualSavings: true,
            annualSavingsText: { fr: 'Soit une économie de %s pour une année.', en: 'Save %s for a year.', es: 'Ahorra %s por un año.' },
            annualSavingsTextColor: '#00A388',
            titleFont: 'Montserrat',
            titleColor: '#FFFFFF',
            titleSize: 'text-xl',
        });
        setEditLang('fr');
        setShowEditModal(true);
    };

    const openEditModal = (plan: SubscriptionPlan) => {
        setEditingPlan(JSON.parse(JSON.stringify(plan))); // Deep copy
        setEditLang('fr');
        setShowEditModal(true);
    };
    
    const openDeleteModal = (plan: SubscriptionPlan) => {
        setPlanToDelete(plan);
        setShowDeleteModal(true);
    };
    
    const handleToggleActive = (planId: SubscriptionPlanId) => {
        updateSubscriptionPlans(subscriptionPlans.map(p => p.id === planId ? { ...p, isActive: !p.isActive } : p));
    };

    const handleDelete = () => {
        if (planToDelete && deleteConfirmText === planToDelete.name.fr) {
            updateSubscriptionPlans(subscriptionPlans.filter(p => p.id !== planToDelete.id));
            setShowDeleteModal(false);
            setPlanToDelete(null);
            setDeleteConfirmText('');
        } else {
            alert('Le nom de la formule ne correspond pas.');
        }
    };
    
    const handleSave = () => {
        if (!editingPlan || !editingPlan.name?.fr) return;

        const planToSave = { 
            ...editingPlan, 
            features: {
                fr: editingPlan.features?.fr.filter(f => f.trim() !== '') ?? [],
                en: editingPlan.features?.en.filter(f => f.trim() !== '') ?? [],
                es: editingPlan.features?.es.filter(f => f.trim() !== '') ?? [],
            }
        } as SubscriptionPlan;

        const isEditing = subscriptionPlans.some(p => p.id === planToSave.id);

        if (isEditing) {
            updateSubscriptionPlans(subscriptionPlans.map(p => p.id === planToSave.id ? planToSave : p));
        } else {
            const newPlanWithId = { ...planToSave, id: planToSave.name.fr.toLowerCase().replace(/\s+/g, '-') as SubscriptionPlanId };
            updateSubscriptionPlans([...subscriptionPlans, newPlanWithId]);
        }
        setShowEditModal(false);
        setEditingPlan(null);
    };

    const handleIconSelect = (iconData: string) => {
        if (editingPlan) {
            setEditingPlan(prev => prev ? { ...prev, icon: iconData } : null);
        }
        setIsIconPickerOpen(false);
    };

    return (
        <AdminPageLayout title={
            <div className="flex items-center justify-center gap-3">
                <CreditCardIcon className="w-7 h-7" />
                <span>Gestion des Formules</span>
            </div>
        }>
            <div className="flex justify-end mb-4">
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors"> <PlusIcon className="w-5 h-5" /> Ajouter une formule </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {subscriptionPlans.map((plan) => {
                    const applicablePromos = promoCodes.filter(code => {
                        const now = new Date();
                        const isActive = code.status === 'active';
                        const isDateValid = new Date(code.startDate) <= now && new Date(code.endDate) >= now;
                        const isUsageValid = code.usageLimit === null || code.usageCount < code.usageLimit;
                        const appliesToPlan = code.applicablePlanIds === 'all' || (Array.isArray(code.applicablePlanIds) && code.applicablePlanIds.includes(plan.id));
                
                        return isActive && isDateValid && isUsageValid && appliesToPlan;
                    });

                    return (
                        <div key={plan.id} className={`relative bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30 transition-all duration-300 flex flex-col ${!plan.isActive ? 'opacity-60' : ''}`}>
                            {plan.isPopular && <div className="absolute top-0 right-4 -translate-y-1/2 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"><StarIcon className="w-3 h-3"/> Populaire</div>}
                            
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-3">
                                        {plan.icon && <DynamicIcon icon={plan.icon} className="w-6 h-6" style={{ color: plan.iconColor || 'var(--color-accent)' }} />}
                                        <h3 className="font-bold text-xl font-elsie">{plan.name.fr}</h3>
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${plan.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                            {plan.isActive ? 'Actif' : 'Désactivé'}
                                        </span>
                                    </div>
                                    <p className="text-accent text-sm font-semibold">{plan.price} / {plan.priceAnnual}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => openEditModal(plan)} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Éditer"> <PencilIcon className="w-5 h-5 text-blue-500" /> </button>
                                    {plan.id !== 'free' && ( <button onClick={() => openDeleteModal(plan)} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Supprimer"> <TrashIcon className="w-5 h-5 text-red-500" /> </button> )}
                                </div>
                            </div>

                            {applicablePromos.length > 0 && (
                                <div className="flex items-center gap-2 mb-3 flex-wrap border-t border-b border-black/10 dark:border-white/10 py-2">
                                    <GiftIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                    {applicablePromos.map(promo => (
                                        <span key={promo.id} className="bg-secondary/20 text-secondary text-xs font-semibold px-2 py-0.5 rounded-full">
                                            {promo.code} ({promo.type === 'percentage' ? `-${promo.value}%` : `-${promo.value.toFixed(2)}€`})
                                        </span>
                                    ))}
                                </div>
                            )}

                            <ul className="text-sm text-gray-600 dark:text-gray-400 my-2 space-y-1.5 flex-grow">
                                {plan.features.fr.map((f, i) => <li key={i} className="flex items-start gap-2"><span className="text-accent">✓</span><span>{f}</span></li>)}
                            </ul>
                            
                            <div className="border-t border-black/10 dark:border-white/10 mt-4 pt-3 flex justify-between items-center">
                                {generalSettings.showUserCountOnPlans ? (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <UserGroupIcon className="w-5 h-5"/>
                                        <span>{plan.userCount.toLocaleString('fr-FR')} utilisateurs</span>
                                    </div>
                                ) : <div />}
                                {plan.id !== 'free' && (
                                    <button onClick={() => handleToggleActive(plan.id)} className={`px-3 py-1 text-xs font-semibold rounded-full ${plan.isActive ? 'bg-yellow-500/80 hover:bg-yellow-500/100 text-white' : 'bg-green-500/80 hover:bg-green-500/100 text-white'}`}>
                                        {plan.isActive ? 'Désactiver' : 'Activer'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {showEditModal && <EditModal 
                editingPlan={editingPlan}
                setEditingPlan={setEditingPlan}
                editLang={editLang}
                setEditLang={setEditLang}
                onClose={() => setShowEditModal(false)}
                onSave={handleSave}
                onOpenIconPicker={() => setIsIconPickerOpen(true)}
            />}
            {showDeleteModal && <DeleteModal 
                planToDelete={planToDelete}
                deleteConfirmText={deleteConfirmText}
                setDeleteConfirmText={setDeleteConfirmText}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                }}
                onDelete={handleDelete}
            />}
            {isIconPickerOpen && <IconPickerModal onSelect={handleIconSelect} onClose={() => setIsIconPickerOpen(false)} />}
        </AdminPageLayout>
    );
};

export default AdminSubscriptionTracking;