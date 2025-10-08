

import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useCourses } from '../../context/CourseContext';
import { Course } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../Icons';
import { CATEGORIES } from '../../constants';
import CourseEditModal from './CourseEditModal';
import { v4 as uuidv4 } from 'uuid';

const ITEMS_PER_PAGE = 6;

const AdminCourseManagement: React.FC = () => {
    const { courses, setCourses } = useCourses();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const filteredCourses = useMemo(() => {
        return courses
            .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(course => statusFilter === 'all' || course.status === statusFilter)
            .filter(course => categoryFilter === 'all' || course.categoryId === parseInt(categoryFilter));
    }, [courses, searchTerm, statusFilter, categoryFilter]);

    const paginatedCourses = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCourses, currentPage]);

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

    const handleOpenAddModal = () => {
        setEditingCourse({
            id: uuidv4(),
            title: '',
            description: '',
            image: { url: '', ratio: '16:9', position: 'center' },
            categoryId: 1,
            level: 'Débutant',
            requiredPlan: 'free',
            status: 'Brouillon',
            tags: [],
            sections: [],
            rating: 0,
            reviewCount: 0,
            studentCount: 0,
            reviews: [],
            mentor: { name: '', avatar: '', title: '' },
        });
    };

    const handleSaveCourse = (courseToSave: Course) => {
        const originalCourse = courses.find(c => c.id === courseToSave.id);
        
        const wasPaid = originalCourse ? originalCourse.requiredPlan !== 'free' : false;
        const isNowPaid = courseToSave.requiredPlan !== 'free';

        let finalCourse = courseToSave;

        if (wasPaid !== isNowPaid) {
            finalCourse = {
                ...courseToSave,
                sections: courseToSave.sections.map((section, sectionIndex) => ({
                    ...section,
                    lessons: section.lessons.map((lesson, lessonIndex) => ({
                        ...lesson,
                        isLocked: isNowPaid ? !(sectionIndex === 0 && lessonIndex === 0) : false
                    }))
                }))
            };
        }

        if (courses.some(c => c.id === finalCourse.id)) {
            setCourses(courses.map(c => c.id === finalCourse.id ? finalCourse : c));
        } else {
            setCourses([...courses, finalCourse]);
        }
        setEditingCourse(null);
    };

    const handleDeleteCourse = (courseId: string) => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.")) {
            setCourses(courses.filter(c => c.id !== courseId));
        }
    }

    return (
        <AdminPageLayout title="Gestion des Cours">
            <div className="mb-4 p-4 bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-black/30 flex flex-col md:flex-row gap-4 items-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Rechercher un cours..."
                    className="w-full md:flex-1 bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <div className="w-full md:w-auto flex-shrink-0 grid grid-cols-2 md:flex md:gap-4 gap-2">
                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent">
                        <option value="all">Tous les statuts</option>
                        <option value="Publié">Publié</option>
                        <option value="Brouillon">Brouillon</option>
                    </select>
                    <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent">
                        <option value="all">Toutes les catégories</option>
                        {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                <button onClick={handleOpenAddModal} className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors w-full md:w-auto">
                    <PlusIcon className="w-5 h-5" /> Ajouter un cours
                </button>
            </div>
            
            {paginatedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedCourses.map(course => (
                        <div key={course.id} className="bg-white/30 dark:bg-black/20 rounded-2xl p-3 border border-white/20 dark:border-black/30 flex flex-col shadow-sm hover:shadow-lg transition-shadow">
                            <img src={course.image.url || 'https://picsum.photos/seed/placeholder/400/300'} alt={course.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                            <h4 className="font-bold font-elsie flex-grow line-clamp-2">{course.title}</h4>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${course.status === 'Publié' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                    {course.status}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setEditingCourse(course)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" aria-label={`Modifier ${course.title}`}><PencilIcon className="w-5 h-5 text-blue-500" /></button>
                                    <button onClick={() => handleDeleteCourse(course.id)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" aria-label={`Supprimer ${course.title}`}><TrashIcon className="w-5 h-5 text-red-500" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12 px-6 bg-white/20 dark:bg-black/10 rounded-2xl">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Aucun cours trouvé</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Essayez d'ajuster vos filtres ou d'ajouter un nouveau cours.</p>
                </div>
            )}

            {totalPages > 1 && (
                 <div className="mt-6 p-4 flex justify-center items-center gap-2 text-sm">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-white/50 dark:bg-black/30 disabled:opacity-50">Précédent</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-md ${currentPage === page ? 'bg-accent text-white' : 'bg-white/50 dark:bg-black/30'}`}>{page}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md bg-white/50 dark:bg-black/30 disabled:opacity-50">Suivant</button>
                </div>
            )}

            {editingCourse && (
                <CourseEditModal
                    course={editingCourse}
                    onClose={() => setEditingCourse(null)}
                    onSave={handleSaveCourse}
                />
            )}
        </AdminPageLayout>
    );
};

export default AdminCourseManagement;