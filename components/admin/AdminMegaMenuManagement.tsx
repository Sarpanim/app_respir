
import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { MegaMenu, MegaMenuColumn, MegaMenuLink, NavItem } from '../../types';
import { Bars3Icon, PlusIcon, TrashIcon, ChevronDownIcon, CheckIcon, ArrowPathIcon, ArrowUpTrayIcon, ImageIcon, XMarkIcon } from '../Icons';
import { DEFAULT_MEGA_MENU, AVAILABLE_ICONS, PRO_ICONS } from '../../constants';
import { v4 as uuidv4 } from 'uuid';
import DynamicIcon from '../DynamicIcon';
import UrlSelector from './UrlSelector';

const OptionButton: React.FC<{label: string, value: string, current: string, onClick: () => void}> = ({ label, value, current, onClick }) => (
    <button onClick={onClick} className={`px-3 py-1.5 text-xs rounded-md font-semibold capitalize ${value === current ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/10'}`}>{label}</button>
);

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


const AdminMegaMenuManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings, headerNavItems, updateHeaderNavItems } = useAppContext();
    const [localNavItems, setLocalNavItems] = useState<NavItem[]>(JSON.parse(JSON.stringify(headerNavItems)));
    const [menuConfig, setMenuConfig] = useState<MegaMenu>(JSON.parse(JSON.stringify(generalSettings.megaMenu)));
    const [openSections, setOpenSections] = useState<string[]>(['header-items', 'announcement', 'footer-link', ...menuConfig.columns.map(c => c.id)]);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    
    const sortedNavItems = useMemo(() => [...localNavItems].sort((a, b) => a.position - b.position), [localNavItems]);

    const handleToggleSection = (id: string) => {
        setOpenSections(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
    };
    
    const handleUpdateHeaderItem = (id: string, field: keyof NavItem, value: any) => setLocalNavItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    const handleSetMegaMenuTrigger = (idToSet: string) => setLocalNavItems(prev => prev.map(item => ({ ...item, hasMegaMenu: item.id === idToSet ? !item.hasMegaMenu : false })));
     const handleMoveHeaderItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...sortedNavItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        setLocalNavItems(newItems.map((item, idx) => ({ ...item, position: idx + 1 })));
    };
    
    const handleMoveColumn = (index: number, direction: 'up' | 'down') => {
        setMenuConfig(prevConfig => {
            const newColumns = [...prevConfig.columns];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= newColumns.length) return prevConfig;
            [newColumns[index], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[index]];
            return { ...prevConfig, columns: newColumns };
        });
    };
    const handleMoveLink = (colId: string, index: number, direction: 'up' | 'down') => {
        setMenuConfig(prevConfig => ({
            ...prevConfig,
            columns: prevConfig.columns.map(c => {
                if (c.id === colId) {
                    const newLinks = [...c.links];
                    const targetIndex = direction === 'up' ? index - 1 : index + 1;
                    if (targetIndex < 0 || targetIndex >= newLinks.length) return c;
                    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
                    return { ...c, links: newLinks };
                }
                return c;
            })
        }));
    };
    const updateColumn = (id: string, field: keyof MegaMenuColumn, value: any) => setMenuConfig(p => ({ ...p, columns: p.columns.map(c => c.id === id ? { ...c, [field]: value } : c) }));
    const addColumn = () => {
        const newColumn: MegaMenuColumn = { id: uuidv4(), title: 'Nouvelle Colonne', links: [] };
        setMenuConfig(p => ({ ...p, columns: [...p.columns, newColumn] }));
        setOpenSections(p => [...p, newColumn.id]);
    };
    const removeColumn = (idToRemove: string) => {
        if (window.confirm("Supprimer cette colonne et tous ses liens ?")) {
            setMenuConfig(prevConfig => ({
                ...prevConfig,
                columns: prevConfig.columns.filter(c => c.id !== idToRemove)
            }));
        }
    };
    const updateLink = (colId: string, linkId: string, field: keyof MegaMenuLink, value: any) => setMenuConfig(p => ({ ...p, columns: p.columns.map(c => c.id === colId ? { ...c, links: c.links.map(l => l.id === linkId ? { ...l, [field]: value } : l) } : c) }));
    const addLink = (colId: string) => {
        const newLink: MegaMenuLink = { id: uuidv4(), text: 'Nouveau lien', url: '#' };
        setMenuConfig(p => ({ ...p, columns: p.columns.map(c => c.id === colId ? { ...c, links: [...c.links, newLink] } : c) }));
    };
    const removeLink = (colId: string, linkId: string) => setMenuConfig(p => ({ ...p, columns: p.columns.map(c => c.id === colId ? { ...c, links: c.links.filter(l => l.id !== linkId) } : c) }));
    
    const handleAnnouncementChange = (field: keyof MegaMenu['announcement'], value: any) => setMenuConfig(p => ({ ...p, announcement: { ...p.announcement, [field]: value } }));
    const handleFooterLinkChange = (field: keyof MegaMenu['footerLink'], value: any) => setMenuConfig(p => ({ ...p, footerLink: { ...p.footerLink, [field]: value } }));
    const handleAnnouncementImageChange = (field: keyof MegaMenu['announcement']['image'], value: string) => setMenuConfig(p => ({...p, announcement: {...p.announcement, image: {...p.announcement.image, [field]: value}}}));
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            const reader = new FileReader();
            reader.onloadend = () => { handleAnnouncementImageChange('url', reader.result as string) };
            reader.readAsDataURL(file);
        }
    };
    const openIconPicker = () => setIsIconPickerOpen(true);
    const handleIconSelect = (iconName: string) => {
        handleFooterLinkChange('icon', iconName);
        setIsIconPickerOpen(false);
    };

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateHeaderNavItems(localNavItems);
            updateGeneralSettings({ ...generalSettings, megaMenu: menuConfig });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const handleReset = () => {
        if (window.confirm("Réinitialiser le menu par défaut ?")) {
            setMenuConfig(JSON.parse(JSON.stringify(DEFAULT_MEGA_MENU)));
        }
    };
    
    const megaMenuEnabled = menuConfig.enabled && localNavItems.some(i => i.hasMegaMenu);

    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><Bars3Icon className="w-7 h-7" /><span>Gestion du Menu En-tête</span></div>}>
            <div className="space-y-6">
                 <div className="bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-black/30"><div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => handleToggleSection('header-items')}><h3 className="font-bold text-lg">Liens principaux de l'en-tête</h3><ChevronDownIcon className={`w-5 h-5 transition-transform ${openSections.includes('header-items') ? 'rotate-180' : ''}`} /></div>{openSections.includes('header-items') && (<div className="p-3 border-t border-black/10 dark:border-white/10 space-y-2">{sortedNavItems.map((item, index) => (<div key={item.id} className={`p-2 bg-black/5 dark:bg-white/5 rounded-lg flex items-center gap-3 ${!item.active ? 'opacity-50' : ''}`}><div className="flex flex-col"><button onClick={() => handleMoveHeaderItem(index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4 rotate-180"/></button><button onClick={() => handleMoveHeaderItem(index, 'down')} disabled={index === sortedNavItems.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4"/></button></div><input type="text" value={item.label} onChange={e => handleUpdateHeaderItem(item.id, 'label', e.target.value)} placeholder="Libellé" className="text-sm bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 flex-grow" /><div className="flex-grow"><UrlSelector value={item.link} onChange={newUrl => handleUpdateHeaderItem(item.id, 'link', newUrl)} /></div><div className="flex items-center gap-4"><div className="flex flex-col items-center gap-1"><label className="text-xs">Mega Menu</label><button onClick={() => handleSetMegaMenuTrigger(item.id)} className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${item.hasMegaMenu ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${item.hasMegaMenu ? 'translate-x-5' : 'translate-x-1'}`} /></button></div><div className="flex flex-col items-center gap-1"><label className="text-xs">Actif</label><button onClick={() => handleUpdateHeaderItem(item.id, 'active', !item.active)} className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${item.active ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-5' : 'translate-x-1'}`} /></button></div></div></div>))}</div>)}</div>

                <div className={`space-y-6 transition-all duration-300 ${megaMenuEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl flex items-center justify-between"><label htmlFor="enableMegaMenu" className="font-semibold">Activer le Mega Menu</label><button id="enableMegaMenu" onClick={() => setMenuConfig(p => ({ ...p, enabled: !p.enabled }))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${menuConfig.enabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${menuConfig.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
                    <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl"><h3 className="font-bold text-lg mb-4">Options d'affichage du Mega Menu</h3><div className="flex items-center justify-between"><label className="font-semibold">Largeur</label><div className="flex bg-black/10 dark:bg-white/10 p-1 rounded-full"><button onClick={() => setMenuConfig(p => ({ ...p, width: 'container' }))} className={`px-3 py-1 text-sm rounded-full ${menuConfig.width === 'container' ? 'bg-accent text-white' : 'text-gray-700 dark:text-gray-300'}`}>Conteneur</button><button onClick={() => setMenuConfig(p => ({ ...p, width: 'full' }))} className={`px-3 py-1 text-sm rounded-full ${menuConfig.width === 'full' ? 'bg-accent text-white' : 'text-gray-700 dark:text-gray-300'}`}>Pleine largeur</button></div></div></div>
                    <div className="space-y-3">{menuConfig.columns.map((col, colIndex) => (<div key={col.id} className="bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-black/30 transition-all"><div className="p-3 flex items-center justify-between border-b border-black/10 dark:border-white/10"><div className="flex items-center gap-3 w-full"><div className="flex flex-col"><button onClick={() => handleMoveColumn(colIndex, 'up')} disabled={colIndex === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5 rotate-180"/></button><button onClick={() => handleMoveColumn(colIndex, 'down')} disabled={colIndex === menuConfig.columns.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5"/></button></div><input type="text" value={col.title} onChange={e => updateColumn(col.id, 'title', e.target.value)} className="font-bold bg-transparent focus:outline-none focus:ring-1 focus:ring-accent rounded px-1 flex-grow" /></div><div className="flex items-center gap-2"><button onClick={() => addLink(col.id)} className="text-xs bg-accent/80 text-white px-2 py-1 rounded-md hover:bg-accent">Ajouter Lien</button><button onClick={() => removeColumn(col.id)} className="p-1 hover:bg-red-500/10 rounded-full"><TrashIcon className="w-5 h-5 text-red-500" /></button><button onClick={() => handleToggleSection(col.id)}><ChevronDownIcon className={`w-5 h-5 transition-transform ${openSections.includes(col.id) ? 'rotate-180' : ''}`} /></button></div></div>{openSections.includes(col.id) && (<div className="p-3 space-y-2">{col.links.map((link, linkIndex) => (<div key={link.id} className="p-2 bg-black/5 dark:bg-white/5 rounded-lg flex items-center gap-3"><div className="flex flex-col"><button onClick={() => handleMoveLink(col.id, linkIndex, 'up')} disabled={linkIndex === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4 rotate-180"/></button><button onClick={() => handleMoveLink(col.id, linkIndex, 'down')} disabled={linkIndex === col.links.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4"/></button></div><input type="text" value={link.text} onChange={e => updateLink(col.id, link.id, 'text', e.target.value)} placeholder="Texte du lien" className="text-sm bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 flex-grow min-w-0" /><UrlSelector value={link.url} onChange={newUrl => updateLink(col.id, link.id, 'url', newUrl)} /><button onClick={() => removeLink(col.id, link.id)} className="p-1 hover:bg-red-500/10 rounded-full"><TrashIcon className="w-4 h-4 text-red-500" /></button></div>))}{col.links.length === 0 && <p className="text-center text-xs text-gray-500 py-2">Aucun lien.</p>}</div>)}</div>))}</div>
                    <div className="flex justify-center mt-4"><button onClick={addColumn} className="w-full max-w-xs flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg font-semibold hover:bg-accent/20 transition-colors"><PlusIcon className="w-5 h-5" /> Ajouter une colonne</button></div>

                    <div className="bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-black/30"><div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => handleToggleSection('announcement')}><h3 className="font-bold text-lg">Annonce du Mega Menu</h3><ChevronDownIcon className={`w-5 h-5 transition-transform ${openSections.includes('announcement') ? 'rotate-180' : ''}`} /></div>{openSections.includes('announcement') && (<div className="p-3 border-t border-black/10 dark:border-white/10 space-y-4"><div className="flex items-center justify-between"><label className="font-semibold">Activer l'annonce</label><button onClick={() => handleAnnouncementChange('enabled', !menuConfig.announcement.enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${menuConfig.announcement.enabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${menuConfig.announcement.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>{menuConfig.announcement.enabled && (<div className="space-y-3"><input type="text" value={menuConfig.announcement.title} onChange={e => handleAnnouncementChange('title', e.target.value)} placeholder="Titre" className="text-sm w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20" /><textarea value={menuConfig.announcement.description} onChange={e => handleAnnouncementChange('description', e.target.value)} placeholder="Description" rows={2} className="text-sm w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20" /><div><label className="text-xs font-semibold mb-1 block">Image de l'annonce</label><div className="flex items-center gap-2"><input type="text" value={menuConfig.announcement.image.url} onChange={e => handleAnnouncementImageChange('url', e.target.value)} placeholder="URL de l'image" className="text-sm flex-grow bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20" /><input type="file" accept="image/*" id="announcement-img-upload" className="hidden" onChange={handleImageUpload} /><label htmlFor="announcement-img-upload" className="cursor-pointer p-2 bg-accent/80 hover:bg-accent text-white rounded-lg flex-shrink-0"><ArrowUpTrayIcon className="w-4 h-4" /></label></div>{menuConfig.announcement.image.url && (<div className="mt-2 space-y-2"><img src={menuConfig.announcement.image.url} alt="Aperçu" className="w-full object-cover rounded-md max-h-48" style={{ aspectRatio: menuConfig.announcement.image.ratio.replace(':', '/'), objectPosition: menuConfig.announcement.image.position }} /><div><label className="text-xs font-semibold mb-1 block">Ratio</label><div className="flex gap-2 flex-wrap">{['1:1', '2:1', '4:3', '16:9'].map(ratio => (<OptionButton key={ratio} label={ratio} value={ratio} current={menuConfig.announcement.image.ratio} onClick={() => handleAnnouncementImageChange('ratio', ratio)} />))}</div></div><div><label className="text-xs font-semibold mb-1 block">Position</label><div className="flex gap-2 flex-wrap">{['top', 'center', 'bottom'].map(pos => (<OptionButton key={pos} label={pos} value={pos} current={menuConfig.announcement.image.position} onClick={() => handleAnnouncementImageChange('position', pos as 'top'|'center'|'bottom')} />))}</div></div></div>)}</div><UrlSelector value={menuConfig.announcement.url} onChange={newUrl => handleAnnouncementChange('url', newUrl)} /></div>)}</div>)}</div>

                    <div className="bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-black/30"><div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => handleToggleSection('footer-link')}><h3 className="font-bold text-lg">Lien de pied de page</h3><ChevronDownIcon className={`w-5 h-5 transition-transform ${openSections.includes('footer-link') ? 'rotate-180' : ''}`} /></div>{openSections.includes('footer-link') && (<div className="p-3 border-t border-black/10 dark:border-white/10 space-y-4"><div className="flex items-center justify-between"><label className="font-semibold">Activer le lien</label><button onClick={() => handleFooterLinkChange('enabled', !menuConfig.footerLink.enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${menuConfig.footerLink.enabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${menuConfig.footerLink.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>{menuConfig.footerLink.enabled && (<div className="space-y-3"><input type="text" value={menuConfig.footerLink.text} onChange={e => handleFooterLinkChange('text', e.target.value)} placeholder="Texte du lien" className="text-sm w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20" /><UrlSelector value={menuConfig.footerLink.url} onChange={newUrl => handleFooterLinkChange('url', newUrl)} /><button onClick={openIconPicker} className="w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 text-sm flex items-center justify-between"><span>Icône: {menuConfig.footerLink.icon}</span><DynamicIcon icon={menuConfig.footerLink.icon} className="w-5 h-5" /></button></div>)}</div>)}</div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4"><button onClick={handleSave} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'} ${saveStatus !== 'idle' ? 'cursor-not-allowed' : ''}`}>{saveStatus === 'idle' && 'Enregistrer'}{saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}{saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}</button><button onClick={handleReset} className="w-full px-4 py-3 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg font-semibold">Réinitialiser</button></div>
            </div>
            {isIconPickerOpen && <IconPickerModal onSelect={handleIconSelect} onClose={() => setIsIconPickerOpen(false)} />}
        </AdminPageLayout>
    );
};

export default AdminMegaMenuManagement;
