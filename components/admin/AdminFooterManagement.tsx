import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { FooterSettings, FooterColumn, FooterLink } from '../../types';
import { ListBulletIcon, PlusIcon, TrashIcon, CheckIcon, ArrowPathIcon, ChevronDownIcon } from '../Icons';
import { AVAILABLE_ACTIONS, DEFAULT_FOOTER_SETTINGS } from '../../constants';
import { v4 as uuidv4 } from 'uuid';

const AdminFooterManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [settings, setSettings] = useState<FooterSettings>(JSON.parse(JSON.stringify(generalSettings.footerSettings)));
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const updateColumn = (id: string, field: keyof FooterColumn, value: any) => {
        setSettings(p => ({ ...p, columns: p.columns.map(c => c.id === id ? { ...c, [field]: value } : c) }));
    };

    const updateLink = (colId: string, linkId: string, field: keyof FooterLink, value: any) => {
        setSettings(p => ({ ...p, columns: p.columns.map(c => c.id === colId ? { ...c, links: c.links.map(l => l.id === linkId ? { ...l, [field]: value } : l) } : c) }));
    };

    const addLink = (colId: 'col2' | 'col3') => {
        const newLink: FooterLink = { id: uuidv4(), label: 'Nouveau Lien', action: null, url: '#', position: 100 };
        setSettings(p => ({ ...p, columns: p.columns.map(c => c.id === colId ? { ...c, links: [...c.links, newLink] } : c) }));
    };

    const removeLink = (colId: string, linkId: string) => {
        setSettings(p => ({ ...p, columns: p.columns.map(c => c.id === colId ? { ...c, links: c.links.filter(l => l.id !== linkId) } : c) }));
    };

    const handleMoveLink = (colId: 'col2' | 'col3', index: number, direction: 'up' | 'down') => {
        const newColumns = settings.columns.map(c => {
            if (c.id === colId) {
                const newLinks = [...c.links].sort((a, b) => a.position - b.position); // Ensure sorted before move
                const targetIndex = direction === 'up' ? index - 1 : index + 1;
                if (targetIndex < 0 || targetIndex >= newLinks.length) return c;
                [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
                
                const updatedLinksWithPosition = newLinks.map((link, idx) => ({ ...link, position: idx + 1 }));
                
                return { ...c, links: updatedLinksWithPosition };
            }
            return c;
        });
        setSettings(p => ({ ...p, columns: newColumns }));
    };

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateGeneralSettings({ ...generalSettings, footerSettings: settings });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const handleReset = () => {
        if (window.confirm("Réinitialiser le footer par défaut ?")) {
            setSettings(JSON.parse(JSON.stringify(DEFAULT_FOOTER_SETTINGS)));
        }
    };
    
    const ColumnEditor: React.FC<{ column: FooterColumn }> = ({ column }) => (
        <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
            <div className="flex items-center justify-between mb-4">
                <input type="text" value={column.title} onChange={e => updateColumn(column.id, 'title', e.target.value)} className="font-bold text-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-accent rounded px-1 w-full" />
                 <button onClick={() => updateColumn(column.id, 'enabled', !column.enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${column.enabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${column.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button>
            </div>
            <div className="space-y-2">
                {column.links.sort((a,b) => a.position - b.position).map((link, index) => (
                    <div key={link.id} className="p-2 bg-black/5 dark:bg-white/5 rounded-lg flex items-center gap-3">
                        <div className="flex flex-col">
                            <button onClick={() => handleMoveLink(column.id, index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4 rotate-180"/></button>
                            <button onClick={() => handleMoveLink(column.id, index, 'down')} disabled={index === column.links.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-4 h-4"/></button>
                        </div>
                        <input type="text" value={link.label} onChange={e => updateLink(column.id, link.id, 'label', e.target.value)} placeholder="Texte du lien" className="text-sm bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 flex-grow min-w-0" />
                        <select value={link.action || 'external'} onChange={e => updateLink(column.id, link.id, 'action', e.target.value === 'external' ? null : e.target.value)} className="text-sm bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 flex-shrink-0">
                            {AVAILABLE_ACTIONS.map(a => <option key={a.name} value={a.action || 'external'}>{a.name}</option>)}
                        </select>
                        {link.action === null && (
                            <input type="text" value={link.url || '#'} onChange={e => updateLink(column.id, link.id, 'url', e.target.value)} placeholder="URL externe" className="text-sm bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 w-32 flex-shrink-0" />
                        )}
                        <button onClick={() => removeLink(column.id, link.id)} className="p-1 hover:bg-red-500/10 rounded-full flex-shrink-0"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                    </div>
                ))}
            </div>
            <button onClick={() => addLink(column.id)} className="w-full text-center text-sm text-accent font-semibold mt-3 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                + Ajouter un lien
            </button>
        </div>
    );

    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><ListBulletIcon className="w-7 h-7" /><span>Gestion du Footer</span></div>}>
            <div className="space-y-6">
                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                    <h3 className="font-bold text-lg mb-4">Mise en page</h3>
                    <div className="flex items-center justify-between">
                        <label className="font-semibold">Nombre de colonnes</label>
                        <div className="flex bg-black/10 dark:bg-white/10 p-1 rounded-full">
                            <button onClick={() => setSettings(p => ({ ...p, layout: 3 }))} className={`px-3 py-1 text-sm rounded-full ${settings.layout === 3 ? 'bg-accent text-white' : 'text-gray-700 dark:text-gray-300'}`}>3 Colonnes</button>
                            <button onClick={() => setSettings(p => ({ ...p, layout: 4 }))} className={`px-3 py-1 text-sm rounded-full ${settings.layout === 4 ? 'bg-accent text-white' : 'text-gray-700 dark:text-gray-300'}`}>4 Colonnes</button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">La colonne 1 (Logo) et la dernière (Newsletter, en mode 4 colonnes) sont fixes.</p>
                </div>
                
                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                    <h3 className="font-bold text-lg mb-4">Colonne 1 (Logo)</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slogan</label>
                        <input
                            type="text"
                            value={settings.tagline}
                            onChange={e => setSettings(p => ({ ...p, tagline: e.target.value }))}
                            className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {settings.columns.map(col => <ColumnEditor key={col.id} column={col} />)}
                </div>

                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Colonne Newsletter</h3>
                        <button onClick={() => setSettings(p => ({ ...p, newsletterEnabled: !p.newsletterEnabled }))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.newsletterEnabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.newsletterEnabled ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                    </div>
                    <div className={`space-y-3 ${!settings.newsletterEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Titre</label>
                            <input
                                type="text"
                                value={settings.newsletterTitle}
                                onChange={e => setSettings(p => ({ ...p, newsletterTitle: e.target.value }))}
                                className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={settings.newsletterDescription}
                                onChange={e => setSettings(p => ({ ...p, newsletterDescription: e.target.value }))}
                                rows={2}
                                className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button onClick={handleSave} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'} ${saveStatus !== 'idle' ? 'cursor-not-allowed' : ''}`}>
                        {saveStatus === 'idle' && 'Enregistrer'}
                        {saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}
                        {saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}
                    </button>
                    <button onClick={handleReset} className="w-full px-4 py-3 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg font-semibold">Réinitialiser</button>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminFooterManagement;