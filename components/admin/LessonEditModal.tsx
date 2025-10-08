import React, { useState } from 'react';
import { Lesson, Attachment } from '../../types';
import { XMarkIcon, ArrowUpTrayIcon, TrashIcon, MusicalNoteIcon, DocumentTextIcon, ImageIcon } from '../Icons';

interface LessonEditModalProps {
    lesson: Lesson | Partial<Lesson>;
    sectionId: string;
    onClose: () => void;
    onSave: (lesson: Lesson, sectionId: string) => void;
}

const LessonEditModal: React.FC<LessonEditModalProps> = ({ lesson, sectionId, onClose, onSave }) => {
    const [editedLesson, setEditedLesson] = useState<Partial<Lesson>>({
        ...lesson,
        duration: lesson.duration ? Math.round(lesson.duration / 60) : 5,
    });
    const [activeTab, setActiveTab] = useState('info');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedLesson(prev => ({ ...prev, [name]: name === 'duration' ? parseInt(value) || 0 : value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'audio' | 'coverImage' | 'attachment') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            if (field === 'audio') {
                setEditedLesson(prev => ({ ...prev, audio: dataUrl }));
            } else if (field === 'coverImage') {
                setEditedLesson(prev => ({ 
                    ...prev, 
                    coverImage: { 
                        url: dataUrl, 
                        ratio: prev.coverImage?.ratio || '16:9',
                        position: prev.coverImage?.position || 'center'
                    } 
                }));
            } else if (field === 'attachment') {
                const newAttachment: Attachment = { name: file.name, url: dataUrl, type: file.type };
                setEditedLesson(prev => ({ ...prev, attachments: [...(prev.attachments || []), newAttachment]}));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageOptionChange = (field: 'ratio' | 'position', value: string) => {
        if (!editedLesson.coverImage) return;
        setEditedLesson(prev => ({
            ...prev,
            coverImage: { ...prev.coverImage!, [field]: value }
        }));
    };

    const removeAttachment = (index: number) => {
        setEditedLesson(prev => ({
            ...prev,
            attachments: (prev.attachments || []).filter((_, i) => i !== index)
        }));
    };

    const handleSave = () => {
        if (editedLesson.title?.trim()) {
            const finalLesson = { ...editedLesson };
            if (typeof finalLesson.duration === 'number') {
                finalLesson.duration = finalLesson.duration * 60; // Convert minutes back to seconds
            }
            onSave(finalLesson as Lesson, sectionId);
        } else {
             alert("Le titre ne peut pas être vide.");
        }
    };

    const TabButton: React.FC<{tab: string, label: string}> = ({ tab, label }) => (
        <button onClick={() => setActiveTab(tab)} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold transition-colors duration-300 border-b-2 ${activeTab === tab ? 'text-accent border-accent' : 'text-gray-500 border-transparent'}`}>
            {label}
        </button>
    );
    
    const OptionButton: React.FC<{label: string, value: string, current: string, onClick: () => void}> = ({ label, value, current, onClick }) => (
        <button onClick={onClick} className={`px-3 py-1 text-xs rounded-full ${value === current ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/10'}`}>{label}</button>
    )

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" aria-modal="true" role="dialog">
            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-2xl shadow-xl w-full max-w-2xl relative flex flex-col h-[90vh]">
                <h3 className="text-lg font-elsie font-bold mb-4 flex-shrink-0">{lesson.id ? "Modifier la leçon" : "Nouvelle leçon"}</h3>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                
                <div className="border-b border-black/10 dark:border-white/10 flex-shrink-0 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center">
                       <TabButton tab="info" label="Informations" />
                       <TabButton tab="contenu" label="Contenu écrit" />
                       <TabButton tab="medias" label="Médias" />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto py-4 pr-2 space-y-6">
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Titre de la leçon</label>
                                <input type="text" name="title" value={editedLesson.title || ''} onChange={handleChange} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20" autoFocus />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Durée (en minutes)</label>
                                <input type="number" name="duration" value={editedLesson.duration || 5} onChange={handleChange} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Fichier Audio 🎵</label>
                                <input id="audio-upload" type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 'audio')} className="hidden"/>
                                <label htmlFor="audio-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-accent hover:text-accent transition-colors">
                                    <ArrowUpTrayIcon className="w-5 h-5"/>
                                    <span>{editedLesson.audio ? 'Changer le fichier audio' : 'Importer un fichier audio'}</span>
                                </label>
                                {editedLesson.audio && <audio src={editedLesson.audio} controls className="w-full mt-2 h-10"></audio>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'contenu' && (
                         <div>
                            <label className="block text-sm font-medium mb-1">Contenu écrit ✍️</label>
                            <p className="text-xs text-gray-500 mb-2">Markdown est supporté pour la mise en forme.</p>
                            <textarea name="content" value={editedLesson.content || ''} onChange={handleChange} rows={12} className="w-full bg-white/50 dark:bg-black/30 p-3 rounded-lg border border-black/20 dark:border-white/20 font-mono text-sm"></textarea>
                        </div>
                    )}
                    
                    {activeTab === 'medias' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Image de couverture (optionnelle) 📷</label>
                                <input id="cover-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} className="hidden"/>
                                {editedLesson.coverImage?.url ? (
                                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                                        <img src={editedLesson.coverImage.url} alt="Aperçu" className="w-full rounded-md mb-3" style={{ aspectRatio: editedLesson.coverImage.ratio.replace(':', '/'), objectFit: 'cover', objectPosition: editedLesson.coverImage.position }} />
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-3"><span className="font-semibold w-16">Ratio:</span> <OptionButton label="1:1" value="1:1" current={editedLesson.coverImage.ratio} onClick={() => handleImageOptionChange('ratio', '1:1')} /> <OptionButton label="4:3" value="4:3" current={editedLesson.coverImage.ratio} onClick={() => handleImageOptionChange('ratio', '4:3')} /> <OptionButton label="16:9" value="16:9" current={editedLesson.coverImage.ratio} onClick={() => handleImageOptionChange('ratio', '16:9')} /></div>
                                            <div className="flex items-center gap-3"><span className="font-semibold w-16">Position:</span> <OptionButton label="Haut" value="top" current={editedLesson.coverImage.position} onClick={() => handleImageOptionChange('position', 'top')} /> <OptionButton label="Centre" value="center" current={editedLesson.coverImage.position} onClick={() => handleImageOptionChange('position', 'center')} /> <OptionButton label="Bas" value="bottom" current={editedLesson.coverImage.position} onClick={() => handleImageOptionChange('position', 'bottom')} /></div>
                                            <button onClick={() => document.getElementById('cover-upload')?.click()} className="text-accent text-xs font-semibold mt-2">Changer l'image</button>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor="cover-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 w-full px-4 py-10 bg-black/5 dark:bg-white/5 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-accent hover:text-accent transition-colors">
                                       <ImageIcon className="w-8 h-8"/><span>Ajouter une image</span>
                                    </label>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Annexe (optionnelle) 📑</label>
                                <input id="attachment-upload" type="file" onChange={(e) => handleFileChange(e, 'attachment')} className="hidden" />
                                <div className="space-y-2">
                                {(editedLesson.attachments || []).map((att, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-black/5 dark:bg-white/5 rounded-md text-sm">
                                        <div className="flex items-center gap-2"><DocumentTextIcon className="w-5 h-5 text-gray-500"/><span className="font-semibold">{att.name}</span></div>
                                        <button onClick={() => removeAttachment(index)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                                    </div>
                                ))}
                                </div>
                                <button onClick={() => document.getElementById('attachment-upload')?.click()} className="text-accent text-sm font-semibold mt-2">Ajouter un fichier</button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Annuler</button>
                    <button onClick={handleSave} className="px-5 py-2 bg-accent text-white rounded-lg font-semibold">Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

export default LessonEditModal;