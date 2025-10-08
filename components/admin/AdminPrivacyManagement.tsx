import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { PrivacyPolicyContent, PrivacyPolicySection } from '../../types';
import { PlusIcon, TrashIcon, ShieldCheckIcon, ChevronDownIcon } from '../Icons';
import { v4 as uuidv4 } from 'uuid';

const AdminPrivacyManagement: React.FC = () => {
    const { privacyPolicyContent, updatePrivacyPolicyContent } = useAppContext();
    const [content, setContent] = useState<PrivacyPolicyContent>(JSON.parse(JSON.stringify(privacyPolicyContent)));
    const [saveMessage, setSaveMessage] = useState('');

    const handleContentChange = (id: string, field: 'title' | 'content', value: string) => {
        setContent(prev => ({
            ...prev,
            sections: prev.sections.map(section => 
                section.id === id ? { ...section, [field]: value } : section
            )
        }));
    };

    const addSection = () => {
        const newSection: PrivacyPolicySection = {
            id: uuidv4(),
            title: "Nouvelle Section",
            content: "Contenu de la nouvelle section."
        };
        setContent(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    };

    const removeSection = (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) {
            setContent(prev => ({ ...prev, sections: prev.sections.filter(section => section.id !== id) }));
        }
    };
    
    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...content.sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        setContent(p => ({...p, sections: newItems}));
    };

    const handleSave = () => {
        updatePrivacyPolicyContent(content);
        setSaveMessage('Politique de confidentialité sauvegardée !');
        setTimeout(() => setSaveMessage(''), 3000);
    };
    
    const Title = () => (
        <div className="flex items-center justify-center gap-3">
            <ShieldCheckIcon className="w-7 h-7" />
            <span>Gestion de la Politique de Confidentialité</span>
        </div>
    );
    
    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent";

    return (
        <AdminPageLayout title={<Title />}>
            <div className="space-y-6">
                <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                    <label htmlFor="lastUpdated" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">Date de dernière mise à jour</label>
                    <input
                        type="date"
                        id="lastUpdated"
                        value={content.lastUpdated}
                        onChange={(e) => setContent(prev => ({ ...prev, lastUpdated: e.target.value }))}
                        className={inputClasses}
                    />
                </div>

                <div 
                    className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30 space-y-3"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-400">Astuce : Saisissez "- " au début d'une ligne pour créer un élément de liste.</p>
                    {content.sections.map((section, index) => (
                         <div
                            key={section.id}
                            className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-transparent"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex flex-col">
                                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5 rotate-180"/></button>
                                    <button onClick={() => handleMove(index, 'down')} disabled={index === content.sections.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5"/></button>
                                </div>
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => handleContentChange(section.id, 'title', e.target.value)}
                                    className={`${inputClasses} font-bold`}
                                />
                                <button onClick={() => removeSection(section.id)} className="p-1.5 hover:bg-red-500/10 rounded-full">
                                    <TrashIcon className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                            <textarea
                                value={section.content}
                                onChange={(e) => handleContentChange(section.id, 'content', e.target.value)}
                                rows={5}
                                className={`${inputClasses} text-sm leading-relaxed`}
                            />
                        </div>
                    ))}

                    <button onClick={addSection} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg font-semibold hover:bg-accent/20 transition-colors">
                        <PlusIcon className="w-5 h-5" /> Ajouter une section
                    </button>
                </div>
                 <div className="relative mt-6">
                    <button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Sauvegarder la politique
                    </button>
                    {saveMessage && <p className="text-center text-green-600 dark:text-green-400 mt-2 text-sm absolute w-full">{saveMessage}</p>}
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminPrivacyManagement;