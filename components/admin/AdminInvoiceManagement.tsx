import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { 
    EyeIcon, ArrowPathIcon, TrashIcon, XMarkIcon, DocumentTextIcon, CheckCircleIcon, 
    ClockHistoryIcon, XCircleIcon, CurrencyEuroIcon, CloudArrowDownIcon 
} from '../Icons';

type InvoiceStatus = 'Payé' | 'En attente' | 'Échoué';
type PaymentMethod = 'Carte de crédit' | 'PayPal' | 'Virement';

interface Invoice {
    id: string;
    user: string;
    amount: number;
    date: string; // YYYY-MM-DD
    paymentMethod: PaymentMethod;
    status: InvoiceStatus;
}

const mockInvoices: Invoice[] = [
    { id: 'INV-2023001', user: 'alice.martin@respir.app', amount: 3.99, date: '2023-09-30', paymentMethod: 'Carte de crédit', status: 'Payé' },
    { id: 'INV-2023002', user: 'bob.durand@respir.app', amount: 7.99, date: '2023-10-01', paymentMethod: 'PayPal', status: 'Payé' },
    { id: 'INV-2023003', user: 'charlie.petit@respir.app', amount: 1.99, date: '2023-10-02', paymentMethod: 'Carte de crédit', status: 'En attente' },
    { id: 'INV-2023004', user: 'diana.leroy@respir.app', amount: 3.99, date: '2023-10-03', paymentMethod: 'Carte de crédit', status: 'Échoué' },
    { id: 'INV-2023005', user: 'eva.moreau@respir.app', amount: 34.99, date: '2023-09-14', paymentMethod: 'Virement', status: 'Payé' },
    { id: 'INV-2023006', user: 'frank.dubois@respir.app', amount: 64.99, date: '2023-09-19', paymentMethod: 'PayPal', status: 'Échoué' },
    { id: 'INV-2023007', user: 'grace.lambert@respir.app', amount: 3.99, date: '2023-08-31', paymentMethod: 'Carte de crédit', status: 'Payé' },
    { id: 'INV-2023008', user: 'hugo.bernard@respir.app', amount: 1.99, date: '2023-10-05', paymentMethod: 'Carte de crédit', status: 'En attente' },
];

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const InvoiceDetailModal: React.FC<{ invoice: Invoice; onClose: () => void }> = ({ invoice, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-light-bg dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg m-4 relative border border-black/20 dark:border-white/20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-elsie font-bold text-gray-800 dark:text-white">Détails de la Facture</h3>
                        <p className="text-sm font-mono text-gray-500">{invoice.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="mt-6 border-t border-black/10 dark:border-white/10 pt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Utilisateur:</span>
                        <span className="font-semibold">{invoice.user}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Date:</span>
                        <span className="font-semibold">{new Date(invoice.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Montant:</span>
                        <span className="font-semibold text-lg text-accent">{invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Moyen de paiement:</span>
                        <span className="font-semibold">{invoice.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Statut:</span>
                        <span className="font-semibold">{invoice.status}</span>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                        <CloudArrowDownIcon className="w-5 h-5" />
                        Télécharger en PDF
                    </button>
                </div>
            </div>
        </div>
    );
};


const AdminInvoiceManagement: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        paymentMethod: 'all',
        startDate: '',
        endDate: '',
    });
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    
    const stats = useMemo(() => {
        const paidInvoices = invoices.filter(i => i.status === 'Payé');
        return {
            total: invoices.length,
            paid: paidInvoices.length,
            pending: invoices.filter(i => i.status === 'En attente').length,
            failed: invoices.filter(i => i.status === 'Échoué').length,
            revenue: paidInvoices.reduce((sum, i) => sum + i.amount, 0),
        };
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        return invoices
            .filter(invoice => {
                const term = searchTerm.toLowerCase();
                return invoice.id.toLowerCase().includes(term) || invoice.user.toLowerCase().includes(term);
            })
            .filter(invoice => filters.status === 'all' || invoice.status === filters.status)
            .filter(invoice => filters.paymentMethod === 'all' || invoice.paymentMethod === filters.paymentMethod)
            .filter(invoice => !filters.startDate || invoice.date >= filters.startDate)
            .filter(invoice => !filters.endDate || invoice.date <= filters.endDate);
    }, [invoices, searchTerm, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const getStatusBadge = (status: InvoiceStatus) => {
        switch (status) {
            case 'Payé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'En attente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Échoué': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };

    return (
        <AdminPageLayout title="Gestion des Factures">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                <StatCard icon={<DocumentTextIcon className="w-6 h-6 text-blue-500"/>} label="Factures" value={stats.total} color="bg-blue-500/10" />
                <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-green-500"/>} label="Payées" value={stats.paid} color="bg-green-500/10" />
                <StatCard icon={<ClockHistoryIcon className="w-6 h-6 text-yellow-500"/>} label="En attente" value={stats.pending} color="bg-yellow-500/10" />
                <StatCard icon={<XCircleIcon className="w-6 h-6 text-red-500"/>} label="Échouées" value={stats.failed} color="bg-red-500/10" />
                <StatCard icon={<CurrencyEuroIcon className="w-6 h-6 text-purple-500"/>} label="Chiffre d'affaires" value={`${stats.revenue.toFixed(2).replace('.',',')}€`} color="bg-purple-500/10" />
            </div>

            <div className="mb-4 p-4 bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-black/30">
                <div className="flex flex-wrap items-center gap-4">
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Rechercher ID ou utilisateur..." className="w-full lg:w-auto lg:flex-1 bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" />
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full sm:w-auto bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent">
                        <option value="all">Tous les statuts</option>
                        <option value="Payé">Payé</option>
                        <option value="En attente">En attente</option>
                        <option value="Échoué">Échoué</option>
                    </select>
                    <select name="paymentMethod" value={filters.paymentMethod} onChange={handleFilterChange} className="w-full sm:w-auto bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent">
                        <option value="all">Tous les moyens</option>
                        <option value="Carte de crédit">Carte de crédit</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Virement">Virement</option>
                    </select>
                     <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" />
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                </div>
            </div>

            <div className="bg-white/30 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-black/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="px-4 py-3">ID Facture</th>
                                <th className="px-4 py-3">Utilisateur</th>
                                <th className="px-4 py-3">Montant</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Paiement</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-dark-text">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                                    <td className="px-4 py-3 font-semibold font-mono text-xs">
                                        <div>INV-</div>
                                        <div>{invoice.id.split('-')[1]}</div>
                                    </td>
                                    <td className="px-4 py-3">{invoice.user}</td>
                                    <td className="px-4 py-3">{invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                                    <td className="px-4 py-3">{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-4 py-3">{invoice.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${getStatusBadge(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center items-center gap-1">
                                            <button onClick={() => setSelectedInvoice(invoice)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Voir"><EyeIcon className="w-5 h-5" /></button>
                                            <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Relancer"><ArrowPathIcon className="w-5 h-5 text-blue-500" /></button>
                                            <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Supprimer"><TrashIcon className="w-5 h-5 text-red-500" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedInvoice && <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
        </AdminPageLayout>
    );
};

export default AdminInvoiceManagement;