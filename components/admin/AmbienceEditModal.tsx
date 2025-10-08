import React, { useState, useEffect } from 'react';
import { Ambience } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { XMarkIcon } from '../Icons';

interface AmbienceEditModalProps {
    ambience: Partial<Ambience> | null;
    onClose: () => void;
    onSave: (ambience: Ambience) => void;
}

const AmbienceEditModal: React.FC<AmbienceEditModalProps> = ({ ambience, onClose, onSave }) => {
    const { ambienceCategories } = useAppContext();
    const [editedAmbience, setEditedAmbience] = useState<Partial<Ambience>>({});

    useEffect(() => {
        if (ambience) {
            setEditedAmbience({
                ...ambience,
                categoryId: ambience.categoryId || (ambienceCategories.length > 0 ? ambienceCategories[0].id : 1),
                image: ambience.image || { url: '', alt: '', ratio: '16:9', position: 'center' },
            });
        }
    }, [ambience, ambienceCategories]);

    if (!ambience) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedAmbience(prev => ({ ...prev, [name]: name === 'duration' || name === 'categoryId' ? parseInt(value) : value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedAmbience(prev => ({ ...prev, image: { ...(prev.image as object), [name]: value } as any }));
    };

    const handleSave = () => {
        // Basic validation
        if (editedAmbience.title && editedAmbience.audio) {
            onSave(editedAmbience as Ambience);
        } else {
            alert("Le titre et le fichier audio sont requis.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold font-elsie">{editedAmbience.id ? "Modifier l'Ambiance" : "Nouvelle Ambiance"}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                        <input type="text" name="title" value={editedAmbience.title || ''} onChange={handleInputChange} className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                        <select name="categoryId" value={editedAmbience.categoryId} onChange={handleInputChange} className="w-full input-style">
                            {ambienceCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL du fichier audio</label>
                        <input type="text" name="audio" value={editedAmbience.audio || ''} onChange={handleInputChange} className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Durée (secondes)</label>
                        <input type="number" name="duration" value={editedAmbience.duration || 0} onChange={handleInputChange} className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de l'image</label>
                        <input type="text" name="url" value={editedAmbience.image?.url || ''} onChange={handleImageChange} className="w-full input-style" />
                    </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Annuler</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-accent text-white font-semibold">Sauvegarder</button>
                </div>
            </div>
        </div>
    );
};

export default AmbienceEditModal;