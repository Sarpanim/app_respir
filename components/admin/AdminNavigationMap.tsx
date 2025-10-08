import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { View, PageSettings, NavItem } from '../../types';
import { MapIcon, CheckIcon, ArrowPathIcon, EyeIcon, EyeSlashIcon, DocumentTextIcon } from '../Icons';
import { AVAILABLE_ROUTES } from '../../constants';

const AdminNavigationMap: React.FC = () => {
    const { pageSettings, setPageSettings, headerNavItems, mobileNavItems, settingsMenuItems } = useAppContext();
    
    const [localSettings, setLocalSettings] = useState<PageSettings>(JSON.parse(JSON.stringify(pageSettings)));
    const [selectedPage, setSelectedPage] = useState<View | null>('grid');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const allPages: { view: View, label: string }[] = useMemo(() => {
        const pageMap = new Map<View, string>();
        
        AVAILABLE_ROUTES.forEach(route => {
            pageMap.set(route.route as View, route.name);
        });
        
        const allNavItems = [...headerNavItems, ...mobileNavItems];
        allNavItems.forEach(item => {
            const view = item.link.replace('/', '') as View;
            if (!pageMap.has(view)) {
                pageMap.set(view, item.label);
            }
        });

        settingsMenuItems.forEach(item => {
            if (item.action) {
                const view = item.action.replace('navigateTo', '').replace(/^\w/, c => c.toLowerCase()) as View;
                if (!pageMap.has(view)) {
                    pageMap.set(view, item.label);
                }
            }
        });
        
        // Add pages not in nav
        if(!pageMap.has('player')) pageMap.set('player', 'Lecteur de cours');
        if(!pageMap.has('player-view')) pageMap.set('player-view', 'Lecteur (Plein écran)');
        if(!pageMap.has('ambience-player')) pageMap.set('ambience-player', 'Lecteur Ambiance');
        if(!pageMap.has('category-detail')) pageMap.set('category-detail', 'Détail Catégorie');


        return Array.from(pageMap.entries()).map(([view, label]) => ({ view, label }));
    }, [headerNavItems, mobileNavItems, settingsMenuItems]);


    const handleToggleHeader = (view: View) => {
        setLocalSettings(prev => {
            const currentSetting = prev[view]?.showHeader ?? true;
            return {
                ...prev,
                [view]: { showHeader: !currentSetting }
            };
        });
    };

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            setPageSettings(localSettings);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };
    
    const selectedPageInfo = useMemo(() => {
        if (!selectedPage) return null;
        const page = allPages.find(p => p.view === selectedPage);
        const navItem = [...headerNavItems, ...mobileNavItems].find(item => item.link.includes(selectedPage));
        return {
            view: selectedPage,
            label: page?.label || selectedPage,
            route: navItem?.link || `/${selectedPage}`,
            showHeader: localSettings[selectedPage]?.showHeader ?? true,
        };
    }, [selectedPage, localSettings, allPages, headerNavItems, mobileNavItems]);

    const PageNode: React.FC<{ page: { view: View, label: string } }> = ({ page }) => {
        const isSelected = selectedPage === page.view;
        const showHeader = localSettings[page.view]?.showHeader ?? true;
        return (
            <button 
                onClick={() => setSelectedPage(page.view)}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${isSelected ? 'bg-accent/20' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
                <div className="flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-accent"/>
                    <span className="font-semibold">{page.label}</span>
                </div>
                {showHeader ? <EyeIcon className="w-5 h-5 text-gray-400" title="Header visible"/> : <EyeSlashIcon className="w-5 h-5 text-red-400" title="Header masqué"/>}
            </button>
        );
    };

    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><MapIcon className="w-7 h-7" /><span>Carte du Site & Navigation</span></div>}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
                     <h3 className="font-bold text-lg mb-4">Pages de l'application</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-2">
                        {allPages.map(page => <PageNode key={page.view} page={page} />)}
                     </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-28 bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
                        <h3 className="font-bold text-lg mb-4">Éditeur de Page</h3>
                        {selectedPageInfo ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500">Page</label>
                                    <p className="font-bold text-xl">{selectedPageInfo.label}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500">Route</label>
                                    <p className="font-mono text-sm bg-black/10 dark:bg-white/10 p-2 rounded-md">{selectedPageInfo.route}</p>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                                    <label className="font-semibold">Afficher le Header & Nav</label>
                                    <button onClick={() => handleToggleHeader(selectedPageInfo.view)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${selectedPageInfo.showHeader ? 'bg-accent' : 'bg-gray-400'}`}>
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${selectedPageInfo.showHeader ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                 <div className="relative pt-4">
                                    <button onClick={handleSave} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'}`}>
                                        {saveStatus === 'idle' && 'Enregistrer'}
                                        {saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}
                                        {saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                <p>Sélectionnez une page pour l'éditer.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminNavigationMap;