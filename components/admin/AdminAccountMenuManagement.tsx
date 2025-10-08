

import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { SettingsMenuItem, SettingsMenuAction } from '../../types';
import { AVAILABLE_ICONS, PRO_ICONS, DEFAULT_SETTINGS_MENU_ITEMS } from '../../constants';
import { UserIcon, XMarkIcon, ArrowUpTrayIcon, ImageIcon, ChevronDownIcon, ChevronRightIcon } from '../Icons';
import DynamicIcon from '../DynamicIcon';

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

const MenuPreview: React.FC<{ items: SettingsMenuItem[] }> = ({ items }) => {
    const { theme } = useTheme();

    const SECTION_ORDER = ['Compte', 'Application', 'Support', 'Social'];

    const grouped = useMemo(() => {
        const groups: Record<string, SettingsMenuItem[]> = {};
        items.filter(i => i.active).forEach(item => {
            if (!groups[item.section]) {
                groups[item.section] = [];
            }
            groups[item.section].push(item);
        });
        Object.values(groups).forEach(group => group.sort((a, b) => a.position - b.position));
        return groups;
    }, [items]);

    return (
        <div className="bg-dark-card rounded-2xl p-4 border border-white/10 text-white">
            {SECTION_ORDER.map((sectionTitle) => {
                const sectionItems = grouped[sectionTitle];
                if (!sectionItems || sectionItems.length === 0) {
                    return null;
                }
                return (
                    <div key={sectionTitle} className="mb-6 last:mb-0">
                        <h2 className="text-xl font-elsie font-bold text-gray-300 mb-2">{sectionTitle}</h2>
                        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/10">
                            {sectionItems.map(item => {
                                if (item.isToggle) {
                                    return (
                                        <div key={item.id} className="flex items-center justify-between p-3">
                                            <div className="flex items-center gap-3">
                                                <DynamicIcon icon={item.icon} className="w-5 h-5 text-accent" />
                                                <span className="font-semibold text-sm">{item.label}</span>
                                            </div>
                                            <div className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${theme === 'dark' ? 'bg-accent' : 'bg-gray-600'}`}>
                                                <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-1'}`} />
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div key={item.id} className="flex items-center justify-between p-3 border-b border-white/10 last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <DynamicIcon icon={item.icon} className="w-5 h-5 text-accent" />
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </div>
                                        {item.action && <ChevronRightIcon className="w-4 h-4 text-gray-400" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const AdminAccountMenuManagement: React.FC = () => {
    const { settingsMenuItems, updateSettingsMenuItems } = useAppContext();
    const [localMenuItems, setLocalMenuItems] = useState<SettingsMenuItem[]>(JSON.parse(JSON.stringify(settingsMenuItems)));
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [editingIconItemId, setEditingIconItemId] = useState<string | null>(null);

    const handleUpdateItem = (id: string, field: keyof SettingsMenuItem, value: any) => {
        setLocalMenuItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    
    const handleMoveItem = (sectionTitle: string, itemIndex: number, direction: 'up' | 'down') => {
        const newItems = [...localMenuItems];
        
        let sectionItems = newItems.filter(item => item.section === sectionTitle).sort((a, b) => a.position - b.position);
        
        const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
        if (targetIndex < 0 || targetIndex >= sectionItems.length) return;

        [sectionItems[itemIndex], sectionItems[targetIndex]] = [sectionItems[targetIndex], sectionItems[itemIndex]];

        const updatedSectionItems = sectionItems.map((item, index) => ({ ...item, position: index + 1 }));

        const otherItems = newItems.filter(item => item.section !== sectionTitle);
        setLocalMenuItems([...otherItems, ...updatedSectionItems]);
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
        updateSettingsMenuItems(localMenuItems);
        alert("Menu du compte sauvegardé !");
    };

    const handleReset = () => {
        if (window.confirm("Êtes-vous sûr de vouloir réinitialiser le menu à sa configuration par défaut ?")) {
            setLocalMenuItems(JSON.parse(JSON.stringify(DEFAULT_SETTINGS_MENU_ITEMS)));
        }
    };

    const groupedItems = useMemo(() => {
        const groups: Record<string, SettingsMenuItem[]> = { 'Compte': [], 'Application': [], 'Support': [], 'Social': [] };
        localMenuItems.forEach(item => {
            if (groups[item.section]) {
                groups[item.section].push(item);
            }
        });
        Object.values(groups).forEach(group => group.sort((a, b) => a.position - b.position));
        return groups;
    }, [localMenuItems]);

    const availableActions: (SettingsMenuAction | null)[] = [
        null, 'navigateToEditProfile', 'navigateToSubscription', 'navigateToNotifications', 'navigateToHelpFaq', 'navigateToContactSupport', 'navigateToPrivacyPolicy', 'navigateToAbout'
    ];

    const Title = () => (
        <div className="flex items-center justify-center gap-3">
            <UserIcon className="w-7 h-7" />
            <span>Gestion Menu Compte</span>
        </div>
    );

    return (
        <AdminPageLayout title={<Title />}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    {Object.keys(groupedItems).map((sectionTitle) => (
                        <div key={sectionTitle} className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                            <h3 className="font-bold text-lg mb-4">{sectionTitle}</h3>
                            <div className="space-y-2">
                                {groupedItems[sectionTitle].map((item, index) => (
                                    <div 
                                        key={item.id}
                                        className={`p-3 bg-black/5 dark:bg-white/5 rounded-lg flex items-center gap-4 transition-all ${!item.active ? 'opacity-50' : ''}`}
                                    >
                                        <div className="flex-shrink-0">
                                            {!item.isToggle && (
                                                <div className="flex flex-col">
                                                    <button onClick={() => handleMoveItem(sectionTitle, index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5 rotate-180"/></button>
                                                    <button onClick={() => handleMoveItem(sectionTitle, index, 'down')} disabled={index === groupedItems[sectionTitle].length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5"/></button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="text-xs font-medium">Libellé</label>
                                                <input type="text" value={item.label} onChange={e => handleUpdateItem(item.id, 'label', e.target.value)} className="w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 text-sm"/>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium">Icône</label>
                                                <button onClick={() => openIconPicker(item.id)} disabled={item.isToggle} className="w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 text-sm flex items-center justify-between disabled:opacity-50">
                                                    <span className="truncate max-w-[80px]">{item.icon.startsWith('data:') ? 'Perso.' : item.icon}</span>
                                                    <DynamicIcon icon={item.icon} className="w-5 h-5 ml-2" />
                                                </button>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium">Action</label>
                                                <select value={item.action || ''} onChange={e => handleUpdateItem(item.id, 'action', e.target.value || null)} className="w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 text-sm disabled:opacity-50" disabled={item.isToggle}>
                                                    {availableActions.map(action => <option key={action || 'null'} value={action || ''}>{action || 'Aucune'}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <button onClick={() => handleUpdateItem(item.id, 'active', !item.active)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${item.active ? 'bg-accent' : 'bg-gray-400'}`}>
                                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${item.active ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button onClick={handleSaveChanges} className="w-full px-4 py-3 bg-accent text-white rounded-lg font-semibold">
                            Enregistrer
                        </button>
                        <button onClick={handleReset} className="w-full px-4 py-3 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg font-semibold">
                            Réinitialiser
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="sticky top-28 space-y-4">
                        <h3 className="font-bold text-lg">Prévisualisation</h3>
                        <MenuPreview items={localMenuItems} />
                    </div>
                </div>
            </div>
            {isIconPickerOpen && <IconPickerModal onSelect={handleIconSelect} onClose={() => setIsIconPickerOpen(false)} />}
        </AdminPageLayout>
    );
};

export default AdminAccountMenuManagement;