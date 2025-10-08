import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { NavItem } from '../../types';
import { AVAILABLE_ICONS, PRO_ICONS, DEFAULT_MOBILE_NAV_ITEMS } from '../../constants';
import { DevicePhoneMobileIcon, XMarkIcon, ArrowUpTrayIcon, ImageIcon, ChevronDownIcon } from '../Icons';
import DynamicIcon from '../DynamicIcon';
import UrlSelector from './UrlSelector';

const MobileNavPreview: React.FC<{ items: NavItem[], bgColor: string }> = ({ items, bgColor }) => {
    const activeItems = useMemo(() => {
        return items
            .filter(item => item.active)
            .sort((a, b) => a.position - b.position)
            .slice(0, 5);
    }, [items]);

    return (
        <nav className={`border border-white/10 rounded-2xl ${bgColor}`}>
            <div className="flex justify-around items-center h-20 px-4">
                {activeItems.map(item => (
                    <div key={item.id} className="flex flex-col items-center justify-center w-full text-sm font-medium text-gray-400">
                        <DynamicIcon icon={item.icon} className="w-7 h-7 mb-1" />
                        <span className="text-center text-xs leading-tight">{item.label}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
};

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

const AdminMobileNavManagement: React.FC = () => {
    const { mobileNavItems, updateMobileNavItems, generalSettings, updateGeneralSettings } = useAppContext();
    const [localMobileItems, setLocalMobileItems] = useState<NavItem[]>(JSON.parse(JSON.stringify(mobileNavItems)));
    const [localBgColor, setLocalBgColor] = useState(generalSettings.mobileNavBgColor);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [editingIconItemId, setEditingIconItemId] = useState<string | null>(null);
    
    const activeMobileItemCount = useMemo(() => localMobileItems.filter(item => item.active).length, [localMobileItems]);
    const sortedMobileItems = useMemo(() => [...localMobileItems].sort((a, b) => a.position - b.position), [localMobileItems]);

    const handleUpdateItem = (id: string, field: keyof NavItem, value: any) => {
        setLocalMobileItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    
    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...sortedMobileItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        const updatedItemsWithPosition = newItems.map((item, idx) => ({ ...item, position: idx + 1 }));
        setLocalMobileItems(updatedItemsWithPosition);
    };

    const openIconPicker = (itemId: string) => {
        setEditingIconItemId(itemId);
        setIsIconPickerOpen(true);
    };

    const handleIconSelect = (iconName: string) => {
        if (editingIconItemId) {
            handleUpdateItem(editingIconItemId, 'icon', iconName);
        }
        setIsIconPickerOpen(false);
        setEditingIconItemId(null);
    };
    
    const handleSaveChanges = () => {
        updateMobileNavItems(localMobileItems);
        updateGeneralSettings({ ...generalSettings, mobileNavBgColor: localBgColor });
        alert("Navigation mobile sauvegardée !");
    };

    const handleReset = () => {
        if (window.confirm("Êtes-vous sûr de vouloir réinitialiser la navigation mobile à sa configuration par défaut ?")) {
            setLocalMobileItems(JSON.parse(JSON.stringify(DEFAULT_MOBILE_NAV_ITEMS)));
            setLocalBgColor('bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg');
        }
    };

    return (
        <AdminPageLayout title="Gestion de la Navigation Mobile (Menu bas)">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">Éléments de navigation</h3>
                            <span className={`text-sm font-semibold ${activeMobileItemCount > 5 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>{activeMobileItemCount}/5 actifs</span>
                        </div>
                        <div className="space-y-3">
                            {sortedMobileItems.map((item, index) => (
                                <div key={item.id} className={`p-4 bg-black/5 dark:bg-white/5 rounded-lg flex items-start gap-3 transition-all ${!item.active ? 'opacity-50' : ''}`}>
                                    <div className="flex flex-col self-center flex-shrink-0">
                                        <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4 rotate-180"/></button>
                                        <button onClick={() => handleMove(index, 'down')} disabled={index === sortedMobileItems.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4"/></button>
                                    </div>
                                    <div className="flex-grow space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Libellé</label>
                                                <input type="text" value={item.label} onChange={e => handleUpdateItem(item.id, 'label', e.target.value)} className="text-sm bg-white/50 dark:bg-black/30 p-2 rounded-md border border-black/20 dark:border-white/20 w-full" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Icône</label>
                                                <button onClick={() => openIconPicker(item.id)} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-md border border-black/20 dark:border-white/20 text-sm flex items-center justify-between">
                                                    <span className="truncate max-w-[80px]">{item.icon.startsWith('data:') ? 'Perso.' : item.icon}</span>
                                                    <DynamicIcon icon={item.icon} className="w-5 h-5 ml-2" />
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Route</label>
                                            <UrlSelector value={item.link} onChange={newUrl => handleUpdateItem(item.id, 'link', newUrl)} />
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Actif</label>
                                            <button onClick={() => handleUpdateItem(item.id, 'active', !item.active)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${item.active ? 'bg-accent' : 'bg-gray-400'}`}>
                                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="lg:col-span-2">
                    <div className="sticky top-28 space-y-6">
                         <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl space-y-3">
                             <h3 className="font-bold text-lg">Apparence</h3>
                             <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Classes de fond (Tailwind)</label>
                                <input type="text" value={localBgColor} onChange={e => setLocalBgColor(e.target.value)} className="text-sm bg-white/50 dark:bg-black/30 p-2.5 rounded-md border border-black/20 dark:border-white/20 w-full font-mono"/>
                                <p className="text-xs text-gray-500 mt-1">Inclure les classes pour les modes clair et sombre. Ex: `bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg`</p>
                             </div>
                        </div>
                        <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl space-y-3">
                             <h3 className="font-bold text-lg">Prévisualisation</h3>
                            <MobileNavPreview items={localMobileItems} bgColor={localBgColor} />
                        </div>
                        <div className="flex flex-col gap-3">
                             <button onClick={handleSaveChanges} className="w-full px-4 py-2.5 bg-accent text-white rounded-lg font-semibold">
                                Enregistrer
                            </button>
                            <button onClick={handleReset} className="w-full px-4 py-2.5 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg font-semibold">
                                Réinitialiser par défaut
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isIconPickerOpen && <IconPickerModal onSelect={handleIconSelect} onClose={() => setIsIconPickerOpen(false)} />}
        </AdminPageLayout>
    );
};

export default AdminMobileNavManagement;