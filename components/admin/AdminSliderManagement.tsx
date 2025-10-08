import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { HomepageSlide, HomepageSlider } from '../../types';
import { PhotoIcon, PlusIcon, TrashIcon, CheckIcon, ArrowPathIcon, ChevronDownIcon } from '../Icons';
import { v4 as uuidv4 } from 'uuid';
import UrlSelector from './UrlSelector';

type SliderKey = 'homepageSlider' | 'homepageSlider2' | 'homepageSlider3';

const OptionButton: React.FC<{label: string, value: string, current: string, onClick: () => void}> = ({ label, value, current, onClick }) => (
    <button onClick={onClick} className={`px-2 py-1 text-xs rounded-md font-semibold capitalize ${value === current ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/10'}`}>{label}</button>
);

const AdminSliderManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [activeSlider, setActiveSlider] = useState<SliderKey>('homepageSlider');
    const [sliders, setSliders] = useState({
        homepageSlider: JSON.parse(JSON.stringify(generalSettings.homepageSlider)),
        homepageSlider2: JSON.parse(JSON.stringify(generalSettings.homepageSlider2)),
        homepageSlider3: JSON.parse(JSON.stringify(generalSettings.homepageSlider3)),
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const currentSlider = sliders[activeSlider];

    const updateSlider = (update: Partial<HomepageSlider>) => {
        setSliders(prev => ({ ...prev, [activeSlider]: { ...prev[activeSlider], ...update } }));
    };

    const addSlide = () => {
        const newSlide: HomepageSlide = { 
            id: uuidv4(), 
            image: { url: 'https://picsum.photos/seed/newslide/1200/500', position: 'background', ratio: '16:9', objectPosition: 'center' },
            title: 'Nouveau Slide', 
            subtitle: '', 
            textAlign: 'left',
            button: { enabled: true, text: 'Découvrir', url: '#' } 
        };
        updateSlider({ slides: [...currentSlider.slides, newSlide] });
    };

    const removeSlide = (id: string) => {
        if (window.confirm("Supprimer ce slide ?")) {
            updateSlider({ slides: currentSlider.slides.filter(s => s.id !== id) });
        }
    };

    const updateSlideField = (id: string, field: keyof Omit<HomepageSlide, 'image' | 'button'>, value: string) => {
        const newSlides = currentSlider.slides.map(s => s.id === id ? { ...s, [field]: value } : s);
        updateSlider({ slides: newSlides });
    };

    const updateSlideImageField = (id: string, field: keyof HomepageSlide['image'], value: any) => {
        const newSlides = currentSlider.slides.map(s => s.id === id ? { ...s, image: { ...s.image, [field]: value } } : s);
        updateSlider({ slides: newSlides });
    };

    const updateSlideButtonField = (id: string, field: keyof HomepageSlide['button'], value: any) => {
         const newSlides = currentSlider.slides.map(s => s.id === id ? { ...s, button: { ...s.button, [field]: value } } : s);
        updateSlider({ slides: newSlides });
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newSlides = currentSlider.slides.map(s => s.id === id ? { ...s, image: { ...s.image, url: reader.result as string } } : s);
                updateSlider({ slides: newSlides });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newSlides = [...currentSlider.slides];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSlides.length) return;
        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
        updateSlider({ slides: newSlides });
    };

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateGeneralSettings({ ...generalSettings, ...sliders });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><PhotoIcon className="w-7 h-7" /><span>Gestion des Sliders</span></div>}>
            <div className="flex border-b border-black/10 dark:border-white/10 mb-6">
                {(['homepageSlider', 'homepageSlider2', 'homepageSlider3'] as SliderKey[]).map((key, i) => (
                    <button key={key} onClick={() => setActiveSlider(key)} className={`px-4 py-2 text-sm font-semibold ${activeSlider === key ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}>Slider {i + 1}</button>
                ))}
            </div>

            <div className="space-y-6">
                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl flex items-center justify-between">
                    <label className="font-semibold">Activer ce slider</label>
                    <button onClick={() => updateSlider({ enabled: !currentSlider.enabled })} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${currentSlider.enabled ? 'bg-accent' : 'bg-gray-400'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${currentSlider.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                </div>

                <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl space-y-3">
                    {currentSlider.slides.map((slide, index) => (
                        <div key={slide.id} className="p-3 bg-black/5 dark:bg-white/5 rounded-lg flex flex-col md:flex-row items-start gap-4">
                            <div className="flex md:flex-col items-center gap-2 md:gap-0 self-center">
                                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5 rotate-180"/></button>
                                <button onClick={() => handleMove(index, 'down')} disabled={index === currentSlider.slides.length - 1} className="disabled:opacity-20"><ChevronDownIcon className="w-5 h-5"/></button>
                            </div>
                            <div className="flex-shrink-0">
                                <img src={slide.image.url} alt="preview" className="w-32 h-20 object-cover rounded-md" />
                                <input type="file" accept="image/*" id={`img-${slide.id}`} className="hidden" onChange={e => handleImageUpload(e, slide.id)} />
                                <label htmlFor={`img-${slide.id}`} className="text-xs text-accent cursor-pointer hover:underline mt-1 block">Changer</label>
                            </div>
                             <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm w-full">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500">Contenu Texte</label>
                                    <div className="space-y-2 mt-1">
                                        <input type="text" value={slide.title} onChange={e => updateSlideField(slide.id, 'title', e.target.value)} placeholder="Titre" className="w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md" />
                                        <input type="text" value={slide.subtitle} onChange={e => updateSlideField(slide.id, 'subtitle', e.target.value)} placeholder="Sous-titre" className="w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md" />
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs">Align:</label>
                                            {['left', 'center', 'right'].map(align => (
                                                <OptionButton key={align} label={align} value={align} current={slide.textAlign} onClick={() => updateSlideField(slide.id, 'textAlign', align as 'left' | 'center' | 'right')} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                 <div>
                                    <label className="text-xs font-semibold text-gray-500">Image</label>
                                    <div className="space-y-2 mt-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <label className="text-xs">Position:</label>
                                            {['left', 'right', 'background'].map(pos => (
                                                <OptionButton key={pos} label={pos} value={pos} current={slide.image.position} onClick={() => updateSlideImageField(slide.id, 'position', pos as 'left' | 'right' | 'background')} />
                                            ))}
                                        </div>
                                        {slide.image.position !== 'background' && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <label className="text-xs">Ratio:</label>
                                                {['1:1', '2:1', '3:4', '16:9'].map(ratio => (
                                                    <OptionButton key={ratio} label={ratio} value={ratio} current={slide.image.ratio} onClick={() => updateSlideImageField(slide.id, 'ratio', ratio)} />
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <label className="text-xs">Align. V:</label>
                                            {['top', 'center', 'bottom'].map(pos => (
                                                <OptionButton key={pos} label={pos} value={pos} current={slide.image.objectPosition} onClick={() => updateSlideImageField(slide.id, 'objectPosition', pos as 'top' | 'center' | 'bottom')} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                 <div>
                                    <label className="text-xs font-semibold text-gray-500">Bouton</label>
                                    <div className="space-y-2 mt-1">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs">Activer</label>
                                            <button onClick={() => updateSlideButtonField(slide.id, 'enabled', !slide.button.enabled)} className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${slide.button.enabled ? 'bg-accent' : 'bg-gray-400'}`}>
                                                <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${slide.button.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                        {slide.button.enabled && (
                                            <div className="space-y-2 animate-fade-in">
                                                <input type="text" value={slide.button.text} onChange={e => updateSlideButtonField(slide.id, 'text', e.target.value)} placeholder="Texte du bouton" className="w-full bg-white/50 dark:bg-black/30 p-1.5 rounded-md" />
                                                <UrlSelector value={slide.button.url} onChange={newUrl => updateSlideButtonField(slide.id, 'url', newUrl)} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => removeSlide(slide.id)} className="p-2 hover:bg-red-500/10 rounded-full self-center"><TrashIcon className="w-5 h-5 text-red-500" /></button>
                        </div>
                    ))}
                    <button onClick={addSlide} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg font-semibold hover:bg-accent/20 transition-colors"><PlusIcon className="w-5 h-5" /> Ajouter un slide</button>
                </div>
                
                <div className="mt-6">
                    <button onClick={handleSave} disabled={saveStatus !== 'idle'} className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-accent/70' : 'bg-accent hover:bg-accent/90'}`}>
                        {saveStatus === 'idle' && 'Enregistrer les Sliders'}
                        {saveStatus === 'saving' && <><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>}
                        {saveStatus === 'saved' && <><CheckIcon className="w-5 h-5" /><span>Enregistré !</span></>}
                    </button>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminSliderManagement;