import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { HomepageImageText } from '../../types';
import { ImageIcon, CheckIcon, ArrowPathIcon, ArrowUpTrayIcon } from '../Icons';
import UrlSelector from './UrlSelector';

const AdminImageTextManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [settings, setSettings] = useState<HomepageImageText>(() => {
        const currentSettings = JSON.parse(JSON.stringify(generalSettings.homepageImageText));
        if (!currentSettings.button) {
            currentSettings.button = { enabled: false, text: 'Découvrir', url: '#' };
        }
        return currentSettings;
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateGeneralSettings({ ...generalSettings, homepageImageText: settings });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const handleChange = (field: keyof Omit<HomepageImageText, 'image' | 'button'>, value: string) => {
        setSettings(p => ({ ...p, [field]: value }));
    };

    const handleImageChange = (field: keyof HomepageImageText['image'], value: string) => {
        setSettings(p => ({ ...p, image: { ...p.image, [field]: value } }));
    };
    
    const handleButtonChange = (field: keyof NonNullable<HomepageImageText['button']>, value: any) => {
        setSettings(p => ({ ...p, button: { ...p.button!, [field]: value } }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handleImageChange('url', reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const OptionButton: React.FC<{label: string, value: string, current: string, onClick: () => void}> = ({ label, value, current, onClick }) => (
        <button onClick={onClick} className={`px-3 py-1.5 text-sm rounded-md font-semibold capitalize ${value === current ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/10'}`}>{label}</button>
    );

    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent";

    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><ImageIcon className="w-7 h-7" /><span>Gestion Image & Texte</span></div>}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-6 border border-white/20 dark:border-black/30 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Titre</label>
                        <input type="text" value={settings.title} onChange={e => handleChange('title', e.target.value)} className={inputClasses} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea value={settings.description} onChange={e => handleChange('description', e.target.value)} rows={4} className={inputClasses} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Alignement du Texte</label>
                        <div className="flex gap-2 flex-wrap">
                            <OptionButton label="Gauche" value="left" current={settings.textAlign} onClick={() => handleChange('textAlign', 'left')} />
                            <OptionButton label="Centre" value="center" current={settings.textAlign} onClick={() => handleChange('textAlign', 'center')} />
                            <OptionButton label="Droite" value="right" current={settings.textAlign} onClick={() => handleChange('textAlign', 'right')} />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <div className="flex items-center gap-2">
                            <input type="text" value={settings.image.url} onChange={e => handleImageChange('url', e.target.value)} className={inputClasses} />
                            <input type="file" id="img-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            <label htmlFor="img-upload" className="cursor-pointer p-2.5 bg-accent/80 hover:bg-accent text-white rounded-lg"><ArrowUpTrayIcon className="w-5 h-5"/></label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Position de l'image</label>
                        <div className="flex gap-2 flex-wrap">
                            <OptionButton label="Gauche" value="left" current={settings.image.position} onClick={() => handleImageChange('position', 'left')} />
                            <OptionButton label="Droite" value="right" current={settings.image.position} onClick={() => handleImageChange('position', 'right')} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Ratio de l'image</label>
                        <div className="flex gap-2 flex-wrap">
                            {['1:1', '4:5', '3:2', '16:9'].map(ratio => <OptionButton key={ratio} label={ratio} value={ratio} current={settings.image.ratio} onClick={() => handleImageChange('ratio', ratio)} />)}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-2">Alignement vertical de l'image</label>
                        <div className="flex gap-2 flex-wrap">
                            {['top', 'center', 'bottom'].map(pos => <OptionButton key={pos} label={pos} value={pos} current={settings.image.objectPosition} onClick={() => handleImageChange('objectPosition', pos)} />)}
                        </div>
                    </div>
                    <div className="border-t border-black/10 dark:border-white/10 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <label className="font-semibold">Bouton d'action</label>
                            <button onClick={() => handleButtonChange('enabled', !settings.button?.enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.button?.enabled ? 'bg-accent' : 'bg-gray-400'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.button?.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        {settings.button?.enabled && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Texte du bouton</label>
                                    <input type="text" value={settings.button.text} onChange={e => handleButtonChange('text', e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">URL du bouton</label>
                                    <UrlSelector value={settings.button.url} onChange={newUrl => handleButtonChange('url', newUrl)} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Aperçu</h3>
                    <div className={`bg-white/30 dark:bg-black/20 rounded-2xl p-6 border border-white/20 dark:border-black/30 flex gap-8 items-center ${settings.image.position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-1/2">
                            <img src={settings.image.url || 'https://picsum.photos/600'} alt="Aperçu" className={`w-full h-full object-cover rounded-2xl shadow-lg object-${settings.image.objectPosition}`} style={{ aspectRatio: settings.image.ratio.replace(':', '/') }} />
                        </div>
                        <div className={`flex flex-col w-1/2 text-${settings.textAlign} items-${settings.textAlign === 'left' ? 'start' : settings.textAlign === 'right' ? 'end' : 'center'}`}>
                            <h3 className="text-2xl font-elsie font-bold mb-2">{settings.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{settings.description}</p>
                             {settings.button?.enabled && settings.button.text && (
                                <a href="#" onClick={e => e.preventDefault()} className={`mt-6 inline-block bg-accent text-white font-semibold py-2 px-5 rounded-full self-${settings.textAlign === 'center' ? 'center' : settings.textAlign === 'right' ? 'end' : 'start'}`}>
                                    {settings.button.text}
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="relative mt-2">
                        <button onClick={handleSave} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'}`}>
                            {saveStatus === 'idle' && 'Enregistrer'}
                            {saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}
                            {saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}
                        </button>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminImageTextManagement;