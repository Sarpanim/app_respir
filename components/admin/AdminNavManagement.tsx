
import React, { useState, useMemo, CSSProperties } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { NavItem, ThemeColors } from '../../types';
import { AVAILABLE_ICONS, PRO_ICONS, DEFAULT_MOBILE_NAV_ITEMS, DEFAULT_HEADER_NAV_ITEMS, DEFAULT_THEME_COLORS } from '../../constants';
import { DevicePhoneMobileIcon, XMarkIcon, ArrowUpTrayIcon, ImageIcon, ChevronDownIcon, ComputerDesktopIcon, Bars3Icon, ArrowPathIcon, CheckIcon } from '../Icons';
import DynamicIcon from '../DynamicIcon';
import UrlSelector from './UrlSelector';


const MobileNavPreview: React.FC<{ items: NavItem[]; colors: ThemeColors }> = ({ items, colors }) => {
    const activeItems = useMemo(() => {
        return items.filter(item => item.active).sort((a, b) => a.position - b.position).slice(0, 5);
    }, [items]);
    
    return (
        <nav style={{ backgroundColor: colors['nav-bg-dark'] }} className="border border-white/10 rounded-2xl">
            <div className="flex justify-around items-center h-20 px-4">
                {activeItems.map(item => (
                    <div key={item.id} className="flex flex-col items-center justify-center w-full text-sm font-medium" style={{color: colors['nav-text-inactive-dark']}}>
                        <DynamicIcon icon={item.icon} className="w-7 h-7 mb-1" />
                        <span className="text-center text-xs leading-tight">{item.label}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
};

const HeaderNavPreview: React.FC<{ items: NavItem[]; colors: ThemeColors }> = ({ items, colors }) => {
    const activeItems = useMemo(() => {
        return items.filter(item => item.active).sort((a, b) => a.position - b.position);
    }, [items]);

    return (
        <nav style={{ backgroundColor: colors['nav-bg-dark'] }} className="border border-white/10 rounded-lg p-4">
            <div className="flex justify-center items-center gap-6 h-10">
                {activeItems.map(item => (
                    <div key={item.id} className="flex items-center gap-1 text-sm font-semibold" style={{color: colors['nav-text-inactive-dark']}}>
                        <span>{item.label}</span>
                        {item.hasMegaMenu && <ChevronDownIcon className="w-4 h-4" />}
                    </div>
                ))}
            </div>
        </nav>
    );
};

// Fix: Define IconPickerModal to resolve "Cannot find name 'IconPickerModal'" error.
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


const AdminNavManagement: React.FC = () => {
    const { mobileNavItems, updateMobileNavItems, headerNavItems, updateHeaderNavItems, generalSettings, updateGeneralSettings } = useAppContext();
    const [localMobileItems, setLocalMobileItems] = useState<NavItem[]>(JSON.parse(JSON.stringify(mobileNavItems)));
    const [localHeaderItems, setLocalHeaderItems] = useState<NavItem[]>(JSON.parse(JSON.stringify(headerNavItems)));
    const [localThemeColors, setLocalThemeColors] = useState<ThemeColors>(JSON.parse(JSON.stringify(generalSettings.themeColors)));
    
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [editingIconState, setEditingIconState] = useState<{ type: 'mobile' | 'header', id: string } | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    
    const activeMobileItemCount = useMemo(() => localMobileItems.filter(item => item.active).length, [localMobileItems]);
    
    const sortedMobileItems = useMemo(() => [...localMobileItems].sort((a, b) => a.position - b.position), [localMobileItems]);
    const sortedHeaderItems = useMemo(() => [...localHeaderItems].sort((a, b) => a.position - b.position), [localHeaderItems]);

    const handleUpdateItem = (type: 'mobile' | 'header', id: string, field: keyof NavItem, value: any) => {
        const setFn = type === 'mobile' ? setLocalMobileItems : setLocalHeaderItems;
        setFn(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    
    const handleSetMegaMenuTrigger = (idToSet: string) => {
        setLocalHeaderItems(prev => prev.map(item => ({ ...item, hasMegaMenu: item.id === idToSet ? !item.hasMegaMenu : false })));
    };

    const handleMove = (type: 'mobile' | 'header', index: number, direction: 'up' | 'down') => {
        const items = type === 'mobile' ? sortedMobileItems : sortedHeaderItems;
        const setFn = type === 'mobile' ? setLocalMobileItems : setLocalHeaderItems;
        
        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        const updatedItemsWithPosition = newItems.map((item, idx) => ({ ...item, position: idx + 1 }));
        setFn(updatedItemsWithPosition);
    };

    const openIconPicker = (type: 'mobile' | 'header', itemId: string) => {
        setEditingIconState({ type, id: itemId });
        setIsIconPickerOpen(true);
    };

    const handleIconSelect = (iconData: string) => {
        if (editingIconState) {
            handleUpdateItem(editingIconState.type, editingIconState.id, 'icon', iconData);
        }
        setIsIconPickerOpen(false);
        setEditingIconState(null);
    };
    
    const handleSaveChanges = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateMobileNavItems(localMobileItems);
            updateHeaderNavItems(localHeaderItems);
            updateGeneralSettings({ ...generalSettings, themeColors: localThemeColors });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const handleReset = () => {
        if (window.confirm("Êtes-vous sûr de vouloir réinitialiser les navigations à leur configuration par défaut ?")) {
            setLocalMobileItems(JSON.parse(JSON.stringify(DEFAULT_MOBILE_NAV_ITEMS)));
            setLocalHeaderItems(JSON.parse(JSON.stringify(DEFAULT_HEADER_NAV_ITEMS)));
            setLocalThemeColors(JSON.parse(JSON.stringify(DEFAULT_THEME_COLORS)));
        }
    };
    
    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        setLocalThemeColors(prev => ({ ...prev, [key]: value }));
    };

    const inputClasses = "text-sm w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20";
    
    return (
        <AdminPageLayout title="Gestion de la Navigation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Bureau --- */}
                <div className="space-y-4">
                    <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><ComputerDesktopIcon className="w-6 h-6"/> Navigation Bureau</h3>
                        <div className="space-y-3">
                             {sortedHeaderItems.map((item, index) => (
                                <div key={item.id} className={`p-3 bg-black/5 dark:bg-white/5 rounded-lg space-y-3 transition-all ${!item.active ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col"><button onClick={() => handleMove('header', index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4 rotate-180"/></button><button onClick={() => handleMove('header', index, 'down')} disabled={index === sortedHeaderItems.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4"/></button></div>
                                        <input type="text" value={item.label} onChange={e => handleUpdateItem('header', item.id, 'label', e.target.value)} placeholder="Libellé" className={`${inputClasses} flex-grow`} />
                                    </div>
                                    <div>
                                        <UrlSelector value={item.link} onChange={newUrl => handleUpdateItem('header', item.id, 'link', newUrl)} />
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
                                        <div className="flex items-center gap-2"><label className="text-xs font-semibold">Mega Menu</label><button onClick={() => handleSetMegaMenuTrigger(item.id)} className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${item.hasMegaMenu ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${item.hasMegaMenu ? 'translate-x-5' : 'translate-x-1'}`} /></button></div>
                                        <div className="flex items-center gap-2"><label className="text-xs font-semibold">Actif</label><button onClick={() => handleUpdateItem('header', item.id, 'active', !item.active)} className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${item.active ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-5' : 'translate-x-1'}`} /></button></div>
                                    </div>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>

                {/* --- Mobile --- */}
                 <div className="space-y-4">
                    <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2"><DevicePhoneMobileIcon className="w-6 h-6"/> Navigation Mobile</h3>
                            <span className={`text-sm font-semibold ${activeMobileItemCount > 5 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>{activeMobileItemCount}/5 actifs</span>
                        </div>
                        <div className="space-y-3">
                            {sortedMobileItems.map((item, index) => (
                                <div key={item.id} className={`p-3 bg-black/5 dark:bg-white/5 rounded-lg space-y-3 transition-all ${!item.active ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col"><button onClick={() => handleMove('mobile', index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4 rotate-180"/></button><button onClick={() => handleMove('mobile', index, 'down')} disabled={index === sortedMobileItems.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4"/></button></div>
                                        <input type="text" value={item.label} onChange={e => handleUpdateItem('mobile', item.id, 'label', e.target.value)} placeholder="Libellé" className={`${inputClasses} flex-grow`} />
                                        <button onClick={() => openIconPicker('mobile', item.id)} className={`${inputClasses} flex items-center justify-between flex-shrink-0 w-28`}><span className="truncate max-w-[80px]">{item.icon.startsWith('data:') ? 'Perso.' : item.icon}</span><DynamicIcon icon={item.icon} className="w-5 h-5" /></button>
                                    </div>
                                    <div>
                                        <UrlSelector value={item.link} onChange={newUrl => handleUpdateItem('mobile', item.id, 'link', newUrl)} />
                                    </div>
                                    <div className="flex items-center justify-end pt-2 border-t border-black/10 dark:border-white/10">
                                        <div className="flex items-center gap-2"><label className="text-xs font-semibold">Actif</label><button onClick={() => handleUpdateItem('mobile', item.id, 'active', !item.active)} className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${item.active ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-5' : 'translate-x-1'}`} /></button></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>

                 {/* --- Apparence & Previews --- */}
                 <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                        <h3 className="font-bold text-lg mb-4">Apparence</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fond Nav. (Clair)</label>
                                <input type="color" value={localThemeColors['nav-bg-light']} onChange={e => handleColorChange('nav-bg-light', e.target.value)} className="w-full h-10 p-1 bg-transparent border border-black/20 dark:border-white/20 rounded-lg"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fond Nav. (Sombre)</label>
                                <input type="color" value={localThemeColors['nav-bg-dark']} onChange={e => handleColorChange('nav-bg-dark', e.target.value)} className="w-full h-10 p-1 bg-transparent border border-black/20 dark:border-white/20 rounded-lg"/>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Prévisualisation Bureau (Sombre)</h3>
                        <HeaderNavPreview items={localHeaderItems} colors={localThemeColors} />
                    </div>
                     <div className="space-y-4">
                         <h3 className="font-bold text-lg">Prévisualisation Mobile (Sombre)</h3>
                         <MobileNavPreview items={localMobileItems} colors={localThemeColors} />
                    </div>
                 </div>

            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button onClick={handleSaveChanges} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'}`}>
                    {saveStatus === 'idle' && 'Enregistrer'}
                    {saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}
                    {saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}
                </button>
                <button onClick={handleReset} className="w-full px-4 py-3 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg font-semibold">
                    Réinitialiser
                </button>
            </div>
            {isIconPickerOpen && <IconPickerModal onSelect={handleIconSelect} onClose={() => setIsIconPickerOpen(false)} />}
        </AdminPageLayout>
    );
};

export default AdminNavManagement;
