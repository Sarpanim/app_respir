import React, { useState, useEffect } from 'react';
import { Lesson, ImageSettings } from '../../types';
import { XMarkIcon } from '../Icons';

interface LessonEditModalProps {
    lesson: Lesson | null;
    onClose: () => void;
    onSave: (lesson: Lesson) => void;
}

const LessonEditModal: React.FC<LessonEditModalProps> = ({ lesson, onClose, onSave }) => {
    const [editedLesson, setEditedLesson] = useState<Partial<Lesson>>({});

    useEffect(() => {
        setEditedLesson(lesson ? { ...lesson } : {});
    }, [lesson]);

    if (!lesson) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedLesson(prev => ({ ...prev, [name]: name === 'duration' ? parseInt(value) : value }));
    };

    const handleImageChange = (field: keyof ImageSettings, value: string) => {
        setEditedLesson(prev => ({
            ...prev,
            coverImage: {
                ...(prev.coverImage || { url: '', alt: '', ratio: '16:9', position: 'center' }),
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        if (editedLesson.title && editedLesson.audio) {
            onSave(editedLesson as Lesson);
        } else {
            alert("Le titre et l'audio sont requis.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold font-elsie">Éditer la Leçon</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                        <input type="text" name="title" value={editedLesson.title || ''} onChange={handleInputChange} className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Durée (secondes)</label>
                        <input type="number" name="duration" value={editedLesson.duration || 0} onChange={handleInputChange} className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Audio</label>
                        <input type="text" name="audio" value={editedLesson.audio || ''} onChange={handleInputChange} className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenu (texte)</label>
                        <textarea name="content" value={editedLesson.content || ''} onChange={handleInputChange} className="w-full input-style" rows={5}></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Image de couverture</label>
                        <input type="text" value={editedLesson.coverImage?.url || ''} onChange={(e) => handleImageChange('url', e.target.value)} className="w-full input-style" />
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

export default LessonEditModal;