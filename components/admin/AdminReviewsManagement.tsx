
import React, { useState, useMemo } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
// Fix: Import HomepageReviewsSettings type
import { HomepageReview, HomepageReviewsSettings } from '../../types';
import { ChatBubbleOvalLeftEllipsisIcon, PlusIcon, TrashIcon, CheckIcon, ArrowPathIcon, PencilIcon, StarIcon, ChevronDownIcon } from '../Icons';
import { v4 as uuidv4 } from 'uuid';

const ReviewModal: React.FC<{ review: Partial<HomepageReview>; onSave: (review: HomepageReview) => void; onClose: () => void; }> = ({ review, onSave, onClose }) => {
    const [editedReview, setEditedReview] = useState(review);

    const handleSave = () => {
        if (editedReview.author && editedReview.comment && editedReview.rating) {
            onSave(editedReview as HomepageReview);
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedReview(p => ({...p, avatar: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg mb-4">{review.id ? 'Modifier' : 'Ajouter'} un avis</h3>
                <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <img src={editedReview.avatar || `https://i.pravatar.cc/150?u=${editedReview.author || 'default'}`} alt="avatar" className="w-16 h-16 rounded-full object-cover"/>
                        <div>
                            <input type="file" accept="image/*" id="review-avatar-upload" className="hidden" onChange={handleAvatarUpload} />
                            <label htmlFor="review-avatar-upload" className="px-3 py-1.5 bg-accent/80 text-white text-sm rounded-lg cursor-pointer hover:bg-accent">Changer</label>
                        </div>
                    </div>
                    <input type="text" value={editedReview.author || ''} onChange={e => setEditedReview(p => ({...p, author: e.target.value}))} placeholder="Auteur" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg" />
                    <textarea value={editedReview.comment || ''} onChange={e => setEditedReview(p => ({...p, comment: e.target.value}))} placeholder="Commentaire" rows={4} className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg" />
                    <div className="flex items-center gap-2">
                        <label>Note:</label>
                        <div className="flex">
                            {[1,2,3,4,5].map(star => <StarIcon key={star} onClick={() => setEditedReview(p => ({...p, rating: star}))} className={`w-6 h-6 cursor-pointer ${star <= (editedReview.rating || 0) ? 'text-yellow-400' : 'text-gray-400'}`} />)}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Annuler</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-lg">Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

const AdminReviewsManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [settings, setSettings] = useState<HomepageReviewsSettings>(JSON.parse(JSON.stringify(generalSettings.homepageReviews)));
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    
    const [editingReview, setEditingReview] = useState<Partial<HomepageReview> | null>(null);
    
    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateGeneralSettings({ ...generalSettings, homepageReviews: settings });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const handleSaveReview = (review: HomepageReview) => {
        if (review.id && settings.reviews.some(r => r.id === review.id)) {
            setSettings(p => ({...p, reviews: p.reviews.map(r => r.id === review.id ? review : r)}));
        } else {
            setSettings(p => ({...p, reviews: [...p.reviews, {...review, id: uuidv4()}]}));
        }
        setEditingReview(null);
    };

    const handleRemoveReview = (id: string) => {
        if (window.confirm("Supprimer cet avis ?")) {
            setSettings(p => ({...p, reviews: p.reviews.filter(r => r.id !== id)}));
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...settings.reviews];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        setSettings(p => ({...p, reviews: newItems}));
    };

    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" /><span>Gestion Avis Personnalisés</span></div>}>
            <div className="space-y-6">
                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl space-y-4">
                    <h3 className="font-bold text-lg">Animation du carrousel</h3>
                    <div className="flex items-center justify-between">
                        <label>Activer l'animation</label>
                        <button onClick={() => setSettings(p => ({...p, animation: {...p.animation, enabled: !p.animation.enabled}}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.animation.enabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.animation.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                    </div>
                    <div>
                        <label>Vitesse de défilement (secondes)</label>
                        <input type="range" min="10" max="120" step="5" value={settings.animation.speed} onChange={e => setSettings(p => ({...p, animation: {...p.animation, speed: Number(e.target.value)}}))} className="w-full mt-1 accent-accent" disabled={!settings.animation.enabled}/>
                        <div className="text-center text-sm">{settings.animation.speed}s</div>
                    </div>
                </div>

                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Avis personnalisés</h3>
                        <button onClick={() => setEditingReview({})} className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-lg font-semibold text-sm"><PlusIcon className="w-4 h-4" /> Ajouter</button>
                    </div>
                    <div className="space-y-2">
                        {settings.reviews.map((review, index) => (
                            <div key={review.id} className="p-3 bg-black/5 dark:bg-white/5 rounded-lg flex items-start gap-4">
                                <div className="flex flex-col mt-1">
                                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5 rotate-180"/></button>
                                    <button onClick={() => handleMove(index, 'down')} disabled={index === settings.reviews.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5"/></button>
                                </div>
                                <img src={review.avatar || `https://i.pravatar.cc/150?u=${review.author}`} alt={review.author} className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1" />

                                <div className="flex-grow">
                                    <div className="flex mb-1">{[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`} />)}</div>
                                    <p className="text-sm italic">"{review.comment}"</p>
                                    <p className="font-semibold text-xs text-right mt-1">- {review.author}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => setEditingReview(review)} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"><PencilIcon className="w-4 h-4 text-blue-500"/></button>
                                    <button onClick={() => handleRemoveReview(review.id)} className="p-1 hover:bg-red-500/10 rounded-full"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                                </div>
                            </div>
                        ))}
                        {settings.reviews.length === 0 && <p className="text-center text-sm text-gray-500 py-4">Aucun avis personnalisé.</p>}
                    </div>
                </div>

                 <div className="mt-6">
                    <button onClick={handleSave} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'}`}>
                        {saveStatus === 'idle' && 'Enregistrer'}
                        {saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}
                        {saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}
                    </button>
                </div>
            </div>
            {editingReview && <ReviewModal review={editingReview} onSave={handleSaveReview} onClose={() => setEditingReview(null)} />}
        </AdminPageLayout>
    );
};

export default AdminReviewsManagement;
