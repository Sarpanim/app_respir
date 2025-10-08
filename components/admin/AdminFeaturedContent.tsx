import React from 'react';
import AdminPageLayout from './AdminPageLayout';

const AdminFeaturedContent: React.FC = () => {
    const courses = [
        { id: 1, name: 'Introduction à la Pleine Conscience', featured: true },
        { id: 2, name: 'Yoga Énergisant du Matin', featured: false },
        { id: 3, name: 'Gérer l\'Anxiété par la Méditation', featured: true },
    ];

    const ToggleSwitch: React.FC<{ checked: boolean }> = ({ checked }) => (
         <button
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg ${checked ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <AdminPageLayout title="Mise en Avant de Contenu">
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                <ul className="space-y-2">
                    {courses.map((course) => (
                        <li key={course.id} className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                            <span className="font-semibold">{course.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Recommandé</span>
                                <ToggleSwitch checked={course.featured} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </AdminPageLayout>
    );
};

export default AdminFeaturedContent;
