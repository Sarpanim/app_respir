import React, { useState, useMemo, useEffect } from 'react';
import { useCourses } from '../../context/CourseContext';
import { CATEGORIES, AVAILABLE_ROUTES } from '../../constants';

const slugify = (text: string) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

interface UrlSelectorProps {
    value: string;
    onChange: (newValue: string) => void;
}

const UrlSelector: React.FC<UrlSelectorProps> = ({ value, onChange }) => {
    const { courses } = useCourses();

    const internalRoutes = useMemo(() => [
        { label: '--- Pages Principales ---', value: '#', disabled: true },
        ...AVAILABLE_ROUTES.map(r => ({ label: `Page: ${r.name}`, value: `/${r.route}` })),
        { label: '--- Catégories ---', value: '#', disabled: true },
        ...CATEGORIES.map(c => ({ label: `Catégorie: ${c.name}`, value: `/categorie/${slugify(c.name)}` })),
        { label: '--- Cours ---', value: '#', disabled: true },
        ...courses.map(c => ({ label: `Cours: ${c.title}`, value: `/cours/${slugify(c.title)}` })),
    ], [courses]);
    
    const isCustom = useMemo(() => !internalRoutes.some(r => r.value === value), [value, internalRoutes]);

    const [selectedValue, setSelectedValue] = useState(isCustom ? 'custom' : value);
    const [customValue, setCustomValue] = useState(isCustom ? value : '#');

    useEffect(() => {
        const isValCustom = !internalRoutes.some(r => r.value === value);
        setSelectedValue(isValCustom ? 'custom' : value);
        if (isValCustom) {
            setCustomValue(value);
        }
    }, [value, internalRoutes]);


    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedValue(val);
        if (val !== 'custom') {
            onChange(val);
        } else {
            onChange(customValue);
        }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <select value={selectedValue} onChange={handleSelectChange} className="text-sm bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20">
                <optgroup label="Navigation Interne">
                    {internalRoutes.map((opt, index) => <option key={`${opt.label}-${index}`} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
                </optgroup>
                <optgroup label="Autre">
                    <option value="custom">URL Personnalisée</option>
                </optgroup>
            </select>
            {selectedValue === 'custom' && (
                <input type="text" value={customValue} onChange={handleCustomChange} placeholder="#" className="text-sm bg-white/50 dark:bg-black/30 p-1.5 rounded-md border border-black/20 dark:border-white/20 w-32" />
            )}
        </div>
    );
};

export default UrlSelector;
