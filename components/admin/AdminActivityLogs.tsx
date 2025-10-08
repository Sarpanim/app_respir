import React from 'react';
import AdminPageLayout from './AdminPageLayout';

const AdminActivityLogs: React.FC = () => {
    const logs = [
        { id: 1, user: 'admin@respir.app', action: 'A modifié un cours', date: '10/10/2023 14:30' },
        { id: 2, user: 'user1@respir.app', action: 'S\'est abonné à la formule Premium', date: '10/10/2023 12:15' },
        { id: 3, user: 'moderator@respir.app', action: 'A approuvé un avis', date: '09/10/2023 18:00' },
    ];

    return (
        <AdminPageLayout title="Logs d'Activité">
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-3 rounded-l-lg">Utilisateur</th>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3 rounded-r-lg">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-dark-text">
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0">
                                    <td className="px-6 py-4 font-semibold">{log.user}</td>
                                    <td className="px-6 py-4">{log.action}</td>
                                    <td className="px-6 py-4">{log.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminActivityLogs;