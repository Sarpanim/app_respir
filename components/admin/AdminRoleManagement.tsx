import React from 'react';
import AdminPageLayout from './AdminPageLayout';

const AdminRoleManagement: React.FC = () => {
    const users = [
        { id: 1, email: 'admin@respir.app', role: 'Admin' },
        { id: 2, email: 'moderator@respir.app', role: 'Modérateur' },
        { id: 3, email: 'user1@respir.app', role: 'Utilisateur' },
    ];

    return (
        <AdminPageLayout title="Gestion des Rôles">
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-3 rounded-l-lg">Utilisateur</th>
                                <th className="px-6 py-3">Rôle</th>
                                <th className="px-6 py-3 rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-dark-text">
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0">
                                    <td className="px-6 py-4 font-semibold">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-accent hover:underline text-sm font-semibold">Changer le rôle</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminRoleManagement;