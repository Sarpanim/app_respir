import React from 'react';
import AdminPageLayout from './AdminPageLayout';

const AdminSupportTickets: React.FC = () => {
    const tickets = [
        { id: 'TICKET-001', user: 'user5@respir.app', subject: 'Problème de paiement', status: 'Ouvert' },
        { id: 'TICKET-002', user: 'user6@respir.app', subject: 'Bug dans une leçon', status: 'En cours' },
        { id: 'TICKET-003', user: 'user7@respir.app', subject: 'Question sur l\'abonnement', status: 'Fermé' },
    ];

     const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Ouvert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'En cours': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Fermé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <AdminPageLayout title="Gestion des Tickets de Support">
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-3 rounded-l-lg">ID Ticket</th>
                                <th className="px-6 py-3">Utilisateur</th>
                                <th className="px-6 py-3">Sujet</th>
                                <th className="px-6 py-3 rounded-r-lg">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-dark-text">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0">
                                    <td className="px-6 py-4 font-semibold">{ticket.id}</td>
                                    <td className="px-6 py-4">{ticket.user}</td>
                                    <td className="px-6 py-4">{ticket.subject}</td>
                                    <td className="px-6 py-4">
                                         <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${getStatusBadge(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
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

export default AdminSupportTickets;