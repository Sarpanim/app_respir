import React, { useState, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { MegaMenu, MegaMenuColumn, MegaMenuLink, NavItem } from '../../types';
import { Bars3Icon, PlusIcon, TrashIcon, ChevronDownIcon, CheckIcon, ArrowPathIcon, ArrowUpTrayIcon, ImageIcon, XMarkIcon } from '../Icons';
import { DEFAULT_MEGA_MENU, AVAILABLE_ICONS, PRO_ICONS } from '../../constants';
import DynamicIcon from '../DynamicIcon';
import UrlSelector from './UrlSelector';

const AdminMegaMenuManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [megaMenu, setMegaMenu] = useState<MegaMenu>(generalSettings.megaMenu);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setMegaMenu(generalSettings.megaMenu);
    }, [generalSettings.megaMenu]);

    const handleSave = () => {
        updateGeneralSettings({ ...generalSettings, megaMenu });
        setHasChanges(false);
    };

    const handleReset = () => {
        if (window.confirm("Réinitialiser le méga menu par défaut ?")) {
            setMegaMenu(DEFAULT_MEGA_MENU);
            setHasChanges(true);
        }
    };

    const handleColumnChange = (colIndex: number, field: keyof MegaMenuColumn, value: any) => {
        const newColumns = [...megaMenu.columns];
        (newColumns[colIndex] as any)[field] = value;
        setMegaMenu({ ...megaMenu, columns: newColumns });
        setHasChanges(true);
    };

    const handleLinkChange = (colIndex: number, linkIndex: number, field: keyof MegaMenuLink, value: any) => {
        const newColumns = [...megaMenu.columns];
        (newColumns[colIndex].links[linkIndex] as any)[field] = value;
        setMegaMenu({ ...megaMenu, columns: newColumns });
        setHasChanges(true);
    };

    const addColumn = () => {
        const newColumn: MegaMenuColumn = { id: `col-${Date.now()}`, title: 'Nouvelle Colonne', links: [] };
        setMegaMenu({ ...megaMenu, columns: [...megaMenu.columns, newColumn] });
        setHasChanges(true);
    };

    const addLink = (colIndex: number) => {
        const newLink: MegaMenuLink = { id: `link-${Date.now()}`, text: 'Nouveau Lien', url: '/' };
        const newColumns = [...megaMenu.columns];
        newColumns[colIndex].links.push(newLink);
        setMegaMenu({ ...megaMenu, columns: newColumns });
        setHasChanges(true);
    };
    
    const removeColumn = (colIndex: number) => {
        const newColumns = megaMenu.columns.filter((_, i) => i !== colIndex);
        setMegaMenu({ ...megaMenu, columns: newColumns });
        setHasChanges(true);
    };

    const removeLink = (colIndex: number, linkIndex: number) => {
        const newColumns = [...megaMenu.columns];
        newColumns[colIndex].links = newColumns[colIndex].links.filter((_, i) => i !== linkIndex);
        setMegaMenu({ ...megaMenu, columns: newColumns });
        setHasChanges(true);
    };

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <Bars3Icon className="w-7 h-7" />
                <span>Gestion du Méga Menu</span>
            </div>
        }>
            <div className="flex justify-end gap-2 mb-4">
                <button onClick={handleReset} className="btn-secondary">Réinitialiser</button>
                <button onClick={addColumn} className="btn-primary">Ajouter une colonne</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {megaMenu.columns.map((column, colIndex) => (
                    <div key={column.id} className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
                        <div className="flex justify-between items-center mb-3">
                            <input 
                                type="text"
                                value={column.title}
                                onChange={(e) => handleColumnChange(colIndex, 'title', e.target.value)}
                                className="font-bold text-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-accent rounded px-1"
                            />
                            <button onClick={() => removeColumn(colIndex)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-2">
                            {column.links.map((link, linkIndex) => (
                                <div key={link.id} className="p-2 bg-black/5 dark:bg-white/5 rounded-lg space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input type="text" value={link.text} onChange={e => handleLinkChange(colIndex, linkIndex, 'text', e.target.value)} className="input-style flex-grow" placeholder="Label" />
                                        <button onClick={() => removeLink(colIndex, linkIndex)} className="p-1 text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                    <UrlSelector value={link.url} onChange={value => handleLinkChange(colIndex, linkIndex, 'url', value)} />
                                </div>
                            ))}
                            <button onClick={() => addLink(colIndex)} className="w-full btn-secondary text-sm mt-2">Ajouter un lien</button>
                        </div>
                    </div>
                ))}
            </div>

            {hasChanges && (
                <button
                    onClick={handleSave}
                    className="fixed bottom-28 right-8 z-50 bg-accent text-white rounded-full p-4 shadow-lg"
                >
                    <CheckIcon className="w-6 h-6" />
                </button>
            )}
        </AdminPageLayout>
    );
};

export default AdminMegaMenuManagement;