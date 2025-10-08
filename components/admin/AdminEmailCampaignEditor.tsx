import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { EmailCampaign } from '../../types';

interface AdminEmailCampaignEditorProps {
    campaign: EmailCampaign;
    onSave: (campaign: EmailCampaign) => void;
    onCancel: () => void;
}

const AdminEmailCampaignEditor: React.FC<AdminEmailCampaignEditorProps> = ({ campaign, onSave, onCancel }) => {
    const [editedCampaign, setEditedCampaign] = useState<EmailCampaign>(campaign);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setEditedCampaign({ ...editedCampaign, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(editedCampaign);
    };

    return (
        <AdminPageLayout title={editedCampaign.id === 0 ? "Créer une Campagne" : "Modifier la Campagne"}>
             <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-6 border border-white/20 dark:border-black/30 space-y-4">
                <style>{`.input-style { width: 100%; background-color: rgba(255,255,255,0.7); padding: 0.5rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); font-size: 0.875rem; } .dark .input-style { background-color: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.2); } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #64B6AC; } .input-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #4a5568; } .dark .input-label { color: #d1d5db; }`}</style>
                
                <div>
                    <label className="input-label" htmlFor="name">Nom de la campagne (interne)</label>
                    <input type="text" id="name" name="name" value={editedCampaign.name} onChange={handleChange} className="input-style" />
                </div>
                
                <div>
                    <label className="input-label" htmlFor="subject">Objet de l'email</label>
                    <input type="text" id="subject" name="subject" value={editedCampaign.subject} onChange={handleChange} className="input-style" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="input-label" htmlFor="sendDate">Date d'envoi</label>
                        <input type="date" id="sendDate" name="sendDate" value={editedCampaign.sendDate} onChange={handleChange} className="input-style" />
                    </div>
                    <div>
                        <label className="input-label" htmlFor="target">Cible</label>
                        <select id="target" name="target" value={editedCampaign.target} onChange={handleChange} className="input-style">
                            <option>Tous</option>
                            <option>Premium</option>
                            <option>Inactifs &gt; 30j</option>
                            <option>Standard</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="input-label">Contenu de l'email (éditeur simple)</label>
                    <textarea 
                        name="content"
                        rows={10} 
                        className="input-style" 
                        placeholder="Bonjour {{user.name}}, ..."
                        value={editedCampaign.content}
                        onChange={handleChange}
                    ></textarea>
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold">Annuler</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-lg font-semibold">Sauvegarder</button>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminEmailCampaignEditor;