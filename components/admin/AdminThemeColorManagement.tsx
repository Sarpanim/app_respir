import React, { useState, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { SwatchIcon, CheckIcon, HomeIcon, SparklesIcon, UserIcon, ChevronDownIcon } from '../Icons';
import { ThemeColors, GeneralSettings } from '../../types';
import { DEFAULT_THEME_COLORS } from '../../constants';

const PreviewPanel: React.FC<{ colors: ThemeColors; generalSettings: GeneralSettings }> = ({ colors, generalSettings }) => {
    const previewStyles: React.CSSProperties = {};
    for (const key of Object.keys(colors) as Array<keyof ThemeColors>) {
        (previewStyles as any)[`--color-${key}`] = colors[key];
    }

    return (
        <div className="sticky top-28 space-y-4">
            <h3 className="font-bold text-lg">Aperçu en direct</h3>
            
            {/* Light Theme Preview */}
            <div style={{...previewStyles, background: `var(--color-light-bg)`}} className="p-4 rounded-xl border border-black/20 dark:border-white/20">
                <h4 className="text-sm font-bold mb-2 text-center text-[var(--color-card-text-light)]">Thème Clair</h4>

                <div className="flex items-center justify-between mb-2 px-2 h-10 border-b border-black/10" style={{ background: `var(--color-header-bg-light)`}}>
                    <div className="flex items-center gap-2">
                        {generalSettings.appLogo && (
                            <div
                              className={`bg-[var(--color-accent)]`}
                              style={{
                                height: `24px`,
                                width: `24px`,
                                maskImage: `url(${generalSettings.appLogo})`,
                                WebkitMaskImage: `url(${generalSettings.appLogo})`,
                                maskSize: 'contain', WebkitMaskSize: 'contain',
                                maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
                                maskPosition: 'center', WebkitMaskPosition: 'center',
                              }}
                            ></div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-[var(--color-header-text-inactive-light)]">
                        <span className="flex items-center gap-1">Explorer <ChevronDownIcon className="w-3 h-3"/></span>
                    </div>
                </div>

                <div className="bg-white/30 backdrop-filter backdrop-blur-xl rounded-lg overflow-hidden shadow-md mt-2">
                    <div className="relative">
                        <img className="w-full h-20 object-cover" src="https://picsum.photos/seed/course1/400/300" alt="Preview"/>
                    </div>
                    <div className="p-3">
                        <span className="inline-block bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)] rounded-full px-2 py-0.5 text-xs font-semibold">Catégorie</span>
                        <h3 className="text-md font-elsie font-bold mt-1 text-[var(--color-card-title-light)]">Titre du cours</h3>
                        <p className="text-[var(--color-card-text-light)] text-xs mt-1">Description courte de la leçon...</p>
                    </div>
                </div>

                <div className="mt-3 bg-[var(--color-navbar-bg-light)] border border-black/10 dark:border-white/10 rounded-lg flex justify-around h-14 items-center">
                    <div className="flex flex-col items-center text-[var(--color-navbar-text-active)]">
                        <HomeIcon className="w-5 h-5"/>
                        <span className="text-[10px]">Accueil</span>
                    </div>
                    <div className="flex flex-col items-center text-[var(--color-navbar-text-inactive-light)]">
                        <SparklesIcon className="w-5 h-5"/>
                        <span className="text-[10px]">Découvrir</span>
                    </div>
                    <div className="flex flex-col items-center text-[var(--color-navbar-text-inactive-light)]">
                        <UserIcon className="w-5 h-5"/>
                        <span className="text-[10px]">Profil</span>
                    </div>
                </div>
            </div>

            {/* Dark Theme Preview */}
            <div style={{...previewStyles, background: `var(--color-dark-bg)`}} className="p-4 rounded-xl border border-black/20 dark:border-white/20">
                <h4 className="text-sm font-bold mb-2 text-center text-[var(--color-dark-text)]">Thème Sombre</h4>
                
                 <div className="flex items-center justify-between mb-2 px-2 h-10 border-b border-white/10" style={{ background: `var(--color-header-bg-dark)`}}>
                    <div className="flex items-center gap-2">
                        {generalSettings.appLogo && (
                            <div
                              className={`bg-[var(--color-accent)]`}
                              style={{
                                height: `24px`,
                                width: `24px`,
                                maskImage: `url(${generalSettings.appLogo})`,
                                WebkitMaskImage: `url(${generalSettings.appLogo})`,
                                maskSize: 'contain', WebkitMaskSize: 'contain',
                                maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
                                maskPosition: 'center', WebkitMaskPosition: 'center',
                              }}
                            ></div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-[var(--color-header-text-inactive-dark)]">
                        <span className="flex items-center gap-1">Explorer <ChevronDownIcon className="w-3 h-3"/></span>
                    </div>
                </div>

                <div className="bg-[var(--color-dark-card)] rounded-lg overflow-hidden shadow-md mt-2">
                     <div className="relative">
                        <img className="w-full h-20 object-cover" src="https://picsum.photos/seed/course1/400/300" alt="Preview"/>
                    </div>
                    <div className="p-3">
                        <span className="inline-block bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)] rounded-full px-2 py-0.5 text-xs font-semibold">Catégorie</span>
                        <h3 className="text-md font-elsie font-bold mt-1 text-[var(--color-card-title-dark)]">Titre du cours</h3>
                        <p className="text-[var(--color-card-text-dark)] text-xs mt-1">Description courte de la leçon...</p>
                    </div>
                </div>

                <div className="mt-3 bg-[var(--color-navbar-bg-dark)] border border-white/10 rounded-lg flex justify-around h-14 items-center">
                    <div className="flex flex-col items-center text-[var(--color-navbar-text-active)]">
                        <HomeIcon className="w-5 h-5"/>
                        <span className="text-[10px]">Accueil</span>
                    </div>
                    <div className="flex flex-col items-center text-[var(--color-navbar-text-inactive-dark)]">
                        <SparklesIcon className="w-5 h-5"/>
                        <span className="text-[10px]">Découvrir</span>
                    </div>
                    <div className="flex flex-col items-center text-[var(--color-navbar-text-inactive-dark)]">
                        <UserIcon className="w-5 h-5"/>
                        <span className="text-[10px]">Profil</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

const AdminThemeColorManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [colors, setColors] = useState<ThemeColors>(generalSettings.themeColors);
    const [otherSettings, setOtherSettings] = useState({ cardShadowEnabled: generalSettings.cardShadowEnabled });
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setColors(generalSettings.themeColors);
        setOtherSettings({ cardShadowEnabled: generalSettings.cardShadowEnabled });
    }, [generalSettings.themeColors, generalSettings.cardShadowEnabled]);

    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleToggle = (key: 'cardShadowEnabled') => {
        setOtherSettings(prev => ({...prev, [key]: !prev[key]}));
        setHasChanges(true);
    };

    const handleSave = () => {
        updateGeneralSettings({ 
            ...generalSettings, 
            themeColors: colors,
            cardShadowEnabled: otherSettings.cardShadowEnabled,
        });
        setHasChanges(false);
    };
    
    const handleReset = () => {
        if (window.confirm("Réinitialiser les couleurs et l'apparence par défaut ?")) {
            updateGeneralSettings({
                ...generalSettings,
                themeColors: DEFAULT_THEME_COLORS,
                cardShadowEnabled: true,
            });
            // The useEffect will also handle this, but setting it here ensures immediate UI feedback.
            setColors(DEFAULT_THEME_COLORS);
            setOtherSettings({ cardShadowEnabled: true });
            setHasChanges(false);
        }
    };

    const colorGroups = {
        'Général': [
            { key: 'accent', label: 'Accent', description: 'Couleur principale pour les boutons, liens, et icônes.' },
            { key: 'accent-light', label: 'Accent Clair', description: 'Variante claire pour les surlignages (ex: abonnement actuel).' },
            { key: 'secondary', label: 'Secondaire', description: "Mise en avant d'éléments (ex: offres populaires)." }
        ],
        'Thème Clair': [
            { key: 'light-bg', label: 'Arrière-plan', description: 'Couleur de fond ou dégradé CSS.' },
        ],
        'Thème Sombre': [
            { key: 'dark-bg', label: 'Arrière-plan', description: 'Couleur de fond ou dégradé CSS.' },
            { key: 'dark-card', label: 'Fond des cartes' },
            { key: 'dark-text', label: 'Texte principal' }
        ],
        'Cartes': [
            { key: 'card-title-light', label: 'Titre (clair)' },
            { key: 'card-text-light', label: 'Texte (clair)' },
            { key: 'card-title-dark', label: 'Titre (sombre)' },
            { key: 'card-text-dark', label: 'Texte (sombre)' }
        ],
        'Header (Menu du haut)': [
            { key: 'header-bg-light', label: 'Fond (clair)' },
            { key: 'header-bg-dark', label: 'Fond (sombre)' },
            { key: 'header-text-active', label: 'Texte Actif' },
            { key: 'header-text-hover', label: 'Texte Hover' },
            { key: 'header-text-inactive-light', label: 'Texte Inactif (clair)' },
            { key: 'header-text-inactive-dark', label: 'Texte Inactif (sombre)' }
        ],
        'Barre de Navigation (Mobile)': [
            { key: 'navbar-bg-light', label: 'Fond (clair)' },
            { key: 'navbar-bg-dark', label: 'Fond (sombre)' },
            { key: 'navbar-text-active', label: 'Texte Actif' },
            { key: 'navbar-text-inactive-light', label: 'Texte Inactif (clair)' },
            { key: 'navbar-text-inactive-dark', label: 'Texte Inactif (sombre)' }
        ],
        'Réseaux Sociaux': [
            { key: 'social-email', label: 'Email' },
            { key: 'social-facebook', label: 'Facebook' }
        ],
    };

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <SwatchIcon className="w-7 h-7" />
                <span>Gestion des couleurs du thème</span>
            </div>
        }>
            <div className="flex justify-end mb-4">
                 <button onClick={handleReset} className="w-full sm:w-auto px-4 py-2 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg font-semibold text-sm">
                    Réinitialiser par défaut
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
                        <h3 className="font-bold mb-4">Apparence</h3>
                        <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 flex items-center justify-between">
                            <label htmlFor="cardShadowEnabled" className="font-medium text-gray-800 dark:text-gray-300">
                                Activer l'ombre sur les cartes
                            </label>
                            <button
                                id="cardShadowEnabled"
                                onClick={() => handleToggle('cardShadowEnabled')}
                                className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors duration-300 ${otherSettings.cardShadowEnabled ? 'bg-accent' : 'bg-gray-400'}`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${otherSettings.cardShadowEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    {Object.entries(colorGroups).map(([groupName, colorInfo]) => (
                        <div key={groupName} className="bg-white/30 dark:bg-black/20 p-4 rounded-xl border border-white/20 dark:border-black/30">
                            <h3 className="font-bold mb-4">{groupName}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                {(colorInfo as {key: keyof ThemeColors, label: string, description?: string}[]).map(({ key, label, description }) => {
                                    const isGradientCompatible = key === 'light-bg' || key === 'dark-bg';
                                    const isValidColor = /^#([0-9a-f]{3}){1,2}$/i.test(colors[key]);
                                    
                                    return (
                                        <div key={key}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                                            {description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>}
                                            <div className="flex items-center gap-2 bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20">
                                                <input
                                                    type="color"
                                                    value={isValidColor ? colors[key] : '#ffffff'}
                                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                                    className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                                                    style={{'--webkit-appearance': 'none'} as React.CSSProperties}
                                                />
                                                <input
                                                    type="text"
                                                    value={colors[key]}
                                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                                    placeholder={isGradientCompatible ? '#ffffff ou gradient' : ''}
                                                    className="w-full bg-transparent font-mono text-sm focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <PreviewPanel colors={colors} generalSettings={generalSettings} />
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

export default AdminThemeColorManagement;