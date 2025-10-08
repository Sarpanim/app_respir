import React, { useState, useEffect } from 'react';
import { Course, Section, Lesson } from '../../types';
import { CATEGORIES } from '../../constants';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, HamburgerIcon, LockClosedIcon, LockOpenIcon } from '../Icons';
import { v4 as uuidv4 } from 'uuid';

interface CourseEditModalProps {
    course: Course | null;
    onClose: () => void;
    onSave: (course: Course) => void;
}

const CourseEditModal: React.FC<CourseEditModalProps> = ({ course, onClose, onSave }) => {
    const [editedCourse, setEditedCourse] = useState<Course | null>(null);

    useEffect(() => {
        if (course) {
            setEditedCourse(JSON.parse(JSON.stringify(course)));
        } else {
            setEditedCourse(null);
        }
    }, [course]);

    if (!editedCourse) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedCourse(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSave = () => {
        if (editedCourse) {
            onSave(editedCourse);
        }
    };

    const addSection = () => {
        const newSection: Section = {
            id: uuidv4(),
            title: 'Nouvelle Section',
            lessons: [],
            position: editedCourse.sections.length
        };
        setEditedCourse(prev => prev ? { ...prev, sections: [...prev.sections, newSection] } : null);
    };

    const updateSectionTitle = (sectionId: string, title: string) => {
        setEditedCourse(prev => prev ? {
            ...prev,
            sections: prev.sections.map(s => s.id === sectionId ? { ...s, title } : s)
        } : null);
    };

    const deleteSection = (sectionId: string) => {
        if (window.confirm("Supprimer cette section et toutes ses leçons ?")) {
            setEditedCourse(prev => prev ? {
                ...prev,
                sections: prev.sections.filter(s => s.id !== sectionId)
            } : null);
        }
    };

    const addLesson = (sectionId: string) => {
        const newLesson: Lesson = {
            id: uuidv4(),
            title: 'Nouvelle Leçon',
            duration: 0,
            isLocked: false,
            audio: '',
            content: '',
            coverImage: { url: '', alt: '', ratio: '16:9', position: 'center' },
            position: editedCourse.sections.find(s => s.id === sectionId)?.lessons.length || 0
        };
        setEditedCourse(prev => prev ? {
            ...prev,
            sections: prev.sections.map(s => s.id === sectionId ? { ...s, lessons: [...s.lessons, newLesson] } : s)
        } : null);
    };

    const updateLesson = (sectionId: string, lessonId: string, updatedLesson: Partial<Lesson>) => {
        setEditedCourse(prev => prev ? {
            ...prev,
            sections: prev.sections.map(s => s.id === sectionId ? {
                ...s,
                lessons: s.lessons.map(l => l.id === lessonId ? { ...l, ...updatedLesson } : l)
            } : s)
        } : null);
    };

    const deleteLesson = (sectionId: string, lessonId: string) => {
        setEditedCourse(prev => prev ? {
            ...prev,
            sections: prev.sections.map(s => s.id === sectionId ? {
                ...s,
                lessons: s.lessons.filter(l => l.id !== lessonId)
            } : s)
        } : null);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold font-elsie">Éditer le Cours</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Course Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre du cours</label>
                            <input type="text" name="title" value={editedCourse.title} onChange={handleInputChange} className="w-full input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                            <select name="categoryId" value={editedCourse.categoryId} onChange={handleInputChange} className="w-full input-style">
                                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea name="description" value={editedCourse.description || ''} onChange={handleInputChange} className="w-full input-style" rows={3}></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Niveau</label>
                            <input type="text" name="level" value={editedCourse.level || ''} onChange={handleInputChange} className="w-full input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                            <input type="text" name="image" value={editedCourse.image.url} onChange={e => setEditedCourse(p => p ? {...p, image: {...p.image, url: e.target.value}} : null)} className="w-full input-style" />
                        </div>
                    </div>

                    {/* Sections and Lessons */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Structure du cours</h4>
                        <div className="space-y-4">
                            {editedCourse.sections.map(section => (
                                <div key={section.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 flex-grow">
                                            <HamburgerIcon className="w-5 h-5 text-gray-400 cursor-grab" />
                                            <input 
                                                type="text" 
                                                value={section.title} 
                                                onChange={e => updateSectionTitle(section.id, e.target.value)}
                                                className="font-semibold bg-transparent focus:outline-none focus:ring-1 focus:ring-accent rounded px-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => addLesson(section.id)} className="p-1 text-blue-500 hover:text-blue-700"><PlusIcon className="w-5 h-5"/></button>
                                            <button onClick={() => deleteSection(section.id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pl-7">
                                        {section.lessons.map(lesson => (
                                            <div key={lesson.id} className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded">
                                                <HamburgerIcon className="w-4 h-4 text-gray-400 cursor-grab" />
                                                <input 
                                                    type="text" 
                                                    value={lesson.title}
                                                    onChange={e => updateLesson(section.id, lesson.id, { title: e.target.value })}
                                                    className="flex-grow bg-transparent text-sm focus:outline-none"
                                                />
                                                <span className="text-xs text-gray-400">{lesson.duration} min</span>
                                                <button onClick={() => updateLesson(section.id, lesson.id, { isLocked: !lesson.isLocked })}>
                                                    {lesson.isLocked ? <LockClosedIcon className="w-4 h-4 text-yellow-500"/> : <LockOpenIcon className="w-4 h-4 text-green-500"/>}
                                                </button>
                                                <button onClick={() => deleteLesson(section.id, lesson.id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addSection} className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark">
                            <PlusIcon className="w-5 h-5" />
                            Ajouter une section
                        </button>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Annuler</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-accent text-white font-semibold">Sauvegarder</button>
                </div>
            </div>
        </div>
    );
};

export default CourseEditModal;