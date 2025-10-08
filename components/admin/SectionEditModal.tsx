
import React, { useState } from 'react';
import { Section } from '../../types';
import { XMarkIcon } from '../Icons';

interface SectionEditModalProps {
    section: Section | Partial<Section>;
    onClose: () => void;
    onSave: (section: Section) => void;
}

const SectionEditModal: React.FC<SectionEditModalProps> = ({ section, onClose, onSave }) => {
    const [title, setTitle] = useState(section.title || '');

    const handleSave = () => {
        if (title.trim()) {
            onSave({ ...section, title: title.trim() } as Section);
        } else {
            alert("Le titre ne peut pas être vide.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" aria-modal="true" role="dialog">
            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-2xl shadow-xl w-full max-w-md relative">
                <h3 className="text-lg font-elsie font-bold mb-4">{section.id ? "Modifier la section" : "Nouvelle section"}</h3>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                
                <div>
                    <label className="block text-sm font-medium">Titre de la section</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mt-1 bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20"
                        autoFocus
                    />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Annuler</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-lg font-semibold">Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

export default SectionEditModal;
