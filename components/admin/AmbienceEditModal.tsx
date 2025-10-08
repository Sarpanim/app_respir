import React, { useState } from 'react';
import { Ambience } from '../../types';
import { XMarkIcon, ArrowUpTrayIcon } from '../Icons';
import { useAppContext } from '../../context/AppContext';

interface AmbienceEditModalProps {
    ambience: Partial<Ambience>;
    onClose: () => void;
    onSave: (ambience: Ambience) => void;
}

const AmbienceEditModal: React.FC<AmbienceEditModalProps> = ({ ambience, onClose, onSave }) => {
    const { ambienceCategories } = useAppContext();
    const [edited, setEdited] = useState<Partial<Ambience>>({
        ...ambience,
        duration: ambience.duration ? Math.round(ambience.duration / 60) : 10,
        categoryId: ambience.categoryId || (ambienceCategories.length > 0 ? ambienceCategories[0].id : 1),
        image: ambience.image || { url: '', ratio: '16:9', position: 'center' },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEdited(prev => ({ ...prev, [name]: name === 'duration' || name === 'categoryId' ? parseInt(value) || 0 : value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'audio') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                if (field === 'image') {
                    setEdited(prev => ({ ...prev, image: { ...prev.image!, url: dataUrl } }));
                } else {
                     setEdited(prev => ({ ...prev, [field]: dataUrl }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleImageOptionChange = (field: 'ratio' | 'position', value: string) => {
        setEdited(prev => ({
            ...prev,
            image: { ...prev.image!, [field]: value }
        }));
    };

    const handleSave = () => {
        if (!edited.title || !edited.image?.url || !edited.audio) {
            alert("Veuillez remplir tous les champs : titre, image et audio.");
            return;
        }
        onSave({
            ...edited,
            duration: (edited.duration || 0) * 60,
        } as Ambience);
    };

    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent transition-colors";
    
    const OptionButton: React.FC<{label: string, value: string, current: string, onClick: () => void}> = ({ label, value, current, onClick }) => (
        <button onClick={onClick} className={`px-3 py-1 text-xs rounded-full ${value === current ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/10'}`}>{label}</button>
    );

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-dark-text p-6 rounded-2xl shadow-xl w-full max-w-lg m-4 relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-elsie font-bold mb-6">{ambience.id ? "Modifier" : "Nouvelle"} ambiance</h3>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Titre</label>
                        <input type="text" name="title" value={edited.title || ''} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
                            <input type="number" name="duration" value={edited.duration} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Catégorie</label>
                            <select name="categoryId" value={edited.categoryId} onChange={handleChange} className={inputClasses}>
                                {ambienceCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Image</label>
                        <input type="text" value={edited.image?.url || ''} onChange={(e) => setEdited(p => ({...p, image: {...p.image!, url: e.target.value}}))} placeholder="URL de l'image" className={inputClasses} />
                        <span className="text-xs text-gray-500 my-1 block text-center">ou</span>
                        <input id="image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="hidden"/>
                        <label htmlFor="image-upload" className="cursor-pointer flex justify-center items-center gap-2 w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg text-sm hover:border-accent hover:text-accent">
                            <ArrowUpTrayIcon className="w-4 h-4" /> Importer
                        </label>
                        {edited.image?.url && (
                            <div className="mt-2 space-y-2">
                                <img src={edited.image.url} alt="Aperçu" className="rounded-md h-24 w-full object-cover" style={{ objectPosition: edited.image.position }}/>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-3"><span className="font-semibold w-16">Ratio:</span> <OptionButton label="1:1" value="1:1" current={edited.image.ratio} onClick={() => handleImageOptionChange('ratio', '1:1')} /> <OptionButton label="4:3" value="4:3" current={edited.image.ratio} onClick={() => handleImageOptionChange('ratio', '4:3')} /> <OptionButton label="16:9" value="16:9" current={edited.image.ratio} onClick={() => handleImageOptionChange('ratio', '16:9')} /></div>
                                    <div className="flex items-center gap-3"><span className="font-semibold w-16">Position:</span> <OptionButton label="Haut" value="top" current={edited.image.position} onClick={() => handleImageOptionChange('position', 'top')} /> <OptionButton label="Centre" value="center" current={edited.image.position} onClick={() => handleImageOptionChange('position', 'center')} /> <OptionButton label="Bas" value="bottom" current={edited.image.position} onClick={() => handleImageOptionChange('position', 'bottom')} /></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Audio</label>
                        <input type="text" name="audio" value={edited.audio || ''} onChange={handleChange} placeholder="URL du fichier audio" className={inputClasses} />
                        <span className="text-xs text-gray-500 my-1 block text-center">ou</span>
                        <input id="audio-upload" type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 'audio')} className="hidden"/>
                        <label htmlFor="audio-upload" className="cursor-pointer flex justify-center items-center gap-2 w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg text-sm hover:border-accent hover:text-accent">
                             <ArrowUpTrayIcon className="w-4 h-4" /> Importer
                        </label>
                        {edited.audio && <audio src={edited.audio} controls className="w-full mt-2 h-10"></audio>}
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-8">
                    <button onClick={onClose} className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Annuler</button>
                    <button onClick={handleSave} className="px-5 py-2.5 bg-accent text-white rounded-lg font-semibold">Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

export default AmbienceEditModal;