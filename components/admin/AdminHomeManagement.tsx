import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { HomepageSection } from '../../types';
import { HomeIcon, CheckIcon, ArrowPathIcon, ChevronDownIcon } from '../Icons';
import { DEFAULT_HOMEPAGE_SECTIONS } from '../../constants';

const AdminHomeManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [sections, setSections] = useState<HomepageSection[]>(
        JSON.parse(JSON.stringify(generalSettings.homepageSections))
    );
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    
    const sortedSections = useMemo(() => {
        return [...sections].sort((a, b) => a.position - b.position);
    }, [sections]);

    const handleUpdateSection = (id: string, field: keyof HomepageSection, value: any) => {
        setSections(prev =>
            prev.map(section => (section.id === id ? { ...section, [field]: value } : section))
        );
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...sortedSections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        const updatedItemsWithPosition = newItems.map((item, idx) => ({ ...item, position: idx + 1 }));
        setSections(updatedItemsWithPosition);
    };

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateGeneralSettings({ ...generalSettings, homepageSections: sections });
            setSaveStatus('saved');
            setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
        }, 1000);
    };

    const handleReset = () => {
        if (window.confirm("Réinitialiser l'ordre et la visibilité des sections par défaut ?")) {
            setSections(JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_SECTIONS)));
        }
    };
    
    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent text-sm";


    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><HomeIcon className="w-7 h-7" /><span>Gestion Page d'Accueil</span></div>}>
            <div className="space-y-4">
                <div
                    className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30 space-y-2"
                >
                    {sortedSections.map((section, index) => (
                        <div
                            key={section.id}
                            className={`p-3 bg-black/5 dark:bg-white/5 rounded-lg flex flex-col sm:flex-row items-center gap-4 transition-all ${!section.enabled ? 'opacity-50' : ''}`}
                        >
                            <div className="flex flex-col">
                                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5 rotate-180"/></button>
                                <button onClick={() => handleMove(index, 'down')} disabled={index === sortedSections.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5"/></button>
                            </div>
                            
                            <div className="flex-grow w-full">
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={e => handleUpdateSection(section.id, 'title', e.target.value)}
                                    className={inputClasses}
                                />
                            </div>

                            <div className="flex-shrink-0 w-full sm:w-auto">
                                <select
                                    value={section.enabledFor}
                                    onChange={e => handleUpdateSection(section.id, 'enabledFor', e.target.value)}
                                    className={`${inputClasses} appearance-none`}
                                >
                                    <option value="both">Tous appareils</option>
                                    <option value="desktop">Bureau seul</option>
                                    <option value="mobile">Mobile seul</option>
                                </select>
                            </div>
                            
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => handleUpdateSection(section.id, 'enabled', !section.enabled)}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${section.enabled ? 'bg-accent' : 'bg-gray-400'}`}
                                >
                                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${section.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saveStatus !== 'idle'}
                        className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${
                            saveStatus === 'saved'
                                ? 'bg-green-500'
                                : saveStatus === 'saving'
                                ? 'bg-accent/70'
                                : 'bg-accent hover:bg-accent/90'
                        } ${saveStatus !== 'idle' ? 'cursor-not-allowed' : ''}`}
                    >
                        {saveStatus === 'idle' && 'Enregistrer'}
                        {saveStatus === 'saving' && (
                            <>
                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                <span>Enregistrement...</span>
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <>
                                <CheckIcon className="w-5 h-5" />
                                <span>Enregistré !</span>
                            </>
                        )}
                    </button>
                    <button onClick={handleReset} className="w-full px-4 py-3 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg font-semibold">
                        Réinitialiser
                    </button>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminHomeManagement;