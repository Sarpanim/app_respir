import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { AmbiencePageSettings } from '../../types';
import { PaintBrushIcon, CheckIcon, ArrowPathIcon, XMarkIcon, ArrowUpTrayIcon, ImageIcon, ChevronDownIcon } from '../Icons';
import { DEFAULT_AMBIENCE_PAGE_SETTINGS, AVAILABLE_ICONS, PRO_ICONS } from '../../constants';
import DynamicIcon from '../DynamicIcon';
import UrlSelector from './UrlSelector';

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

const AdminAmbienceDisplayManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings, ambienceCategories } = useAppContext();
    const [settings, setSettings] = useState<AmbiencePageSettings>(() => {
        const initialSettings = JSON.parse(JSON.stringify(generalSettings.ambiencePageSettings));
        const allCategoryIds = new Set(ambienceCategories.map(c => c.id));
        const settingsCategoryIds = new Set(initialSettings.categories.map(c => c.id));

        allCategoryIds.forEach(id => {
            if (!settingsCategoryIds.has(id)) {
                initialSettings.categories.push({ id, enabled: true });
            }
        });
        initialSettings.categories = initialSettings.categories.filter(c => allCategoryIds.has(c.id));
        
        if (!initialSettings.allCategory) {
            initialSettings.allCategory = { enabled: true, icon: 'SoundWaveIcon' };
        }
        
        // Ensure new fields exist on older settings objects
        if (typeof initialSettings.gridColumns === 'undefined') {
            initialSettings.gridColumns = DEFAULT_AMBIENCE_PAGE_SETTINGS.gridColumns;
        }
        if (typeof initialSettings.showNewReleases === 'undefined') {
            initialSettings.showNewReleases = DEFAULT_AMBIENCE_PAGE_SETTINGS.showNewReleases;
        }
        if (typeof initialSettings.newReleasesCount === 'undefined') {
            initialSettings.newReleasesCount = DEFAULT_AMBIENCE_PAGE_SETTINGS.newReleasesCount;
        }
        if (typeof initialSettings.featuredSection === 'undefined') {
            initialSettings.featuredSection = DEFAULT_AMBIENCE_PAGE_SETTINGS.featuredSection;
        }
        
        return initialSettings;
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [openSections, setOpenSections] = useState<string[]>(['page-sections']);

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateGeneralSettings({ ...generalSettings, ambiencePageSettings: settings });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const handleReset = () => {
        if (window.confirm("Réinitialiser les paramètres d'affichage par défaut ?")) {
            setSettings(JSON.parse(JSON.stringify(DEFAULT_AMBIENCE_PAGE_SETTINGS)));
        }
    };

    const handleToggle = (key: keyof AmbiencePageSettings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    const handleSettingChange = (key: keyof AmbiencePageSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleToggleCategory = (categoryId: number) => {
        const newCategories = settings.categories.map(cat => 
            cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
        );
        handleSettingChange('categories', newCategories);
    };
    
    const openIconPicker = () => {
        setIsIconPickerOpen(true);
    };

    const handleIconSelect = (iconName: string) => {
        handleSettingChange('allCategory', { ...settings.allCategory, icon: iconName });
        setIsIconPickerOpen(false);
    };

    const handleFeaturedSectionChange = (field: string, value: any) => {
        setSettings(p => ({...p, featuredSection: {...p.featuredSection, [field]: value}}));
    }
    const handleFeaturedImageChange = (field: string, value: any) => {
        setSettings(p => ({...p, featuredSection: {...p.featuredSection, image: {...p.featuredSection.image, [field]: value}}}));
    }
     const handleFeaturedButtonChange = (field: string, value: any) => {
        setSettings(p => ({...p, featuredSection: {...p.featuredSection, button: {...p.featuredSection.button!, [field]: value}}}));
    }
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handleFeaturedImageChange('url', reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    const handleToggleSection = (id: string) => setOpenSections(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);

    const OptionButton: React.FC<{label: string, value: string, current: string, onClick: () => void}> = ({ label, value, current, onClick }) => (
        <button onClick={onClick} className={`px-3 py-1.5 text-sm rounded-md font-semibold capitalize ${value === current ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/10'}`}>{label}</button>
    );

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
    
    const ToggleRow: React.FC<{label: string, enabled: boolean, onToggle: () => void}> = ({label, enabled, onToggle}) => (
        <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg">
            <label className="font-medium text-gray-800 dark:text-gray-300">{label}</label>
            <button onClick={onToggle} className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-accent' : 'bg-gray-400'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
    
    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent";

    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><PaintBrushIcon className="w-7 h-7" /><span>Gestion page Ambiance</span></div>}>
            <div className="space-y-6">
                <Section title="Catégorie 'Toutes'">
                    <ToggleRow label="Afficher la catégorie 'Toutes'" enabled={settings.allCategory.enabled} onToggle={() => handleSettingChange('allCategory', { ...settings.allCategory, enabled: !settings.allCategory.enabled })} />
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-between">
                        <label className="font-medium text-gray-800 dark:text-gray-300">Icône</label>
                        <button onClick={openIconPicker} className="bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 flex items-center gap-2">
                            <DynamicIcon icon={settings.allCategory.icon} className="w-6 h-6" />
                            <span className="text-sm">Changer</span>
                        </button>
                    </div>
                </Section>
                <Section title="Catégories">
                    <ToggleRow label="Activer l'effet de survol" enabled={settings.categoryHoverEffectEnabled} onToggle={() => handleToggle('categoryHoverEffectEnabled')} />
                    <div>
                        <label className="font-medium text-gray-800 dark:text-gray-300 block mb-2">Catégories visibles</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {ambienceCategories.map(cat => {
                                const setting = settings.categories.find(c => c.id === cat.id);
                                const isEnabled = setting ? setting.enabled : true;
                                return (
                                    <div key={cat.id} className="p-2 bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-between">
                                        <span className="text-sm font-semibold">{cat.name}</span>
                                        <button onClick={() => handleToggleCategory(cat.id)} className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${isEnabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-1'}`} /></button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Section>

                <div className="bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-black/30"><div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => handleToggleSection('page-sections')}><h3 className="font-bold text-lg">Sections de la page</h3><ChevronDownIcon className={`w-5 h-5 transition-transform ${openSections.includes('page-sections') ? 'rotate-180' : ''}`} /></div>{openSections.includes('page-sections') && (<div className="p-3 border-t border-black/10 dark:border-white/10 space-y-4"><ToggleRow label="Afficher la section 'Nouveautés'" enabled={settings.showNewReleases} onToggle={() => handleToggle('showNewReleases')} />{settings.showNewReleases && (
                <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg space-y-2 animate-fade-in">
                    <label className="font-medium text-sm text-gray-800 dark:text-gray-300" htmlFor="newReleasesCount">
                        Nombre de nouveautés à afficher
                    </label>
                    <input
                        id="newReleasesCount"
                        type="number"
                        value={settings.newReleasesCount}
                        onChange={e => handleSettingChange('newReleasesCount', parseInt(e.target.value) || 1)}
                        className={inputClasses}
                        min="1"
                        max="12"
                    />
                </div>
            )}<div className="bg-black/5 dark:bg-white/5 rounded-lg"><div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => handleToggleSection('featured-section')}><label className="font-medium text-gray-800 dark:text-gray-300">Section 'Mise en avant' (Image & Texte)</label><div className="flex items-center gap-4"><button onClick={(e) => { e.stopPropagation(); handleFeaturedSectionChange('enabled', !settings.featuredSection.enabled); }} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.featuredSection.enabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.featuredSection.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button><ChevronDownIcon className={`w-5 h-5 transition-transform ${openSections.includes('featured-section') ? 'rotate-180' : ''}`} /></div></div>{openSections.includes('featured-section') && (<div className="p-3 border-t border-black/10 dark:border-white/10 space-y-4">{settings.featuredSection.enabled && (<div className="space-y-4 animate-fade-in"><div><label className="block text-sm font-medium mb-1">Titre</label><input type="text" value={settings.featuredSection.title} onChange={e => handleFeaturedSectionChange('title', e.target.value)} className={inputClasses} /></div><div><label className="block text-sm font-medium mb-1">Description</label><textarea value={settings.featuredSection.description} onChange={e => handleFeaturedSectionChange('description', e.target.value)} rows={3} className={inputClasses} /></div><div className="flex gap-2 flex-wrap">{['left', 'center', 'right'].map(align => (<OptionButton key={align} label={align} value={align} current={settings.featuredSection.textAlign} onClick={() => handleFeaturedSectionChange('textAlign', align)} />))}</div><div><label className="block text-sm font-medium mb-1">Image URL</label><div className="flex items-center gap-2"><input type="text" value={settings.featuredSection.image.url} onChange={e => handleFeaturedImageChange('url', e.target.value)} className={inputClasses} /><input type="file" id="featured-img-upload" accept="image/*" className="hidden" onChange={handleImageUpload} /><label htmlFor="featured-img-upload" className="cursor-pointer p-2.5 bg-accent/80 text-white rounded-lg"><ArrowUpTrayIcon className="w-5 h-5"/></label></div></div><div className="flex gap-2 flex-wrap">{['left', 'right'].map(pos => (<OptionButton key={pos} label={pos} value={pos} current={settings.featuredSection.image.position} onClick={() => handleFeaturedImageChange('position', pos)} />))}</div><div className="border-t border-black/10 dark:border-white/10 pt-4"><div className="flex items-center justify-between mb-2"><label className="font-medium">Bouton</label><button onClick={() => handleFeaturedButtonChange('enabled', !settings.featuredSection.button?.enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.featuredSection.button?.enabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.featuredSection.button?.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>{settings.featuredSection.button?.enabled && (<div className="space-y-3"><input type="text" value={settings.featuredSection.button.text} onChange={e => handleFeaturedButtonChange('text', e.target.value)} placeholder="Texte du bouton" className={inputClasses}/><UrlSelector value={settings.featuredSection.button.url} onChange={newUrl => handleFeaturedButtonChange('url', newUrl)} /></div>)}</div></div>)}</div>)}</div></div>)}</div>

                <Section title="Affichage des Ambiances">
                    <div>
                        <label className="font-medium text-gray-800 dark:text-gray-300 block mb-2">Mise en page</label>
                        <div className="flex gap-2 flex-wrap">
                            <OptionButton label="Liste" value="list" current={settings.layout} onClick={() => handleSettingChange('layout', 'list')} />
                            <OptionButton label="Grille" value="grid" current={settings.layout} onClick={() => handleSettingChange('layout', 'grid')} />
                            <OptionButton label="Présentation 2" value="grid-presentation-2" current={settings.layout} onClick={() => handleSettingChange('layout', 'grid-presentation-2')} />
                        </div>
                    </div>
                    {(settings.layout === 'grid' || settings.layout === 'grid-presentation-2') && (
                        <div className="space-y-4 animate-fade-in">
                             <div className="border-t border-black/10 dark:border-white/10 pt-4">
                                <label className="font-medium text-gray-800 dark:text-gray-300 block mb-2">Taille des cartes (Nombre de colonnes)</label>
                                <div className="flex gap-2 flex-wrap">
                                    <OptionButton label="Grande (3)" value="3" current={String(settings.gridColumns)} onClick={() => handleSettingChange('gridColumns', 3)} />
                                    <OptionButton label="Moyenne (4)" value="4" current={String(settings.gridColumns)} onClick={() => handleSettingChange('gridColumns', 4)} />
                                    <OptionButton label="Petite (5)" value="5" current={String(settings.gridColumns)} onClick={() => handleSettingChange('gridColumns', 5)} />
                                </div>
                            </div>
                            <div className="border-t border-black/10 dark:border-white/10 pt-4">
                                <label className="font-medium text-gray-800 dark:text-gray-300 block mb-2">Ratio des cartes (Grille)</label>
                                <div className="flex gap-2 flex-wrap">
                                    <OptionButton label="1:1" value="1:1" current={settings.gridCardRatio} onClick={() => handleSettingChange('gridCardRatio', '1:1')} />
                                    <OptionButton label="4:3" value="4:3" current={settings.gridCardRatio} onClick={() => handleSettingChange('gridCardRatio', '4:3')} />
                                    <OptionButton label="16:9" value="16:9" current={settings.gridCardRatio} onClick={() => handleSettingChange('gridCardRatio', '16:9')} />
                                    <OptionButton label="2:1" value="2:1" current={settings.gridCardRatio} onClick={() => handleSettingChange('gridCardRatio', '2:1')} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="border-t border-black/10 dark:border-white/10 pt-4">
                         <ToggleRow label="Activer l'effet de survol sur les cartes" enabled={settings.cardHoverEffectEnabled} onToggle={() => handleToggle('cardHoverEffectEnabled')} />
                    </div>
                </Section>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button onClick={handleSave} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'} ${saveStatus !== 'idle' ? 'cursor-not-allowed' : ''}`}>
                        {saveStatus === 'idle' && 'Enregistrer'}
                        {saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}
                        {saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}
                    </button>
                    <button onClick={handleReset} className="w-full px-4 py-3 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg font-semibold">
                        Réinitialiser
                    </button>
                </div>
            </div>
            {isIconPickerOpen && <IconPickerModal onSelect={handleIconSelect} onClose={() => setIsIconPickerOpen(false)} />}
        </AdminPageLayout>
    );
};

export default AdminAmbienceDisplayManagement;