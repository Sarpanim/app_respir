import React from 'react';
import AdminPageLayout from './AdminPageLayout';

const AdminNotifications: React.FC = () => {
    return (
        <AdminPageLayout title="Notifications Push / Emails">
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-6 border border-white/20 dark:border-black/30 space-y-4">
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Titre</label>
                    <input 
                        type="text" 
                        id="title" 
                        className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" 
                        placeholder="Nouveau cours disponible !"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Message</label>
                    <textarea 
                        id="message" 
                        rows={4}
                        className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Découvrez notre nouveau cours sur le Yoga Énergisant..."
                    ></textarea>
                </div>
                 <button className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Envoyer la Notification
                </button>
            </div>
        </AdminPageLayout>
    );
};

export default AdminNotifications;
