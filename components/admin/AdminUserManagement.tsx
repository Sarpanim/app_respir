import React, { useState, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { 
    EyeIcon, PencilIcon, NoSymbolIcon, ArrowPathIcon, XMarkIcon, 
    UserGroupIcon, CheckCircleIcon, CurrencyEuroIcon, EnvelopeIcon,
    DevicePhoneMobileIcon, MapPinIcon, ComputerDesktopIcon
} from '../Icons';
import { User } from '../../types';

const AdminUserManagement: React.FC = () => {
    const { users, setUsers } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = () => {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
            setUsers(users);
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRefresh = () => {
        setError(null);
        fetchUsers();
    };

    const handleBan = (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir bannir cet utilisateur ?')) {
            setUsers(users.map((u: User) => u.id === id ? { ...u, status: 'Banned' } : u));
        }
    };
    
    const handleUnban = (id: number) => {
        setUsers(users.map((u: User) => u.id === id ? { ...u, status: 'Actif' } : u));
    };

    const filteredUsers = users
        .filter((user: User) => {
            if (filter === 'all') return true;
            if (filter === 'active') return user.status === 'Actif';
            if (filter === 'banned') return user.status === 'Banned';
            if (filter === 'premium') return user.plan === 'premium';
            return true;
        })
        .filter((user: User) => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'Actif': return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-green-100 text-green-800"><CheckCircleIcon className="w-3 h-3"/>Actif</span>;
            case 'Banned': return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-red-100 text-red-800"><NoSymbolIcon className="w-3 h-3"/>Banni</span>;
            default: return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };
    
    const getSubscriptionChip = (subscription: string) => {
        switch (subscription) {
            case 'premium': return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-purple-100 text-purple-800"><CurrencyEuroIcon className="w-3 h-3"/>Premium</span>;
            case 'free': return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800">Gratuit</span>;
            default: return null;
        }
    };

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <UserGroupIcon className="w-7 h-7" />
                <span>Gestion des Utilisateurs</span>
            </div>
        }>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="w-full sm:w-auto flex-grow">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={filter} 
                        onChange={e => setFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="all">Tous les utilisateurs</option>
                        <option value="active">Actifs</option>
                        <option value="banned">Bannis</option>
                        <option value="premium">Premium</option>
                    </select>
                    <button onClick={handleRefresh} className="p-2 rounded-lg bg-white/50 dark:bg-black/30 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700">
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">{error}</div>}

            <div className="bg-white/30 dark:bg-black/20 rounded-xl shadow-md overflow-hidden border border-white/20 dark:border-black/30">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="p-4 font-semibold">Utilisateur</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Date d'inscription</th>
                                <th className="p-4 font-semibold">Abonnement</th>
                                <th className="p-4 font-semibold">Statut</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user: User) => (
                                <tr key={user.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-semibold">{user.name}</span>
                                    </td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{new Date(user.registrationDate).toLocaleDateString()}</td>
                                    <td className="p-4">{getSubscriptionChip(user.plan)}</td>
                                    <td className="p-4">{getStatusChip(user.status)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => setSelectedUser(user)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><EyeIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                                            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></button>
                                            {user.status === 'Banned' ? (
                                                <button onClick={() => handleUnban(user.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" /></button>
                                            ) : (
                                                <button onClick={() => handleBan(user.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><NoSymbolIcon className="w-5 h-5 text-red-600 dark:text-red-400" /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold font-elsie">Détails de l'utilisateur</h3>
                            <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col items-center">
                                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-24 h-24 rounded-full object-cover mb-2" />
                                <h4 className="text-lg font-bold">{selectedUser.name}</h4>
                                <div className="text-gray-500">{selectedUser.email}</div>
                                <div className="mt-2 flex gap-2">
                                    {getStatusChip(selectedUser.status)}
                                    {getSubscriptionChip(selectedUser.plan)}
                                </div>
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4 space-y-2">
                                <div className="flex items-center gap-3"><EnvelopeIcon className="w-5 h-5 text-gray-500"/><span>{selectedUser.email}</span></div>
                                <div className="flex items-center gap-3"><DevicePhoneMobileIcon className="w-5 h-5 text-gray-500"/><span>{selectedUser.phoneNumber || 'Non renseigné'}</span></div>
                                <div className="flex items-center gap-3"><MapPinIcon className="w-5 h-5 text-gray-500"/><span>{selectedUser.location || 'Non renseigné'}</span></div>
                                <div className="flex items-center gap-3"><ComputerDesktopIcon className="w-5 h-5 text-gray-500"/><span>Dernière connexion: {new Date(selectedUser.lastLogin).toLocaleString()}</span></div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex justify-end">
                            <button onClick={() => setSelectedUser(null)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Fermer</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminUserManagement;