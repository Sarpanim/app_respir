import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { 
    EyeIcon, PencilIcon, NoSymbolIcon, ArrowPathIcon, XMarkIcon, 
    UserGroupIcon, CheckCircleIcon, CurrencyEuroIcon, EnvelopeIcon,
    DevicePhoneMobileIcon, MapPinIcon, ComputerDesktopIcon
} from '../Icons';
import { SubscriptionPlanId, User } from '../../types';
import { COURSES } from '../../constants';
import { useAppContext } from '../../context/AppContext';

type UserStatus = 'Actif' | 'Banni';

const mockUsers: User[] = [
    { id: 1, name: 'Alice Martin', email: 'alice.martin@respir.app', avatar: 'https://i.pravatar.cc/150?u=alice', plan: 'premium', registrationDate: '2023-01-15', lastLogin: '2023-10-10', status: 'Actif', lastDevice: 'Mobile', location: 'Paris, FR', 
      paymentHistory: [{ date: '2023-09-15', amount: 7.99, invoiceId: 'INV-P23091' }],
      subscriptionHistory: [{plan: 'standard', startDate: '2023-01-15', endDate: '2023-06-14'}, {plan: 'premium', startDate: '2023-06-15', endDate: null}],
      courseProgress: [{courseId: '1', title: COURSES[0].title, progress: 80}, {courseId: '2', title: COURSES[1].title, progress: 45}],
      supportTickets: [{ticketId: 'T-123', subject: 'Problème de lecture', status: 'Fermé'}],
      emailHistory: [
        { id: 'email-1', subject: 'Bienvenue sur RESPIR !', date: '2023-01-15T10:00:00Z', status: 'Ouvert' },
        { id: 'email-2', subject: 'Votre abonnement Premium', date: '2023-06-15T11:30:00Z', status: 'Cliqué' }
      ]
    },
    { id: 2, name: 'Bob Durand', email: 'bob.durand@respir.app', avatar: 'https://i.pravatar.cc/150?u=bob', plan: 'standard', registrationDate: '2023-02-20', lastLogin: '2023-10-09', status: 'Actif', lastDevice: 'Desktop', location: 'Lyon, FR',
      paymentHistory: [{ date: '2023-09-20', amount: 3.99, invoiceId: 'INV-S23092' }],
      subscriptionHistory: [{plan: 'standard', startDate: '2023-02-20', endDate: null}],
      courseProgress: [{courseId: '3', title: COURSES[2].title, progress: 100}],
      supportTickets: [],
      emailHistory: []
    },
    { id: 3, name: 'Charlie Petit', email: 'charlie.petit@respir.app', avatar: 'https://i.pravatar.cc/150?u=charlie', plan: 'free', registrationDate: '2023-03-05', lastLogin: '2023-09-25', status: 'Actif', lastDevice: 'Mobile', location: 'Marseille, FR',
      paymentHistory: [], subscriptionHistory: [{plan: 'free', startDate: '2023-03-05', endDate: null}], courseProgress: [], supportTickets: [], emailHistory: []
    },
    { id: 4, name: 'Diana Leroy', email: 'diana.leroy@respir.app', avatar: 'https://i.pravatar.cc/150?u=diana', plan: 'test', registrationDate: '2023-04-10', lastLogin: '2023-08-12', status: 'Banni', lastDevice: 'Desktop', location: 'Lille, FR',
      paymentHistory: [{ date: '2023-07-10', amount: 1.99, invoiceId: 'INV-B23074' }],
      subscriptionHistory: [{plan: 'basic', startDate: '2023-04-10', endDate: '2023-08-10'}],
      courseProgress: [],
      supportTickets: [{ticketId: 'T-456', subject: 'Demande de remboursement', status: 'Ouvert'}],
      emailHistory: []
    },
    { id: 5, name: 'Eva Moreau', email: 'eva.moreau@respir.app', avatar: 'https://i.pravatar.cc/150?u=eva', plan: 'standard', registrationDate: '2023-05-11', lastLogin: '2023-10-11', status: 'Actif', lastDevice: 'Mobile', location: 'Nantes, FR',
      paymentHistory: [{ date: '2023-09-11', amount: 3.99, invoiceId: 'INV-S23095' }],
      subscriptionHistory: [{plan: 'standard', startDate: '2023-05-11', endDate: null}],
      courseProgress: [{courseId: '4', title: COURSES[3].title, progress: 15}],
      supportTickets: [],
      emailHistory: []
    },
];

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

const DonutChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, d) => acc + d.value, 0);
    if (total === 0) return <div className="flex items-center justify-center h-full text-gray-500">Aucune donnée</div>;
    let accumulated = 0;

    return (
        <div className="flex items-center gap-4">
            <svg viewBox="0 0 42 42" className="w-24 h-24">
                {data.map((d, i) => {
                    const percentage = (d.value / total) * 100;
                    const dasharray = `${percentage} ${100 - percentage}`;
                    const dashoffset = 25 - accumulated;
                    accumulated += percentage;
                    return (
                        <circle
                            key={i}
                            cx="21" cy="21" r="15.915"
                            fill="transparent"
                            stroke={d.color}
                            strokeWidth="6"
                            strokeDasharray={dasharray}
                            strokeDashoffset={dashoffset}
                        />
                    );
                })}
            </svg>
            <div className="text-sm">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                        <span className="font-semibold">{d.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const UserDetailModal: React.FC<{ user: User; onClose: () => void; }> = ({ user, onClose }) => {
    const { subscriptionPlans } = useAppContext();
    const [activeTab, setActiveTab] = useState('info');
    
    const getPlanName = (planId: SubscriptionPlanId) => subscriptionPlans.find(p => p.id === planId)?.name.fr || planId;

    const getEmailStatusBadge = (status: User['emailHistory'][0]['status']) => {
        switch (status) {
            case 'Envoyé': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Ouvert': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Cliqué': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Échoué': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };


    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-light-bg dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-3xl m-4 relative border border-black/20 dark:border-white/20" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                <div className="flex items-center gap-4 mb-6">
                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
                    <div>
                        <h3 className="text-xl font-elsie font-bold text-gray-800 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="border-b border-black/10 dark:border-white/10 mb-4">
                    <div className="flex gap-4 text-sm overflow-x-auto scrollbar-hide">
                        <button onClick={() => setActiveTab('info')} className={`pb-2 font-semibold flex-shrink-0 ${activeTab === 'info' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Infos</button>
                        <button onClick={() => setActiveTab('subs')} className={`pb-2 font-semibold flex-shrink-0 ${activeTab === 'subs' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Abonnements</button>
                        <button onClick={() => setActiveTab('payments')} className={`pb-2 font-semibold flex-shrink-0 ${activeTab === 'payments' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Paiements</button>
                        <button onClick={() => setActiveTab('progress')} className={`pb-2 font-semibold flex-shrink-0 ${activeTab === 'progress' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Progression</button>
                        <button onClick={() => setActiveTab('support')} className={`pb-2 font-semibold flex-shrink-0 ${activeTab === 'support' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Support</button>
                        <button onClick={() => setActiveTab('emails')} className={`pb-2 font-semibold flex-shrink-0 ${activeTab === 'emails' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Emails</button>
                    </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto pr-2 text-sm">
                    {activeTab === 'info' && <div className="grid grid-cols-2 gap-4">
                        <p><span className="font-semibold text-gray-500">Inscrit le:</span> {new Date(user.registrationDate).toLocaleDateString('fr-FR')}</p>
                        <p><span className="font-semibold text-gray-500">Dernière connexion:</span> {new Date(user.lastLogin).toLocaleDateString('fr-FR')}</p>
                        <p><span className="font-semibold text-gray-500">Dernier appareil:</span> {user.lastDevice}</p>
                        <p><span className="font-semibold text-gray-500">Localisation:</span> {user.location}</p>
                    </div>}
                    {activeTab === 'subs' && <ul>{user.subscriptionHistory.map((s,i) => <li key={i}>{getPlanName(s.plan)}: {new Date(s.startDate).toLocaleDateString()} - {s.endDate ? new Date(s.endDate).toLocaleDateString() : 'Actuel'}</li>)}</ul>}
                    {activeTab === 'payments' && <ul>{user.paymentHistory.map((p,i) => <li key={i}>{p.invoiceId} - {p.amount}€ le {new Date(p.date).toLocaleDateString()}</li>)}</ul>}
                    {activeTab === 'progress' && <div>{user.courseProgress.map((c,i) => <div key={i}><p>{c.title}</p><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-accent h-2.5 rounded-full" style={{width: `${c.progress}%`}}></div></div></div>)}</div>}
                    {activeTab === 'support' && <ul>{user.supportTickets.map((t,i) => <li key={i}>{t.ticketId}: {t.subject} ({t.status})</li>)}</ul>}
                    {activeTab === 'emails' && (
                        <div>
                            {user.emailHistory.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="text-xs text-gray-500 uppercase">
                                        <tr><th className="py-2">Objet</th><th className="py-2">Date</th><th className="py-2">Statut</th></tr>
                                    </thead>
                                    <tbody>
                                        {user.emailHistory.map(email => (
                                            <tr key={email.id} className="border-b border-black/10 dark:border-white/10 last:border-0">
                                                <td className="py-2">{email.subject}</td>
                                                <td className="py-2">{new Date(email.date).toLocaleString('fr-FR')}</td>
                                                <td className="py-2"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getEmailStatusBadge(email.status)}`}>{email.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Aucun email n'a été envoyé à cet utilisateur.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SendEmailModal: React.FC<{ user: User; onClose: () => void; }> = ({ user, onClose }) => {
    const { navigateToAdminPage } = useAppContext();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!subject || !message) {
            alert("L'objet et le message sont requis.");
            return;
        }
        // Simulate sending email. In a real app, this would call an API.
        console.log(`Sending email to ${user.email} with subject: ${subject}`);
        alert(`Email envoyé avec succès à ${user.name} !`);
        onClose();
    };
    
    const goToCampaigns = () => {
        onClose();
        navigateToAdminPage('emailCampaigns');
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-light-bg dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg m-4 relative border border-black/20 dark:border-white/20" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                <h3 className="text-xl font-elsie font-bold text-gray-800 dark:text-white mb-1">Envoyer un email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">À: {user.name} ({user.email})</p>
                <div className="space-y-4">
                    <div>
                        <label className="input-label">Objet</label>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="input-style" placeholder="Objet de votre email" />
                    </div>
                    <div>
                        <label className="input-label">Message</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={6} className="input-style" placeholder="Rédigez votre message ici..."></textarea>
                    </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
                        <p>Envoyer un email à plusieurs utilisateurs ?</p>
                        <button onClick={goToCampaigns} className="font-semibold text-accent hover:underline">Gérer les campagnes</button>
                    </div>
                    <button onClick={handleSend} className="px-5 py-2.5 bg-accent text-white rounded-lg font-semibold w-full sm:w-auto">
                        Envoyer
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatusToggle: React.FC<{ active: boolean; onToggle: (newStatus: boolean) => void }> = ({ active, onToggle }) => (
    <button onClick={() => onToggle(!active)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${active ? 'bg-green-500' : 'bg-red-500'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const AdminUserManagement: React.FC = () => {
    const { subscriptionPlans } = useAppContext();
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        plan: 'all',
        regDateStart: '',
        regDateEnd: '',
        lastLoginStart: '',
        lastLoginEnd: '',
    });
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [emailUser, setEmailUser] = useState<User | null>(null);

    const stats = useMemo(() => {
        const planCounts = users.reduce((acc, user) => {
            acc[user.plan] = (acc[user.plan] || 0) + 1;
            return acc;
        }, {} as Record<SubscriptionPlanId, number>);
        return {
            total: users.length,
            active: users.filter(u => u.status === 'Actif').length,
            banned: users.filter(u => u.status === 'Banni').length,
            premium: planCounts.premium || 0,
            plans: planCounts
        };
    }, [users]);
    
    const chartData = useMemo(() => {
        const planColors = ['#A0AEC0', '#63B3ED', '#4FD1C5', '#9F7AEA', '#ED8936', '#F56565'];
        
        const plansWithUsers = subscriptionPlans.filter(plan => stats.plans[plan.id] > 0);

        return plansWithUsers.map((plan, index) => ({
            name: plan.name.fr,
            value: stats.plans[plan.id],
            color: planColors[index % planColors.length],
        }));
    }, [stats.plans, subscriptionPlans]);

    const filteredUsers = useMemo(() => {
        return users
            .filter(user => {
                const term = searchTerm.toLowerCase();
                return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
            })
            .filter(user => filters.status === 'all' || user.status === filters.status)
            .filter(user => filters.plan === 'all' || user.plan === filters.plan)
            .filter(user => !filters.regDateStart || user.registrationDate >= filters.regDateStart)
            .filter(user => !filters.regDateEnd || user.registrationDate <= filters.regDateEnd)
            .filter(user => !filters.lastLoginStart || user.lastLogin >= filters.lastLoginStart)
            .filter(user => !filters.lastLoginEnd || user.lastLogin <= filters.lastLoginEnd);
    }, [users, searchTerm, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubscriptionChange = (userId: number, newPlanId: SubscriptionPlanId) => {
        setUsers(users.map(u => u.id === userId ? {...u, plan: newPlanId} : u));
    };
    
    const handleStatusToggle = (userId: number, newIsActive: boolean) => {
        setUsers(users.map(u => u.id === userId ? {...u, status: newIsActive ? 'Actif' : 'Banni'} : u));
    };

    const getStatusBadge = (status: UserStatus) => status === 'Actif' 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

    return (
        <AdminPageLayout title="Gestion des Utilisateurs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <StatCard icon={<UserGroupIcon className="w-6 h-6 text-blue-500"/>} label="Total Utilisateurs" value={stats.total} color="bg-blue-500/10" />
                    <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-green-500"/>} label="Actifs" value={stats.active} color="bg-green-500/10" />
                    <StatCard icon={<NoSymbolIcon className="w-6 h-6 text-red-500"/>} label="Bannis" value={stats.banned} color="bg-red-500/10" />
                    <StatCard icon={<CurrencyEuroIcon className="w-6 h-6 text-purple-500"/>} label="Abonnés Premium" value={stats.premium} color="bg-purple-500/10" />
                </div>
                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                    <h3 className="font-semibold mb-2 text-sm text-gray-600 dark:text-gray-400">Répartition par formule</h3>
                    <DonutChart data={chartData} />
                </div>
            </div>

            <div className="mb-4 p-4 bg-white/30 dark:bg-black/20 rounded-xl border-t border-black/10 dark:border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Rechercher nom ou email..." className="input-style" />
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="input-style"><option value="all">Tous les statuts</option><option value="Actif">Actif</option><option value="Banni">Banni</option></select>
                    <select name="plan" value={filters.plan} onChange={handleFilterChange} className="input-style"><option value="all">Toutes les formules</option>{subscriptionPlans.map(p => <option key={p.id} value={p.id}>{p.name.fr}</option>)}</select>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                     <div className="input-group"><label>Inscrit entre</label><input type="date" name="regDateStart" value={filters.regDateStart} onChange={handleFilterChange} className="input-style" /><label>et</label><input type="date" name="regDateEnd" value={filters.regDateEnd} onChange={handleFilterChange} className="input-style" /></div>
                     <div className="input-group"><label>Connecté entre</label><input type="date" name="lastLoginStart" value={filters.lastLoginStart} onChange={handleFilterChange} className="input-style" /><label>et</label><input type="date" name="lastLoginEnd" value={filters.lastLoginEnd} className="input-style" /></div>
                </div>
            </div>

            <style>{`.input-style { width: 100%; background-color: rgba(255,255,255,0.7); padding: 0.5rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); font-size: 0.875rem; } .dark .input-style { background-color: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.2); } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #64B6AC; } .input-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #4a5568; } .dark .input-label { color: #d1d5db; } .input-group { display: flex; align-items: center; gap: 0.5rem; } .input-group label { font-size: 0.875rem; color: #4A5568; } .dark .input-group label { color: #A0AEC0; }`}</style>

            <div className="bg-white/30 dark:bg-black/20 rounded-2xl border-t border-black/10 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="p-3">Utilisateur</th><th className="p-3">Abonnement</th><th className="p-3">Inscrit le</th>
                                <th className="p-3">Dernière Conn.</th><th className="p-3">Device</th><th className="p-3">Localisation</th>
                                <th className="p-3">Statut</th><th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-dark-text">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                            <div><p className="font-semibold">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <select value={user.plan} onChange={(e) => handleSubscriptionChange(user.id, e.target.value as SubscriptionPlanId)} className="input-style !py-1 !text-xs">
                                             {subscriptionPlans.map(p => <option key={p.id} value={p.id}>{p.name.fr}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3">{new Date(user.registrationDate).toLocaleDateString('fr-FR')}</td>
                                    <td className="p-3">{new Date(user.lastLogin).toLocaleDateString('fr-FR')}</td>
                                    <td className="p-3 text-center">{user.lastDevice === 'Mobile' ? <DevicePhoneMobileIcon className="w-5 h-5"/> : <ComputerDesktopIcon className="w-5 h-5" />}</td>
                                    <td className="p-3 flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-gray-400"/><span className="text-xs">{user.location}</span></td>
                                    <td className="p-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(user.status)}`}>{user.status}</span></td>
                                    <td className="p-3">
                                        <div className="flex justify-center items-center gap-2">
                                            <StatusToggle active={user.status === 'Actif'} onToggle={(isActive) => handleStatusToggle(user.id, isActive)} />
                                            <button onClick={() => setEmailUser(user)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Envoyer un email"><EnvelopeIcon className="w-5 h-5 text-blue-500" /></button>
                                            <button onClick={() => setSelectedUser(user)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Voir détails"><EyeIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
            {emailUser && <SendEmailModal user={emailUser} onClose={() => setEmailUser(null)} />}
        </AdminPageLayout>
    );
};

export default AdminUserManagement;