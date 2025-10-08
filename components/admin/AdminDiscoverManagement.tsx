
import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { useCourses } from '../../context/CourseContext';
import { DiscoverPageSettings, Course, Category } from '../../types';
import { SparklesIcon, ArrowUpTrayIcon, ChevronDownIcon, CheckIcon, ArrowPathIcon } from '../Icons';
import { CATEGORIES } from '../../constants';

// Reusable components
const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent";
const OptionButton: React.FC<{label: string, value: string, current: string, onClick: () => void}> = ({ label, value, current, onClick }) => (
    <button onClick={onClick} className={`px-3 py-1.5 text-sm rounded-md font-semibold capitalize ${value === current ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/10'}`}>{label}</button>
);
const Section: React.FC<{
    id: string; title: React.ReactNode; children: React.ReactNode; 
    isOpen: boolean; onToggle: () => void; isEnabled?: boolean; onToggleEnabled?: () => void;
    index?: number; total?: number; onMove?: (index: number, direction: 'up' | 'down') => void;
}> = ({ id, title, children, isOpen, onToggle, isEnabled, onToggleEnabled, index, total, onMove }) => (
    <div className="bg-white/30 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-black/30 transition-all duration-300">
        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={onToggle}>
            <div className="flex items-center gap-3">
                 {onMove && typeof index === 'number' && typeof total === 'number' && (
                     <div className="flex flex-col">
                        <button onClick={(e) => { e.stopPropagation(); onMove(index, 'up'); }} disabled={index === 0} className="disabled:opacity-20 disabled:cursor-not-allowed"><ChevronDownIcon className="w-4 h-4 rotate-180"/></button>
                        <button onClick={(e) => { e.stopPropagation(); onMove(index, 'down'); }} disabled={index === total - 1} className="disabled:opacity-20 disabled:cursor-not-allowed"><ChevronDownIcon className="w-4 h-4"/></button>
                    </div>
                 )}
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <div className="flex items-center gap-4">
                {typeof isEnabled === 'boolean' && onToggleEnabled && (
                    <button onClick={(e) => { e.stopPropagation(); onToggleEnabled(); }} className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                )}
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </div>
        {isOpen && <div className="p-4 pt-0 space-y-4 animate-fade-in"><div className="pt-4 border-t border-black/10 dark:border-white/10">{children}</div></div>}
    </div>
);

// Discover Page Components
const DiscoverEditor: React.FC<{
    settings: DiscoverPageSettings,
    setSettings: React.Dispatch<React.SetStateAction<DiscoverPageSettings>>,
    courses: Course[]
}> = ({ settings, setSettings, courses }) => {
    const [openSections, setOpenSections] = useState<string[]>(['header']);
    
    // Handlers specific to Discover page
    const handleToggleSection = (id: string) => setOpenSections(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
    const handleToggleSectionEnabled = (id: string) => setSettings(prev => ({ ...prev, sections: prev.sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s) }));
    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        const newItems = [...settings.sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        setSettings(p => ({ ...p, sections: newItems }));
    };
    const handleHeaderChange = (field: keyof DiscoverPageSettings['header'], value: any) => setSettings(prev => ({ ...prev, header: { ...prev.header, [field]: value } }));
    const handleImageOptionChange = (field: keyof DiscoverPageSettings['header']['image'], value: any) => setSettings(prev => ({...prev, header: {...prev.header, image: {...prev.header.image, [field]: value}}}));
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSettings(prev => ({ ...prev, header: { ...prev.header, image: { ...prev.header.image, url: reader.result as string } } }));
            reader.readAsDataURL(file);
        }
    };
    const handleInputChange = (section: 'categories' | 'courseList' | 'quote', name: string, value: string) => setSettings(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
    const handleToggleCategoryEnabled = (categoryId: number) => setSettings(prev => ({ ...prev, categories: { ...prev.categories, items: prev.categories.items.map(item => item.id === categoryId ? { ...item, enabled: !item.enabled } : item) }}));
    const handleToggleCourseFeatured = (courseId: string) => setSettings(prev => ({ ...prev, courseList: { ...prev.courseList, featuredCourseIds: prev.courseList.featuredCourseIds.includes(courseId) ? prev.courseList.featuredCourseIds.filter(id => id !== courseId) : [...prev.courseList.featuredCourseIds, courseId]}}));

    const sectionDetails: Record<string, { title: string }> = { header: { title: "En-tête" }, categories: { title: 'Catégories' }, 'course-list': { title: 'Cours Mis en Avant' }, quote: { title: 'Citation' } };
    const allCategories = useMemo(() => settings.categories.items.map(item => ({ ...CATEGORIES.find(c => c.id === item.id), ...item })).filter((c): c is Category & {enabled: boolean} => !!c.name), [settings.categories.items]);

    return (
        <div className="space-y-4">
            {settings.sections.map((section, index) => (
                <Section key={section.id} id={section.id} title={sectionDetails[section.id]?.title || 'Section'} isOpen={openSections.includes(section.id)} onToggle={() => handleToggleSection(section.id)} isEnabled={section.enabled} onToggleEnabled={() => handleToggleSectionEnabled(section.id)} index={index} total={settings.sections.length} onMove={handleMoveSection}>
                    {section.type === 'header' && <div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Titre</label><input type="text" value={settings.header.title} onChange={e => handleHeaderChange('title', e.target.value)} className={inputClasses} /></div><div><label className="block text-sm font-medium mb-1">Description</label><textarea value={settings.header.description} onChange={e => handleHeaderChange('description', e.target.value)} rows={3} className={inputClasses} /></div><div><label className="block text-sm font-medium mb-2">Alignement du texte</label><div className="flex gap-2 flex-wrap">{['left', 'center', 'right'].map(align => (<OptionButton key={align} label={align} value={align} current={settings.header.textAlign} onClick={() => handleHeaderChange('textAlign', align as 'left'|'center'|'right')} />))}</div></div><div><label className="block text-sm font-medium mb-1">Image</label><div className="flex items-center gap-2"><input type="text" placeholder="URL de l'image" value={settings.header.image.url} onChange={e => handleImageOptionChange('url', e.target.value)} className={inputClasses} /><input type="file" id="header-image-upload" accept="image/*" className="hidden" onChange={handleImageChange} /><label htmlFor="header-image-upload" className="cursor-pointer p-2.5 bg-accent/80 hover:bg-accent text-white rounded-lg"><ArrowUpTrayIcon className="w-5 h-5"/></label></div>{settings.header.image.url && <img src={settings.header.image.url} alt="Aperçu" className="w-full h-32 object-cover rounded-lg mt-2" />}</div><div><label className="block text-sm font-medium mb-2">Position de l'image</label><div className="flex gap-2 flex-wrap">{['none', 'left', 'right', 'background'].map(pos => (<OptionButton key={pos} label={pos === 'none' ? 'Aucune' : pos} value={pos} current={settings.header.image.position} onClick={() => handleImageOptionChange('position', pos as 'none' | 'left' | 'right' | 'background')} />))}</div></div></div>}
                    {section.type === 'categories' && <div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Titre de la section</label><input type="text" value={settings.categories.title} onChange={e => handleInputChange('categories', 'title', e.target.value)} className={inputClasses} /></div><div className="space-y-2 max-h-96 overflow-y-auto pr-2">{allCategories.map((cat) => cat.id && <div key={cat.id} className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-lg"><img src={cat.image} alt={cat.name} className="w-8 h-8 object-cover rounded-md" /><p className="flex-grow font-semibold text-sm">{cat.name}</p><button onClick={() => handleToggleCategoryEnabled(cat.id)} className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors ${cat.enabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${cat.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>)}</div></div>}
                    {section.type === 'course-list' && <div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Titre de la section</label><input type="text" value={settings.courseList.title} onChange={e => handleInputChange('courseList', 'title', e.target.value)} className={inputClasses} /></div><div className="space-y-2 max-h-96 overflow-y-auto pr-2">{courses.map(course => <div key={course.id} className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-lg"><img src={course.image.url} alt={course.title} className="w-10 h-10 object-cover rounded-md" /><p className="flex-grow font-semibold text-sm truncate">{course.title}</p><button onClick={() => handleToggleCourseFeatured(course.id)} className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors ${settings.courseList.featuredCourseIds.includes(course.id) ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.courseList.featuredCourseIds.includes(course.id) ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>)}</div></div>}
                    {section.type === 'quote' && <div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Texte de la citation</label><textarea value={settings.quote.text} onChange={e => handleInputChange('quote', 'text', e.target.value)} rows={3} className={inputClasses} /></div><div><label className="block text-sm font-medium mb-1">Auteur</label><input type="text" value={settings.quote.author} onChange={e => handleInputChange('quote', 'author', e.target.value)} className={inputClasses} /></div></div>}
                </Section>
            ))}
        </div>
    );
};


// Main Component
const AdminDiscoverManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const { courses } = useCourses();
    
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // Discover Page State
    const [discoverSettings, setDiscoverSettings] = useState<DiscoverPageSettings>(JSON.parse(JSON.stringify(generalSettings.discoverPageSettings)));

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateGeneralSettings({ ...generalSettings, discoverPageSettings: discoverSettings });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    return (
        <AdminPageLayout title="Éditeur Visuel - Page Découvrir">
            <DiscoverEditor settings={discoverSettings} setSettings={setDiscoverSettings} courses={courses} />
            <div className="relative mt-8">
                <button onClick={handleSave} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'}`}>
                    {saveStatus === 'idle' && 'Sauvegarder les changements'}
                    {saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}
                    {saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}
                </button>
            </div>
        </AdminPageLayout>
    );
};

export default AdminDiscoverManagement;
