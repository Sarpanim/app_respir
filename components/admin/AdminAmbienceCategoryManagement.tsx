import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { AmbienceCategory } from '../../types';
import { TrashIcon, PlusIcon, PencilIcon, CheckIcon, XMarkIcon, MusicalNoteIcon, ArrowUpTrayIcon } from '../Icons';
import { useAppContext } from '../../context/AppContext';

const AdminAmbienceCategoryManagement: React.FC = () => {
    const { ambienceCategories, updateAmbienceCategories } = useAppContext();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');
    const [editingCategory, setEditingCategory] = useState<AmbienceCategory | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                if (target === 'new') {
                    setNewCategoryImage(dataUrl);
                } else if (target === 'edit' && editingCategory && editingCategory.image) {
                    setEditingCategory({ ...editingCategory, image: { ...editingCategory.image, url: dataUrl } });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim() === '') {
            alert("Le nom de la catégorie ne peut pas être vide.");
            return;
        }
        if (ambienceCategories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
            alert("Cette catégorie existe déjà.");
            return;
        }

        const newCategory: AmbienceCategory = {
            id: ambienceCategories.length > 0 ? Math.max(...ambienceCategories.map(c => c.id)) + 1 : 1,
            name: newCategoryName.trim(),
            image: {
                url: newCategoryImage.trim() || `https://picsum.photos/seed/ambcat${new Date().getTime()}/200`,
                alt: newCategoryName.trim(),
                ratio: '1:1',
                position: 'center',
            }
        };
        updateAmbienceCategories([...ambienceCategories, newCategory]);
        setNewCategoryName('');
        setNewCategoryImage('');
    };
    
    const handleDeleteCategory = (categoryId: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.")) {
            updateAmbienceCategories(ambienceCategories.filter(cat => cat.id !== categoryId));
        }
    };
    
    const handleStartEdit = (category: AmbienceCategory) => {
        setEditingCategory(JSON.parse(JSON.stringify(category)));
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
    };
    
    const handleImageOptionChange = (field: 'ratio' | 'position', value: string) => {
        if (!editingCategory || !editingCategory.image) return;
        setEditingCategory(prev => ({
            ...prev!,
            image: { ...prev!.image!, [field]: value }
        }));
    };

    const handleSaveEdit = () => {
        if (editingCategory && editingCategory.name.trim() !== '') {
            if (ambienceCategories.some(cat => cat.name.toLowerCase() === editingCategory.name.trim().toLowerCase() && cat.id !== editingCategory.id)) {
                alert("Une autre catégorie porte déjà ce nom.");
                return;
            }
            updateAmbienceCategories(ambienceCategories.map(cat => cat.id === editingCategory.id ? editingCategory : cat));
            setEditingCategory(null);
        }
    };
    
    const Title = () => (
        <div className="flex items-center justify-center gap-3">
            <MusicalNoteIcon className="w-7 h-7" />
            <span>Gestion des Catégories (Ambiances)</span>
        </div>
    );
    
    const OptionButton: React.FC<{label: string, value: string, current: string, onClick: () => void}> = ({ label, value, current, onClick }) => (
        <button onClick={onClick} className={`px-2 py-0.5 text-xs rounded-full ${value === current ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/10'}`}>{label}</button>
    )

    return (
        <AdminPageLayout title={<Title />}>
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                <div className="mb-6">
                    <h3 className="font-bold mb-2 text-lg">Ajouter une catégorie d'ambiance</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input 
                            type="text" 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nom de la catégorie" 
                            className="flex-grow w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" 
                        />
                        <input 
                            type="file" 
                            accept="image/*" 
                            id="new-cat-image-upload" 
                            className="hidden" 
                            onChange={(e) => handleFileChange(e, 'new')} 
                        />
                        <label 
                            htmlFor="new-cat-image-upload" 
                            className="flex-grow w-full sm:w-auto cursor-pointer flex justify-center items-center gap-2 px-3 py-2 bg-black/5 dark:bg-white/5 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-accent hover:text-accent transition-colors truncate"
                        >
                            <ArrowUpTrayIcon className="w-5 h-5 flex-shrink-0"/>
                            <span className="truncate">{newCategoryImage ? 'Image sélectionnée' : 'Importer une image'}</span>
                        </label>
                        <button 
                            onClick={handleAddCategory}
                            className="bg-accent hover:bg-accent/90 text-white p-2 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                    {newCategoryImage && <img src={newCategoryImage} alt="Aperçu" className="mt-2 rounded-md h-20 w-full object-cover" />}
                </div>
                <div>
                    <h3 className="font-bold mb-4 text-lg">Catégories existantes</h3>
                    <ul className="space-y-2">
                        {ambienceCategories.map((cat) => (
                            <li key={cat.id} className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                                {editingCategory?.id === cat.id ? (
                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        <img src={editingCategory.image?.url} alt={editingCategory.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0"/>
                                        <div className="flex-grow w-full space-y-3">
                                            <input 
                                                type="text"
                                                value={editingCategory.name}
                                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                className="font-semibold bg-white/80 dark:bg-black/50 p-2 rounded-md border border-accent focus:outline-none focus:ring-1 focus:ring-accent w-full"
                                            />
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-3"><span className="font-semibold w-16">Ratio:</span> <OptionButton label="1:1" value="1:1" current={editingCategory.image?.ratio || '1:1'} onClick={() => handleImageOptionChange('ratio', '1:1')} /> <OptionButton label="4:3" value="4:3" current={editingCategory.image?.ratio || '1:1'} onClick={() => handleImageOptionChange('ratio', '4:3')} /> <OptionButton label="16:9" value="16:9" current={editingCategory.image?.ratio || '1:1'} onClick={() => handleImageOptionChange('ratio', '16:9')} /></div>
                                                <div className="flex items-center gap-3"><span className="font-semibold w-16">Position:</span> <OptionButton label="Haut" value="top" current={editingCategory.image?.position || 'center'} onClick={() => handleImageOptionChange('position', 'top')} /> <OptionButton label="Centre" value="center" current={editingCategory.image?.position || 'center'} onClick={() => handleImageOptionChange('position', 'center')} /> <OptionButton label="Bas" value="bottom" current={editingCategory.image?.position || 'center'} onClick={() => handleImageOptionChange('position', 'bottom')} /></div>
                                            </div>
                                             <input type="file" accept="image/*" id={`edit-cat-image-upload-${cat.id}`} className="hidden" onChange={(e) => handleFileChange(e, 'edit')} />
                                             <label htmlFor={`edit-cat-image-upload-${cat.id}`} className="text-accent text-xs font-semibold mt-2 cursor-pointer hover:underline">Changer l'image</label>
                                        </div>
                                        <div className="flex md:flex-col items-center gap-2 flex-shrink-0 self-start md:self-center">
                                            <button onClick={handleSaveEdit} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><CheckIcon className="w-5 h-5 text-green-500" /></button>
                                            <button onClick={handleCancelEdit} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><XMarkIcon className="w-5 h-5 text-gray-500" /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <img src={cat.image?.url} alt={cat.name} className="w-10 h-10 rounded-md object-cover"/>
                                            <span className="font-semibold">{cat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button onClick={() => handleStartEdit(cat)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminAmbienceCategoryManagement;