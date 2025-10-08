import React, { useState, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { 
    EyeIcon, ArrowPathIcon, TrashIcon, XMarkIcon, DocumentTextIcon, CheckCircleIcon, 
    ClockIcon as ClockHistoryIcon, XCircleIcon, CurrencyEuroIcon, CloudArrowDownIcon
} from '../Icons';
import { Invoice, InvoiceItem } from '../../types';

const AdminInvoiceManagement: React.FC = () => {
    const { invoices, setInvoices } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const fetchInvoices = () => {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
            setInvoices(invoices);
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleRefresh = () => {
        setError(null);
        fetchInvoices();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
            setInvoices(invoices.filter((inv: Invoice) => inv.id !== id));
        }
    };

    const filteredInvoices = invoices
        .filter((invoice: Invoice) => filter === 'all' || invoice.status === filter)
        .filter((invoice: Invoice) => 
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'Paid': return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-green-100 text-green-800"><CheckCircleIcon className="w-3 h-3"/>Payée</span>;
            case 'Pending': return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800"><ClockHistoryIcon className="w-3 h-3"/>En attente</span>;
            case 'Cancelled': return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-red-100 text-red-800"><XCircleIcon className="w-3 h-3"/>Annulée</span>;
            default: return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-7 h-7" />
                <span>Gestion des Factures</span>
            </div>
        }>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="w-full sm:w-auto flex-grow">
                    <input
                        type="text"
                        placeholder="Rechercher par ID, nom, email..."
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
                        <option value="all">Tous les statuts</option>
                        <option value="Paid">Payée</option>
                        <option value="Pending">En attente</option>
                        <option value="Cancelled">Annulée</option>
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
                                <th className="p-4 font-semibold">ID Facture</th>
                                <th className="p-4 font-semibold">Utilisateur</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Montant</th>
                                <th className="p-4 font-semibold">Statut</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice: Invoice) => (
                                <tr key={invoice.id} className="border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                                    <td className="p-4 font-mono text-xs">{invoice.id}</td>
                                    <td className="p-4">
                                        <div className="font-semibold">{invoice.userName}</div>
                                        <div className="text-gray-500">{invoice.userEmail}</div>
                                    </td>
                                    <td className="p-4">{new Date(invoice.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-semibold">{invoice.amount.toFixed(2)} €</td>
                                    <td className="p-4">{getStatusChip(invoice.status)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => setSelectedInvoice(invoice)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><EyeIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                                            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><CloudArrowDownIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></button>
                                            <button onClick={() => handleDelete(invoice.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold font-elsie">Détails de la Facture</h3>
                            <button onClick={() => setSelectedInvoice(null)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between">
                                <span className="font-semibold">ID Facture:</span>
                                <span className="font-mono text-sm">{selectedInvoice.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Date:</span>
                                <span>{new Date(selectedInvoice.date).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Statut:</span>
                                {getStatusChip(selectedInvoice.status)}
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4">
                                <h4 className="font-semibold mb-2">Client</h4>
                                <p>{selectedInvoice.userName}</p>
                                <p className="text-gray-500">{selectedInvoice.userEmail}</p>
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4">
                                <h4 className="font-semibold mb-2">Détails</h4>
                                <ul className="space-y-2">
                                    {selectedInvoice.items.map((item: InvoiceItem) => (
                                        <li key={item.id} className="flex justify-between">
                                            <span>{item.description} (x{item.quantity})</span>
                                            <span>{item.price.toFixed(2)} €</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{selectedInvoice.amount.toFixed(2)} €</span>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex justify-end gap-3">
                            <button onClick={() => setSelectedInvoice(null)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Fermer</button>
                            <button className="px-4 py-2 rounded-lg bg-accent text-white font-semibold flex items-center gap-2">
                                <CloudArrowDownIcon className="w-5 h-5" />
                                Télécharger PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminInvoiceManagement;