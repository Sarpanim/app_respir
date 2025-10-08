import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { AboutPageContent, TeamMember } from '../../types';
import { PlusIcon, TrashIcon, InformationCircleIcon } from '../Icons';
import { v4 as uuidv4 } from 'uuid';

const AdminAboutManagement: React.FC = () => {
    const { aboutPageContent, updateAboutPageContent } = useAppContext();
    const [content, setContent] = useState<AboutPageContent>(JSON.parse(JSON.stringify(aboutPageContent)));
    const [saveMessage, setSaveMessage] = useState('');

    const handleMissionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(prev => ({ ...prev, missionStatement: e.target.value }));
    };

    const handleTeamMemberChange = (id: string, field: keyof Omit<TeamMember, 'id'>, value: string) => {
        setContent(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.map(member => 
                member.id === id ? { ...member, [field]: value } : member
            )
        }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleTeamMemberChange(id, 'avatar', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTeamMember = () => {
        const newMember: TeamMember = {
            id: uuidv4(),
            name: 'Nouveau Membre',
            title: 'Titre',
            avatar: 'https://i.pravatar.cc/150?u=' + uuidv4()
        };
        setContent(prev => ({ ...prev, teamMembers: [...prev.teamMembers, newMember] }));
    };

    const removeTeamMember = (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?")) {
            setContent(prev => ({ ...prev, teamMembers: prev.teamMembers.filter(member => member.id !== id) }));
        }
    };
    
    const handleSave = () => {
        updateAboutPageContent(content);
        setSaveMessage('Contenu sauvegardé avec succès !');
        setTimeout(() => setSaveMessage(''), 3000);
    };
    
    const Title = () => (
        <div className="flex items-center justify-center gap-3">
            <InformationCircleIcon className="w-7 h-7" />
            <span>Gestion de la Page "À Propos"</span>
        </div>
    );

    return (
        <AdminPageLayout title={<Title />}>
            <div className="space-y-8">
                <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-6 border border-white/20 dark:border-black/30">
                    <h3 className="font-bold text-lg mb-4">Notre Mission</h3>
                    <textarea 
                        value={content.missionStatement}
                        onChange={handleMissionChange}
                        rows={6}
                        className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>
                
                <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-6 border border-white/20 dark:border-black/30">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">L'équipe</h3>
                        <button onClick={addTeamMember} className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-lg font-semibold text-sm">
                            <PlusIcon className="w-4 h-4" /> Ajouter
                        </button>
                    </div>
                    <div className="space-y-4">
                        {content.teamMembers.map(member => (
                            <div key={member.id} className="flex flex-col md:flex-row items-center gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                                <div className="flex-shrink-0 text-center">
                                    <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                                    <input type="file" accept="image/*" id={`avatar-${member.id}`} className="hidden" onChange={(e) => handleAvatarUpload(e, member.id)} />
                                    <label htmlFor={`avatar-${member.id}`} className="text-xs text-accent block mt-1 cursor-pointer hover:underline">Changer</label>
                                </div>
                                <div className="flex-grow w-full space-y-2">
                                    <input type="text" value={member.name} onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)} placeholder="Nom" className="w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 text-sm font-semibold"/>
                                    <input type="text" value={member.title} onChange={(e) => handleTeamMemberChange(member.id, 'title', e.target.value)} placeholder="Titre/Rôle" className="w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 text-xs"/>
                                </div>
                                <button onClick={() => removeTeamMember(member.id)} className="p-2 hover:bg-red-500/10 rounded-full">
                                    <TrashIcon className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative mt-6">
                    <button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Sauvegarder les changements
                    </button>
                    {saveMessage && <p className="text-center text-green-600 dark:text-green-400 mt-2 text-sm absolute w-full">{saveMessage}</p>}
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminAboutManagement;