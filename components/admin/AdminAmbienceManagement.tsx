import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { PencilIcon, TrashIcon, PlusIcon } from '../Icons';
import { useAppContext } from '../../context/AppContext';
import { Ambience } from '../../types';
import AmbienceEditModal from './AmbienceEditModal';

const AdminAmbienceManagement: React.FC = () => {
    const { ambiences, updateAmbiences } = useAppContext();
    const [editingAmbience, setEditingAmbience] = useState<Partial<Ambience> | null>(null);
    const [deletingAmbience, setDeletingAmbience] = useState<Ambience | null>(null);

    const handleSave = (ambienceToSave: Ambience) => {
        if (!ambiences.some(a => a.id === ambienceToSave.id)) {
            const newId = ambiences.length > 0 ? Math.max(...ambiences.map(a => a.id)) + 1 : 1;
            updateAmbiences([...ambiences, { ...ambienceToSave, id: newId }]);
        } else {
            updateAmbiences(ambiences.map(a => a.id === ambienceToSave.id ? ambienceToSave : a));
        }
        setEditingAmbience(null);
    };

    const handleDelete = () => {
        if (deletingAmbience) {
            updateAmbiences(ambiences.filter(a => a.id !== deletingAmbience.id));
            setDeletingAmbience(null);
        }
    };

    return (
        <AdminPageLayout title="Gestion des Ambiances Sonores">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setEditingAmbience({})}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" /> Ajouter une ambiance
                </button>
            </div>
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                <ul className="space-y-2">
                    {ambiences.map((ambience) => (
                        <li key={ambience.id} className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                            <div className="flex items-center gap-4">
                                <img src={ambience.image.url} alt={ambience.title} className="w-12 h-12 rounded-md object-cover" />
                                <div>
                                    <p className="font-semibold">{ambience.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{Math.round(ambience.duration / 60)} min</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setEditingAmbience(ambience)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><PencilIcon className="w-4 h-4" /></button>
                                <button onClick={() => setDeletingAmbience(ambience)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {editingAmbience && (
                <AmbienceEditModal
                    ambience={editingAmbience}
                    onClose={() => setEditingAmbience(null)}
                    onSave={handleSave}
                />
            )}

            {deletingAmbience && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-2xl shadow-xl w-full max-w-sm m-4 relative border border-red-500/50">
                        <h3 className="text-lg font-elsie font-bold mb-2 text-red-600 dark:text-red-500">Supprimer l'ambiance</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            Êtes-vous sûr de vouloir supprimer "{deletingAmbience.title}" ? Cette action est irréversible.
                        </p>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={() => setDeletingAmbience(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold">Annuler</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminAmbienceManagement;