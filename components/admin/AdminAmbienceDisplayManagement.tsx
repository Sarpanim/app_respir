import React, { useState, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { AmbiencePageSettings, AmbienceCategory } from '../../types';
import { SparklesIcon, CheckIcon, ArrowPathIcon, PlusIcon, TrashIcon } from '../Icons';

const AdminAmbienceDisplayManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings, ambienceCategories, ambiences } = useAppContext();
    const [settings, setSettings] = useState<AmbiencePageSettings>(generalSettings.ambiencePageSettings);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Sync with global settings, but also clean up categories that might have been deleted
        const initialSettings = JSON.parse(JSON.stringify(generalSettings.ambiencePageSettings));
        const allCategoryIds = new Set(ambienceCategories.map((c: AmbienceCategory) => c.id));
        initialSettings.categories = initialSettings.categories.filter((c: any) => allCategoryIds.has(c.id));
        setSettings(initialSettings);
    }, [generalSettings.ambiencePageSettings, ambienceCategories]);

    const handleSettingsChange = (update: Partial<AmbiencePageSettings>) => {
        setSettings(prev => ({ ...prev, ...update }));
        setHasChanges(true);
    };

    const handleCategoryOrderChange = (newOrder: AmbiencePageSettings['categories']) => {
        handleSettingsChange({ categories: newOrder });
    };

    const addCategoryToDisplay = (categoryId: number) => {
        const category = ambienceCategories.find(c => c.id === categoryId);
        if (category && !settings.categories.some(c => c.id === categoryId)) {
            const newCategory = { id: category.id, name: category.name, image: category.image.url };
            handleCategoryOrderChange([...settings.categories, newCategory]);
        }
    };

    const removeCategoryFromDisplay = (categoryId: number) => {
        handleCategoryOrderChange(settings.categories.filter(c => c.id !== categoryId));
    };

    const handleSave = () => {
        updateGeneralSettings({ ...generalSettings, ambiencePageSettings: settings });
        setHasChanges(false);
    };

    const handleReset = () => {
        // This should be implemented based on a default constant
        console.log("Resetting to default...");
    };

    const availableCategories = ambienceCategories.filter(
        (cat: AmbienceCategory) => !settings.categories.some((c: any) => c.id === cat.id)
    );

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <SparklesIcon className="w-7 h-7" />
                <span>Gestion Page Ambiances</span>
            </div>
        }>
            <div className="space-y-6">
                {/* Category Order */}
                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
                    <h3 className="font-bold mb-4">Ordre des Catégories sur la Page</h3>
                    <div className="space-y-2">
                        {settings.categories.map(category => (
                            <div key={category.id} className="flex items-center justify-between p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img src={category.image} alt={category.name} className="w-10 h-10 rounded-md object-cover" />
                                    <span className="font-semibold">{category.name}</span>
                                </div>
                                <button onClick={() => removeCategoryFromDisplay(category.id)} className="p-1 text-red-500 hover:text-red-700">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {availableCategories.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                            <h4 className="text-sm font-semibold mb-2">Ajouter une catégorie</h4>
                            <div className="flex flex-wrap gap-2">
                                {availableCategories.map((cat: AmbienceCategory) => (
                                    <button 
                                        key={cat.id} 
                                        onClick={() => addCategoryToDisplay(cat.id)}
                                        className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Featured Ambiences */}
                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
                    <h3 className="font-bold mb-4">Ambiances Mises en Avant</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sélectionnez les ambiances à afficher en haut de la page.</p>
                    {/* UI to select featured ambiences would go here */}
                </div>
            </div>

            {hasChanges && (
                <button
                    onClick={handleSave}
                    className="fixed bottom-28 right-8 z-50 bg-accent text-white rounded-full p-4 shadow-lg hover:scale-110 active:scale-100 transition-transform duration-200 ease-in-out animate-fade-in"
                    aria-label="Sauvegarder les modifications"
                >
                    <CheckIcon className="w-6 h-6" />
                </button>
            )}
        </AdminPageLayout>
    );
};

export default AdminAmbienceDisplayManagement;