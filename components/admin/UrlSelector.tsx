import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Course, Ambience } from '../../types';

interface UrlSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const UrlSelector: React.FC<UrlSelectorProps> = ({ value, onChange }) => {
    const { courses, ambiences } = useAppContext();
    const [internalRoutes, setInternalRoutes] = useState<any[]>([]);

    useEffect(() => {
        const routes = [
            { label: '--- Pages principales ---', value: '', disabled: true },
            { label: 'Accueil', value: '/grid' },
            { label: 'Découvrir', value: '/discover' },
            { label: 'Mes Cours', value: '/my-courses' },
            { label: 'Profil', value: '/profile' },
            { label: 'Paramètres', value: '/settings' },
            { label: 'Abonnements', value: '/subscription' },
        ];

        if (courses.length > 0) {
            routes.push({ label: '--- Cours ---', value: '', disabled: true });
            courses.forEach((course: Course) => {
                routes.push({ label: course.title, value: `/player/${course.id}` });
            });
        }

        if (ambiences.length > 0) {
            routes.push({ label: '--- Ambiances ---', value: '', disabled: true });
            ambiences.forEach((ambience: Ambience) => {
                routes.push({ label: ambience.title, value: `/ambience-player/${ambience.id}` });
            });
        }
        
        setInternalRoutes(routes);

    }, [courses, ambiences]);

    const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (selectedValue.startsWith('http')) {
            // It's an external URL, do nothing or handle as needed
        } else {
            onChange(selectedValue);
        }
    };

    const handleManualUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="space-y-2">
            <select 
                value={value.startsWith('/') ? value : ''} 
                onChange={handleSelection}
                className="w-full input-style"
            >
                <option value="">Sélectionner une page interne...</option>
                <optgroup label="Navigation Interne">
                    {internalRoutes.map((opt, index) => <option key={`${opt.label}-${index}`} value={opt.value} disabled={(opt as any).disabled}>{opt.label}</option>)}
                </optgroup>
            </select>
            <div className="flex items-center">
                <span className="px-3 text-gray-500">ou</span>
                <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
            </div>
            <input 
                type="text"
                placeholder="Entrer une URL externe (https://...)"
                value={value}
                onChange={handleManualUrl}
                className="w-full input-style"
            />
        </div>
    );
};

export default UrlSelector;