import React from 'react';
import AdminPageLayout from './AdminPageLayout';
import { PencilIcon, TrashIcon } from '../Icons';

const AdminProgramManagement: React.FC = () => {
    const programs = [
        { id: 1, name: 'Défi 7 jours : Pleine Conscience', lessons: 7 },
        { id: 2, name: 'Programme Sommeil Réparateur', lessons: 10 },
        { id: 3, name: 'Maîtrise de l\'Anxiété', lessons: 12 },
    ];

    return (
        <AdminPageLayout title="Gestion des Programmes Thématiques">
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                <ul className="space-y-2">
                    {programs.map((program) => (
                        <li key={program.id} className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                            <div>
                                <p className="font-semibold">{program.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{program.lessons} leçons</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><PencilIcon className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </AdminPageLayout>
    );
};

export default AdminProgramManagement;
