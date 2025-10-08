import React, { useState, useMemo } from 'react';
import { Course, Section, Lesson } from '../../types';
import { CATEGORIES } from '../../constants';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, HamburgerIcon, LockClosedIcon, LockOpenIcon } from '../Icons';
import { v4 as uuidv4 } from 'uuid';
import SectionEditModal from './SectionEditModal';
import LessonEditModal from './LessonEditModal';
import { useAppContext } from '../../context/AppContext';

interface CourseEditModalProps {
    course: Course;
    onClose: () => void;
    onSave: (course: Course) => void;
}

const CourseEditModal: React.FC<CourseEditModalProps> = ({ course, onClose, onSave }) => {
    const [editedCourse, setEditedCourse] = useState<Course>(course);
    const [activeTab, setActiveTab] = useState('general');
    const { subscriptionPlans } = useAppContext();
    
    // States for editing sections and lessons
    const [editingSection, setEditingSection] = useState<Section | Partial<Section> | null>(null);
    const [editingLesson, setEditingLesson] = useState<{ lesson: Lesson | Partial<Lesson>, sectionId: string } | null>(null);

    // State for tags input
    const [currentTag, setCurrentTag] = useState('');
    const [imageFileName, setImageFileName] = useState<string | null>(null);
    
    // Validation errors
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const totalDurationMinutes = useMemo(() => 
        Math.round(editedCourse.sections.reduce((total, section) => total + section.lessons.reduce((secTotal, lesson) => secTotal + lesson.duration, 0), 0) / 60)
    , [editedCourse.sections]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedCourse(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedCourse(p => ({ ...p, image: { ...p.image, url: reader.result as string }}));
                setImageFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && currentTag.trim() !== '') {
            e.preventDefault();
            const newTag = currentTag.trim().toLowerCase();
            if (!editedCourse.tags.includes(newTag)) {
                setEditedCourse(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditedCourse(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };
    
    const validateCourse = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        if (!editedCourse.title?.trim()) {
            newErrors.title = 'Le titre est requis';
        }
        
        if (!editedCourse.description?.trim()) {
            newErrors.description = 'La description est requise';
        }
        
        if (!editedCourse.image?.url) {
            newErrors.image = 'Une image de couverture est requise';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSave = () => {
        if (!validateCourse()) {
            setActiveTab('general'); // Switch to general tab to show errors
            return;
        }
        onSave(editedCourse);
    };

    // Section handlers
    const handleSaveSection = (section: Section | Partial<Section>) => {
        if (section.id && editedCourse.sections.some(s => s.id === section.id)) {
            // Editing existing section
            setEditedCourse(prev => ({
                ...prev,
                sections: prev.sections.map(s => s.id === section.id ? section as Section : s)
            }));
        } else {
            // Adding new section
            const newSection: Section = {
                id: uuidv4(),
                title: section.title || '',
                lessons: section.lessons || []
            };
            setEditedCourse(prev => ({
                ...prev,
                sections: [...prev.sections, newSection]
            }));
        }
        setEditingSection(null);
    };
    
    const handleDeleteSection = (sectionId: string) => {
        if (window.confirm("Supprimer cette section et toutes ses leçons ?")) {
            setEditedCourse(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== sectionId) }));
        }
    };
    
    // Lesson handlers
    const handleSaveLesson = (lesson: Lesson | Partial<Lesson>, sectionId: string) => {
        const newSections = editedCourse.sections.map(section => {
            if (section.id === sectionId) {
                if (lesson.id && section.lessons.some(l => l.id === lesson.id)) {
                    // Editing existing lesson
                    return { ...section, lessons: section.lessons.map(l => l.id === lesson.id ? lesson as Lesson : l) };
                } else {
                    // Adding new lesson
                    const newLesson: Lesson = {
                        id: uuidv4(),
                        title: lesson.title || '',
                        duration: lesson.duration || 300,
                        audio: lesson.audio || '',
                        isLocked: lesson.isLocked !== undefined ? lesson.isLocked : true,
                        content: lesson.content,
                        coverImage: lesson.coverImage,
                        attachments: lesson.attachments
                    };
                    return { ...section, lessons: [...section.lessons, newLesson] };
                }
            }
            return section;
        });
        setEditedCourse(prev => ({ ...prev, sections: newSections }));
        setEditingLesson(null);
    };

    const handleDeleteLesson = (lessonId: string, sectionId: string) => {
         if (window.confirm("Supprimer cette leçon ?")) {
            const newSections = editedCourse.sections.map(section => {
                if (section.id === sectionId) {
                    return { ...section, lessons: section.lessons.filter(l => l.id !== lessonId) };
                }
                return section;
            });
            setEditedCourse(prev => ({ ...prev, sections: newSections }));
        }
    };

    const handleToggleLessonLock = (sectionId: string, lessonId: string) => {
        setEditedCourse(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s.id === sectionId) {
                    return { ...s, lessons: s.lessons.map(l => l.id === lessonId ? { ...l, isLocked: !l.isLocked } : l) };
                }
                return s;
            })
        }));
    };

    const handleBulkLock = (sectionId: string, lock: boolean) => {
        setEditedCourse(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s.id === sectionId) {
                    return { ...s, lessons: s.lessons.map(l => ({ ...l, isLocked: lock })) };
                }
                return s;
            })
        }));
    };
    
    const FormField: React.FC<{ label: string; children: React.ReactNode; className?: string; error?: string }> = ({ label, children, className, error }) => (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
            {children}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
    
    const inputClasses = "w-full bg-black/20 p-2.5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent transition-colors";
    
    const TabButton: React.FC<{tab: string, label: string}> = ({ tab, label }) => (
        <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-white'}`}>
            {label}
        </button>
    );
    
    const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
        <button onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${enabled ? 'bg-accent' : 'bg-gray-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[101] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2C2C2E] text-dark-text rounded-2xl shadow-2xl w-full max-w-3xl m-4 relative border border-white/10 flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex-shrink-0 p-6 flex justify-between items-center border-b border-white/10">
                    <h3 className="text-2xl font-elsie font-bold">{course.title ? 'Éditer le Cours' : 'Nouveau Cours'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                <div className="flex-shrink-0 border-b border-white/10 px-6">
                    <TabButton tab="general" label="Informations Générales" />
                    <TabButton tab="structure" label="Structure du Cours" />
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <FormField label="Titre du cours" error={errors.title}>
                                <input 
                                    name="title" 
                                    value={editedCourse.title} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} ${errors.title ? 'border-red-500' : ''}`}
                                    placeholder="Ex: Introduction à la méditation"
                                />
                            </FormField>
                            <FormField label="Description" error={errors.description}>
                                <textarea 
                                    name="description" 
                                    value={editedCourse.description} 
                                    onChange={handleChange} 
                                    rows={5} 
                                    className={`${inputClasses} ${errors.description ? 'border-red-500' : ''}`}
                                    placeholder="Décrivez le contenu et les objectifs du cours..."
                                ></textarea>
                            </FormField>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Catégorie">
                                    <select name="categoryId" value={editedCourse.categoryId} onChange={e => setEditedCourse(p => ({...p, categoryId: parseInt(e.target.value)}))} className={inputClasses}>
                                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Niveau">
                                    <select name="level" value={editedCourse.level} onChange={handleChange} className={inputClasses}>
                                        <option>Débutant</option><option>Intermédiaire</option><option>Avancé</option><option>Expert</option>
                                    </select>
                                </FormField>
                            </div>
                            <FormField label="Formule requise">
                                <select name="requiredPlan" value={editedCourse.requiredPlan} onChange={handleChange} className={inputClasses}>
                                    {subscriptionPlans.filter(plan => plan.isActive).map(plan => (
                                        <option key={plan.id} value={plan.id}>{plan.name.fr}</option>
                                    ))}
                                </select>
                            </FormField>
                            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                <span className="font-medium text-sm text-green-400">Publié</span>
                                <ToggleSwitch enabled={editedCourse.status === 'Publié'} onChange={enabled => setEditedCourse(p => ({...p, status: enabled ? 'Publié' : 'Brouillon'}))} />
                            </div>
                            <FormField label="Image de couverture" error={errors.image}>
                                <div className="flex items-center gap-4">
                                    <img src={editedCourse.image.url || 'https://picsum.photos/seed/placeholder/150'} alt="Aperçu" className="w-20 h-20 object-cover rounded-lg bg-black/20" />
                                    <div>
                                        <input id="cover-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        <label htmlFor="cover-upload" className="cursor-pointer bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                            Choisir un fichier
                                        </label>
                                        <p className="text-xs text-gray-400 mt-2">{imageFileName || 'Aucun fichier choisi'}</p>
                                    </div>
                                </div>
                            </FormField>
                             <FormField label="Tags">
                                <div className={`flex flex-wrap items-center gap-2 p-2 rounded-lg ${inputClasses}`}>
                                    {editedCourse.tags.map(tag => (
                                        <div key={tag} className="flex items-center gap-1 bg-accent/80 text-white text-sm px-2 py-1 rounded-md">
                                            <span>{tag}</span>
                                            <button onClick={() => handleRemoveTag(tag)}><XMarkIcon className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                    <input 
                                        type="text" 
                                        value={currentTag} 
                                        onChange={e => setCurrentTag(e.target.value)} 
                                        onKeyDown={handleAddTag} 
                                        placeholder="Ajouter un tag..." 
                                        className="bg-transparent outline-none flex-grow min-w-[120px]" 
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Appuyez sur Entrée ou virgule pour ajouter un tag</p>
                            </FormField>
                        </div>
                    )}
                     {activeTab === 'structure' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-gray-400">Durée totale : <span className="font-bold text-white">{totalDurationMinutes} minutes</span></p>
                                <button onClick={() => setEditingSection({ title: '', lessons: [] })} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold text-sm hover:bg-accent/90 transition-colors">
                                    <PlusIcon className="w-5 h-5" /> Ajouter une section
                                </button>
                            </div>
                            {editedCourse.sections.length === 0 ? (
                                <div className="text-center py-12 px-6 bg-black/10 rounded-2xl border border-dashed border-white/20">
                                    <p className="text-gray-400 mb-4">Aucune section pour le moment</p>
                                    <button onClick={() => setEditingSection({ title: '', lessons: [] })} className="text-accent font-semibold hover:underline">
                                        Créer la première section
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {editedCourse.sections.map(section => (
                                        <div key={section.id} className="bg-black/20 p-4 rounded-lg border border-white/10">
                                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <HamburgerIcon className="w-5 h-5 text-gray-500 cursor-move" />
                                                    <h5 className="font-bold text-lg">{section.title}</h5>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleBulkLock(section.id, true)} className="p-1.5 hover:bg-white/10 rounded-full" title="Tout verrouiller"><LockClosedIcon className="w-5 h-5 text-yellow-400" /></button>
                                                    <button onClick={() => handleBulkLock(section.id, false)} className="p-1.5 hover:bg-white/10 rounded-full" title="Tout déverrouiller"><LockOpenIcon className="w-5 h-5 text-gray-400" /></button>
                                                    <button onClick={() => setEditingSection(section)} className="p-1.5 hover:bg-white/10 rounded-full" title="Modifier"><PencilIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => handleDeleteSection(section.id)} className="p-1.5 hover:bg-white/10 rounded-full" title="Supprimer"><TrashIcon className="w-5 h-5 text-red-500" /></button>
                                                </div>
                                            </div>
                                            {section.lessons.length === 0 ? (
                                                <p className="text-sm text-gray-500 italic ml-2">Aucune leçon dans cette section</p>
                                            ) : (
                                                <ul className="space-y-2 pl-2">
                                                    {section.lessons.map(lesson => (
                                                        <li key={lesson.id} className="text-sm flex justify-between items-center p-2 rounded-md hover:bg-black/20">
                                                            <div className="flex items-center gap-2">
                                                                <HamburgerIcon className="w-5 h-5 text-gray-500 cursor-move" />
                                                                <span>{lesson.title} ({Math.round(lesson.duration/60)} min)</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button onClick={() => handleToggleLessonLock(section.id, lesson.id)} className="p-1.5 hover:bg-white/10 rounded-full" title={lesson.isLocked ? "Déverrouiller" : "Verrouiller"}>
                                                                    {lesson.isLocked 
                                                                        ? <LockClosedIcon className="w-5 h-5 text-yellow-400" /> 
                                                                        : <LockOpenIcon className="w-5 h-5 text-gray-400" />}
                                                                </button>
                                                                <button onClick={() => setEditingLesson({ lesson, sectionId: section.id })} className="p-1.5 hover:bg-white/10 rounded-full" title="Modifier"><PencilIcon className="w-5 h-5" /></button>
                                                                <button onClick={() => handleDeleteLesson(lesson.id, section.id)} className="p-1.5 hover:bg-white/10 rounded-full" title="Supprimer"><TrashIcon className="w-5 h-5 text-red-500" /></button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <button onClick={() => setEditingLesson({ lesson: { isLocked: true }, sectionId: section.id })} className="text-sm text-accent mt-3 ml-2 flex items-center gap-1 hover:underline">
                                                <PlusIcon className="w-4 h-4"/> Ajouter une leçon
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 flex justify-end space-x-4 p-6 border-t border-white/10 bg-dark-bg">
                    <button onClick={onClose} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors">Annuler</button>
                    <button onClick={handleSave} className="px-6 py-2.5 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors">Enregistrer</button>
                </div>

                {editingSection && <SectionEditModal section={editingSection} onClose={() => setEditingSection(null)} onSave={handleSaveSection} />}
                {editingLesson && <LessonEditModal lesson={editingLesson.lesson} sectionId={editingLesson.sectionId} onClose={() => setEditingLesson(null)} onSave={handleSaveLesson} />}
            </div>
        </div>
    );
};

export default CourseEditModal;