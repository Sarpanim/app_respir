import React, { useState, useEffect } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { HomepageSlider, HomepageSlide } from '../../types';
import { PhotoIcon, PlusIcon, TrashIcon, CheckIcon, ArrowPathIcon } from '../Icons';
import { v4 as uuidv4 } from 'uuid';
import UrlSelector from './UrlSelector';

const AdminSliderManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [currentSlider, setCurrentSlider] = useState<HomepageSlider>(generalSettings.homepageSlider);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setCurrentSlider(generalSettings.homepageSlider);
    }, [generalSettings.homepageSlider]);

    const updateSlider = (update: Partial<HomepageSlider>) => {
        const newSlider = { ...currentSlider, ...update };
        setCurrentSlider(newSlider);
        setHasChanges(true);
    };

    const handleSave = () => {
        updateGeneralSettings({
            ...generalSettings,
            homepageSlider: currentSlider
        });
        setHasChanges(false);
    };

    const addSlide = () => {
        const newSlide: HomepageSlide = {
            id: uuidv4(),
            image: { url: '', alt: '' },
            title: { text: 'Nouveau Slide', color: '#FFFFFF', font: 'elsie' },
            subtitle: { text: 'Description du slide', color: '#FFFFFF', font: 'sans' },
            button: { text: 'Découvrir', link: '/', style: 'primary' }
        };
        updateSlider({ slides: [...currentSlider.slides, newSlide] });
    };

    const removeSlide = (id: string) => {
        if (window.confirm("Supprimer ce slide ?")) {
            updateSlider({ slides: currentSlider.slides.filter((s: HomepageSlide) => s.id !== id) });
        }
    };
    
    const updateSlideTextField = (id: string, field: 'title' | 'subtitle', subfield: 'text' | 'color' | 'font', value: any) => {
        const newSlides = currentSlider.slides.map((s: HomepageSlide) => s.id === id ? { ...s, [field]: { ...s[field], [subfield]: value } } : s);
        updateSlider({ slides: newSlides });
    };

    const updateSlideImageField = (id: string, field: keyof HomepageSlide['image'], value: any) => {
        const newSlides = currentSlider.slides.map((s: HomepageSlide) => s.id === id ? { ...s, image: { ...s.image, [field]: value } } : s);
        updateSlider({ slides: newSlides });
    };

    const updateSlideButtonField = (id: string, field: keyof HomepageSlide['button'], value: any) => {
         const newSlides = currentSlider.slides.map((s: HomepageSlide) => s.id === id ? { ...s, button: { ...s.button, [field]: value } } : s);
        updateSlider({ slides: newSlides });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newSlides = currentSlider.slides.map((s: HomepageSlide) => s.id === id ? { ...s, image: { ...s.image, url: reader.result as string } } : s);
                updateSlider({ slides: newSlides });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AdminPageLayout title={
            <div className="flex items-center gap-3">
                <PhotoIcon className="w-7 h-7" />
                <span>Gestion des Sliders</span>
            </div>
        }>
            <div className="flex justify-end mb-4">
                <button onClick={addSlide} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark">
                    <PlusIcon className="w-5 h-5" />
                    Ajouter un Slide
                </button>
            </div>

            <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl space-y-3">
                {currentSlider.slides.map((slide: HomepageSlide, index: number) => (
                    <div key={slide.id} className="p-3 bg-black/5 dark:bg-white/5 rounded-lg flex flex-col md:flex-row items-start gap-4">
                        <div className="w-full md:w-1/3">
                            <img src={slide.image.url} alt={slide.image.alt} className="rounded-lg aspect-video object-cover" />
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, slide.id)} className="text-xs mt-2" />
                            <input type="text" value={slide.image.alt} onChange={e => updateSlideImageField(slide.id, 'alt', e.target.value)} placeholder="Texte alternatif" className="input-style w-full mt-2 text-sm" />
                        </div>
                        <div className="w-full md:w-2/3 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" value={slide.title.text} onChange={e => updateSlideTextField(slide.id, 'title', 'text', e.target.value)} placeholder="Titre" className="input-style" />
                                <input type="color" value={slide.title.color} onChange={e => updateSlideTextField(slide.id, 'title', 'color', e.target.value)} className="input-style h-10" />
                            </div>
                             <div className="grid grid-cols-2 gap-2">
                                <input type="text" value={slide.subtitle.text} onChange={e => updateSlideTextField(slide.id, 'subtitle', 'text', e.target.value)} placeholder="Sous-titre" className="input-style" />
                                <input type="color" value={slide.subtitle.color} onChange={e => updateSlideTextField(slide.id, 'subtitle', 'color', e.target.value)} className="input-style h-10" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" value={slide.button.text} onChange={e => updateSlideButtonField(slide.id, 'text', e.target.value)} placeholder="Texte du bouton" className="input-style" />
                                <select value={slide.button.style} onChange={e => updateSlideButtonField(slide.id, 'style', e.target.value)} className="input-style">
                                    <option value="primary">Primaire</option>
                                    <option value="secondary">Secondaire</option>
                                    <option value="outline">Contour</option>
                                </select>
                            </div>
                            <UrlSelector value={slide.button.link} onChange={value => updateSlideButtonField(slide.id, 'link', value)} />
                        </div>
                        <button onClick={() => removeSlide(slide.id)} className="p-2 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>

            {hasChanges && (
                <button
                    onClick={handleSave}
                    className="fixed bottom-28 right-8 z-50 bg-accent text-white rounded-full p-4 shadow-lg hover:scale-110 active:scale-100 transition-transform duration-200 ease-in-out animate-fade-in"
                    aria-label="Sauvegarder les modifications"
                >
                    <CheckIcon className="w-6 h-6" />
                </button>
            )}
        </AdminPageLayout>
    );
};

export default AdminSliderManagement;