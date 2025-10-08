import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { FaqItem } from '../../types';
import { PlusIcon, TrashIcon, CheckIcon, XMarkIcon, PencilIcon, QuestionMarkCircleIcon } from '../Icons';
import { v4 as uuidv4 } from 'uuid';

const AdminFaqManagement: React.FC = () => {
    const { faqItems, updateFaqItems } = useAppContext();
    const [editingItem, setEditingItem] = useState<Partial<FaqItem> | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleStartEdit = (item: FaqItem) => {
        setEditingItem(JSON.parse(JSON.stringify(item)));
        setIsAdding(false);
    };

    const handleStartAdd = () => {
        setEditingItem({
            id: uuidv4(),
            question: '',
            answer: '',
            category: 'Général',
        });
        setIsAdding(true);
    };

    const handleCancel = () => {
        setEditingItem(null);
        setIsAdding(false);
    };

    const handleSave = () => {
        if (!editingItem || !editingItem.question || !editingItem.answer) {
            alert("La question et la réponse ne peuvent pas être vides.");
            return;
        }

        let updatedItems;
        if (isAdding) {
            updatedItems = [...faqItems, editingItem as FaqItem];
        } else {
            updatedItems = faqItems.map(item => item.id === editingItem.id ? (editingItem as FaqItem) : item);
        }
        updateFaqItems(updatedItems);
        handleCancel();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
            updateFaqItems(faqItems.filter(item => item.id !== id));
        }
    };
    
    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent text-sm";
    
    const EditRow: React.FC = () => (
        <div className="p-4 bg-accent/10 dark:bg-accent/20 rounded-lg space-y-3">
            <input
                type="text"
                placeholder="Question"
                value={editingItem?.question}
                onChange={(e) => setEditingItem(prev => ({ ...prev, question: e.target.value }))}
                className={inputClasses}
            />
            <textarea
                placeholder="Réponse"
                value={editingItem?.answer}
                onChange={(e) => setEditingItem(prev => ({ ...prev, answer: e.target.value }))}
                className={inputClasses}
                rows={3}
            />
            <select
                value={editingItem?.category}
                onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value as FaqItem['category'] }))}
                className={inputClasses}
            >
                <option>Général</option>
                <option>Compte</option>
                <option>Abonnement</option>
            </select>
            <div className="flex justify-end gap-2">
                <button onClick={handleCancel} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><XMarkIcon className="w-5 h-5 text-gray-500" /></button>
                <button onClick={handleSave} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><CheckIcon className="w-5 h-5 text-green-500" /></button>
            </div>
        </div>
    );
    

    return (
        <AdminPageLayout title="Gestion de la FAQ">
            <div className="space-y-4">
                <div className="flex justify-end">
                    <button onClick={handleStartAdd} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold">
                        <PlusIcon className="w-5 h-5" /> Ajouter une question
                    </button>
                </div>
                
                {isAdding && <EditRow />}

                <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30 space-y-2">
                    {faqItems.map(item => (
                        editingItem?.id === item.id && !isAdding
                        ? <EditRow key={item.id} />
                        : (
                            <div key={item.id} className="p-3 bg-black/5 dark:bg-white/5 rounded-lg flex justify-between items-start gap-4">
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.question}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.answer}</p>
                                    <span className="text-xs font-medium mt-2 inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{item.category}</span>
                                </div>
                                <div className="flex-shrink-0 flex flex-col gap-2">
                                    <button onClick={() => handleStartEdit(item)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
                                        <TrashIcon className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminFaqManagement;
