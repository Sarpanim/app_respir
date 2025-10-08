import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { HomepageMentorsSettings, HomepageMentor } from '../../types';
import { UserGroupIcon, PlusIcon, TrashIcon, CheckIcon, ArrowPathIcon, PencilIcon, ChevronDownIcon } from '../Icons';
import { v4 as uuidv4 } from 'uuid';

const MentorModal: React.FC<{ mentor: Partial<HomepageMentor>; onSave: (mentor: HomepageMentor) => void; onClose: () => void; }> = ({ mentor, onSave, onClose }) => {
    const [editedMentor, setEditedMentor] = useState(mentor);

    const handleSave = () => {
        if (editedMentor.name && editedMentor.title && editedMentor.avatar) {
            onSave(editedMentor as HomepageMentor);
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    };
    
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setEditedMentor(p => ({...p, avatar: reader.result as string}));
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg mb-4">{mentor.id ? 'Modifier' : 'Ajouter'} un expert</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <img src={editedMentor.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover"/>
                        <div>
                            <input type="file" accept="image/*" id="avatar-upload" className="hidden" onChange={handleAvatarUpload} />
                            <label htmlFor="avatar-upload" className="px-3 py-1.5 bg-accent/80 text-white text-sm rounded-lg cursor-pointer hover:bg-accent">Changer l'avatar</label>
                        </div>
                    </div>
                    <input type="text" value={editedMentor.name || ''} onChange={e => setEditedMentor(p => ({...p, name: e.target.value}))} placeholder="Nom" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg" />
                    <input type="text" value={editedMentor.title || ''} onChange={e => setEditedMentor(p => ({...p, title: e.target.value}))} placeholder="Titre / Rôle" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Annuler</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-lg">Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

const AdminMentorsManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [settings, setSettings] = useState<HomepageMentorsSettings>(JSON.parse(JSON.stringify(generalSettings.homepageMentors)));
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    
    const [editingMentor, setEditingMentor] = useState<Partial<HomepageMentor> | null>(null);

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateGeneralSettings({ ...generalSettings, homepageMentors: settings });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const handleSaveMentor = (mentor: HomepageMentor) => {
        if (mentor.id && settings.mentors.some(m => m.id === mentor.id)) {
            setSettings(p => ({...p, mentors: p.mentors.map(m => m.id === mentor.id ? mentor : m)}));
        } else {
            setSettings(p => ({...p, mentors: [...p.mentors, {...mentor, id: uuidv4()}]}));
        }
        setEditingMentor(null);
    };

    const handleRemoveMentor = (id: string) => {
        if (window.confirm("Supprimer cet expert ?")) {
            setSettings(p => ({...p, mentors: p.mentors.filter(m => m.id !== id)}));
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...settings.mentors];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        setSettings(p => ({...p, mentors: newItems}));
    };

    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><UserGroupIcon className="w-7 h-7" /><span>Gestion "Nos Experts"</span></div>}>
            <div className="space-y-6">
                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Liste des experts</h3>
                        <button onClick={() => setEditingMentor({})} className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-lg font-semibold text-sm"><PlusIcon className="w-4 h-4" /> Ajouter</button>
                    </div>
                    <div className="space-y-2">
                        {settings.mentors.map((mentor, index) => (
                            <div key={mentor.id} className="p-3 bg-black/5 dark:bg-white/5 rounded-lg flex items-center gap-4">
                                <div className="flex flex-col">
                                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5 rotate-180"/></button>
                                    <button onClick={() => handleMove(index, 'down')} disabled={index === settings.mentors.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5"/></button>
                                </div>
                                <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-full object-cover"/>
                                <div className="flex-grow">
                                    <p className="font-semibold">{mentor.name}</p>
                                    <p className="text-sm text-gray-500">{mentor.title}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setEditingMentor(mentor)} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><PencilIcon className="w-4 h-4 text-blue-500"/></button>
                                    <button onClick={() => handleRemoveMentor(mentor.id)} className="p-1 hover:bg-red-500/10 rounded-full"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                                </div>
                            </div>
                        ))}
                        {settings.mentors.length === 0 && <p className="text-center text-sm text-gray-500 py-4">Aucun expert ajouté.</p>}
                    </div>
                </div>

                 <div className="mt-6">
                    <button onClick={handleSave} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'}`}>
                        {saveStatus === 'idle' && 'Enregistrer'}
                        {saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}
                        {saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}
                    </button>
                </div>
            </div>
            {editingMentor && <MentorModal mentor={editingMentor} onSave={handleSaveMentor} onClose={() => setEditingMentor(null)} />}
        </AdminPageLayout>
    );
};

export default AdminMentorsManagement;