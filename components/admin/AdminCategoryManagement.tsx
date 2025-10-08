import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { CATEGORIES } from '../../constants';
import { Category } from '../../types';
import { TrashIcon, PlusIcon, PencilIcon, CheckIcon, XMarkIcon, TagIcon } from '../Icons';

const AdminCategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>(CATEGORIES);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);

    const handleAddCategory = () => {
        if (newCategoryName.trim() === '') {
            alert("Le nom de la catégorie ne peut pas être vide.");
            return;
        }
        if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
            alert("Cette catégorie existe déjà.");
            return;
        }

        const newCategory: Category = {
            id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
            name: newCategoryName.trim(),
            image: `https://picsum.photos/seed/cat${new Date().getTime()}/400/300` // Random placeholder image
        };
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
    };

    const handleDeleteCategory = (categoryId: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible et pourrait affecter les cours associés.")) {
            setCategories(categories.filter(cat => cat.id !== categoryId));
        }
    };

    const handleStartEdit = (category: Category) => {
        setEditingCategory({ id: category.id, name: category.name });
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
    };

    const handleSaveEdit = () => {
        if (editingCategory && editingCategory.name.trim() !== '') {
            if (categories.some(cat => cat.name.toLowerCase() === editingCategory.name.trim().toLowerCase() && cat.id !== editingCategory.id)) {
                alert("Une autre catégorie porte déjà ce nom.");
                return;
            }
            setCategories(categories.map(cat => cat.id === editingCategory.id ? { ...cat, name: editingCategory.name.trim() } : cat));
            setEditingCategory(null);
        }
    };
    
    const Title = () => (
        <div className="flex items-center justify-center gap-3">
            <TagIcon className="w-7 h-7" />
            <span>Gestion des Catégories (Cours)</span>
        </div>
    );

    return (
        <AdminPageLayout title={<Title />}>
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                <div className="mb-6">
                    <h3 className="font-bold mb-2 text-lg">Ajouter une catégorie de cours</h3>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                            placeholder="Nom de la catégorie" 
                            className="flex-grow bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" 
                        />
                        <button 
                            onClick={handleAddCategory}
                            className="bg-accent hover:bg-accent/90 text-white p-2 rounded-lg flex items-center justify-center transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold mb-4 text-lg">Catégories existantes</h3>
                    <ul className="space-y-2">
                        {categories.map((cat) => (
                            <li key={cat.id} className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                                {editingCategory?.id === cat.id ? (
                                    <input 
                                        type="text"
                                        value={editingCategory.name}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                        autoFocus
                                        className="font-semibold bg-white/80 dark:bg-black/50 p-1 rounded-md border border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                    />
                                ) : (
                                    <span className="font-semibold">{cat.name}</span>
                                )}
                                <div className="flex items-center gap-2">
                                    {editingCategory?.id === cat.id ? (
                                        <>
                                            <button onClick={handleSaveEdit} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
                                                <CheckIcon className="w-4 h-4 text-green-500" />
                                            </button>
                                            <button onClick={handleCancelEdit} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
                                                <XMarkIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleStartEdit(cat)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
                                                <TrashIcon className="w-4 h-4 text-red-500" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminCategoryManagement;