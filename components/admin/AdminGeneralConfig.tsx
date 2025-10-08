import React, { useState, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { GeneralSettings } from '../../types';
import { XMarkIcon } from '../Icons';

const AdminGeneralConfig: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    
    const [settings, setSettings] = useState<GeneralSettings>(generalSettings);
    const [fileName, setFileName] = useState<string | null>(null);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        setSettings(generalSettings);
    }, [generalSettings]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === "image/svg+xml") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSettings(prev => ({ ...prev, appLogo: reader.result as string }));
                    setFileName(file.name);
                };
                reader.readAsDataURL(file);
            } else {
                alert("Veuillez sélectionner un fichier SVG valide.");
            }
        }
    };
    
    const handleSaveChanges = () => {
        updateGeneralSettings(settings);
        setSaveMessage('Paramètres sauvegardés avec succès !');
        setTimeout(() => setSaveMessage(''), 3000);
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value as any }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (key: keyof GeneralSettings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent";

    return (
        <AdminPageLayout title="Configuration Générale">
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-6 border border-white/20 dark:border-black/30 space-y-6">
                <div>
                    <label htmlFor="language" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Langue par défaut</label>
                    <select id="language" name="defaultLanguage" value={settings.defaultLanguage} onChange={handleSelectChange} className="w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="theme" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Thème par défaut</label>
                    <select id="theme" name="defaultTheme" value={settings.defaultTheme} onChange={handleSelectChange} className="w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent">
                        <option value="dark">Sombre (Dark)</option>
                        <option value="light">Clair (Light)</option>
                    </select>
                </div>
                <div>
                     <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Logo de l'application (SVG)</label>
                     <div className="flex items-center gap-4">
                        <label htmlFor="logo-upload" className="cursor-pointer bg-accent/80 hover:bg-accent text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm">
                            Choisir un fichier
                        </label>
                        <input type="file" id="logo-upload" accept="image/svg+xml" className="hidden" onChange={handleFileChange} />
                        <div className="flex items-center gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg flex-grow">
                            {settings.appLogo && (
                                <img src={settings.appLogo} alt="Aperçu du logo" className="h-8 w-auto bg-gray-500/10 p-1 rounded-md" />
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex-grow">
                                {fileName ? `Nouveau : ${fileName}` : (settings.appLogo ? 'Logo actuel' : 'Aucun logo défini')}
                            </span>
                            {settings.appLogo && (
                                <button 
                                    onClick={() => { 
                                        setSettings(prev => ({ ...prev, appLogo: '' })); 
                                        setFileName(null); 
                                    }} 
                                    className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500 flex-shrink-0"
                                    title="Supprimer le logo"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                     </div>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Taille du logo</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="16"
                            max="64"
                            step="1"
                            value={settings.appLogoSize}
                            onChange={(e) => setSettings(prev => ({ ...prev, appLogoSize: Number(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-accent"
                        />
                        <span className="font-mono text-sm w-12 text-center bg-white/50 dark:bg-black/30 p-1 rounded-md">{settings.appLogoSize}px</span>
                    </div>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Alignement vertical du logo</label>
                    <div className="flex w-full bg-white/50 dark:bg-black/30 p-1 rounded-full border border-black/20 dark:border-white/20">
                        {(['start', 'center', 'end'] as const).map(value => (
                            <button
                                key={value}
                                onClick={() => setSettings(prev => ({ ...prev, appLogoAlign: value }))}
                                className={`w-full text-center px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none ${
                                    settings.appLogoAlign === value
                                    ? 'bg-accent text-white shadow'
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                {value === 'start' ? 'Haut' : value === 'center' ? 'Centre' : 'Bas'}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-elsie font-bold text-gray-700 dark:text-gray-300 mb-3 border-t border-black/10 dark:border-white/10 pt-6">Navigation (Bureau)</h3>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Alignement du menu</label>
                        <div className="flex w-full bg-white/50 dark:bg-black/30 p-1 rounded-full border border-black/20 dark:border-white/20">
                            {(['start', 'center', 'end'] as const).map(value => (
                                <button
                                    key={value}
                                    onClick={() => setSettings(prev => ({ ...prev, headerNavAlign: value }))}
                                    className={`w-full text-center px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none ${
                                        settings.headerNavAlign === value
                                        ? 'bg-accent text-white shadow'
                                        : 'text-gray-600 dark:text-gray-300'
                                    }`}
                                >
                                    {value === 'start' ? 'Gauche' : value === 'center' ? 'Centre' : 'Droite'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Espacement des éléments du menu</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="16"
                                max="64"
                                step="4"
                                value={settings.headerNavSpacing}
                                onChange={(e) => setSettings(prev => ({ ...prev, headerNavSpacing: Number(e.target.value) }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-accent"
                            />
                            <span className="font-mono text-sm w-12 text-center bg-white/50 dark:bg-black/30 p-1 rounded-md">{settings.headerNavSpacing}px</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-elsie font-bold text-gray-700 dark:text-gray-300 mb-3 border-t border-black/10 dark:border-white/10 pt-6">Apparence - Abonnements</h3>
                    <div>
                        <label htmlFor="defaultSubscriptionCycle" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Cycle d'abonnement par défaut</label>
                        <select id="defaultSubscriptionCycle" name="defaultSubscriptionCycle" value={settings.defaultSubscriptionCycle} onChange={handleSelectChange} className={inputClasses}>
                            <option value="monthly">Mensuel</option>
                            <option value="annual">Annuel</option>
                        </select>
                    </div>
                     <div className="mt-4">
                        <label htmlFor="subscriptionTitleFont" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Typographie du titre (Abonnement)</label>
                        <select id="subscriptionTitleFont" name="subscriptionTitleFont" value={settings.subscriptionTitleFont} onChange={handleSelectChange} className={inputClasses}>
                            <option value="Elsie">Elsie (défaut)</option>
                            <option value="Dancing Script">Dancing Script</option>
                        </select>
                    </div>
                    <div className="mt-4">
                         <label htmlFor="subscriptionTitleColor" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Couleur du titre (Abonnement)</label>
                         <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/30 rounded-lg border border-black/20 dark:border-white/20">
                            <input type="color" id="subscriptionTitleColor" name="subscriptionTitleColor" value={settings.subscriptionTitleColor} onChange={handleInputChange} className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent" />
                            <input type="text" value={settings.subscriptionTitleColor} onChange={handleInputChange} name="subscriptionTitleColor" className="w-full bg-transparent font-mono text-sm focus:outline-none" />
                         </div>
                    </div>
                </div>

                <div className="border-t border-black/10 dark:border-white/10 pt-6">
                    <h3 className="text-lg font-elsie font-bold text-gray-700 dark:text-gray-300 mb-3">Préférences d'Affichage</h3>
                    <div className="space-y-2">
                        <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 flex items-center justify-between">
                            <label htmlFor="navBlurEnabled" className="font-medium text-gray-800 dark:text-gray-300">
                            Activer l'effet de flou sur la navigation
                            </label>
                            <button
                                id="navBlurEnabled"
                                onClick={() => handleToggle('navBlurEnabled')}
                                className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors duration-300 ${settings.navBlurEnabled ? 'bg-accent' : 'bg-gray-400'}`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${settings.navBlurEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 flex items-center justify-between">
                            <label htmlFor="showUserCountOnPlans" className="font-medium text-gray-800 dark:text-gray-300">
                            Afficher le nombre d'utilisateurs sur les abonnements
                            </label>
                            <button
                                id="showUserCountOnPlans"
                                onClick={() => handleToggle('showUserCountOnPlans')}
                                className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors duration-300 ${settings.showUserCountOnPlans ? 'bg-accent' : 'bg-gray-400'}`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${settings.showUserCountOnPlans ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                         <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 flex items-center justify-between">
                            <label htmlFor="showStudentCountOnCourses" className="font-medium text-gray-800 dark:text-gray-300">
                            Afficher le nombre d'étudiants sur les cours
                            </label>
                            <button
                                id="showStudentCountOnCourses"
                                onClick={() => handleToggle('showStudentCountOnCourses')}
                                className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors duration-300 ${settings.showStudentCountOnCourses ? 'bg-accent' : 'bg-gray-400'}`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${settings.showStudentCountOnCourses ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-black/10 dark:border-white/10 pt-6">
                    <h3 className="text-lg font-elsie font-bold text-gray-700 dark:text-gray-300 mb-3">Programme d'invitation</h3>
                    <div className="space-y-4">
                        <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 flex items-center justify-between">
                            <label htmlFor="inviteRewardActive" className="font-medium text-gray-800 dark:text-gray-300">
                                Activer la section récompenses
                            </label>
                            <button
                                id="inviteRewardActive"
                                onClick={() => handleToggle('inviteRewardActive')}
                                className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors duration-300 ${settings.inviteRewardActive ? 'bg-accent' : 'bg-gray-400'}`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${settings.inviteRewardActive ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        {settings.inviteRewardActive && (
                            <div className="space-y-4 p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Titre de la section</label>
                                    <input
                                        type="text"
                                        name="inviteRewardTitle"
                                        value={settings.inviteRewardTitle}
                                        onChange={handleInputChange}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Description de la section</label>
                                    <textarea
                                        name="inviteRewardDescription"
                                        value={settings.inviteRewardDescription}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="relative">
                    <button onClick={handleSaveChanges} className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4">
                        Sauvegarder les changements
                    </button>
                    {saveMessage && <p className="text-center text-green-600 dark:text-green-400 mt-2 text-sm absolute w-full">{saveMessage}</p>}
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminGeneralConfig;