import React from 'react';
import { Ambience } from '../types';
import { PlayCircleIcon, ClockIcon, BookmarkIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

interface AmbienceCardProps {
    ambience: Ambience;
}

const AmbienceCard: React.FC<AmbienceCardProps> = ({ ambience }) => {
    const { navigateTo, isFavoriteAmbience, toggleFavoriteAmbience } = useAppContext();
    const isFavorite = isFavoriteAmbience(ambience.id);

    return (
        <div className="bg-white/10 dark:bg-black/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-lg border border-white/20 dark:border-black/30 transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
            <div className="relative">
                <img src={ambience.image.url} alt={ambience.image.alt} className="w-full h-48 object-cover" />
                <div 
                    onClick={() => navigateTo('ambience-player', { ambienceId: ambience.id })}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                    <PlayCircleIcon className="w-16 h-16 text-white/80" />
                </div>
                <button 
                    onClick={() => toggleFavoriteAmbience(ambience.id)}
                    className="absolute top-3 right-3 bg-black/40 p-2 rounded-full text-white hover:text-accent transition-colors"
                >
                    <BookmarkIcon className={`w-5 h-5 ${isFavorite ? 'fill-current text-accent' : ''}`} />
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-elsie font-bold text-lg text-gray-800 dark:text-white">{ambience.title}</h3>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                    <ClockIcon className="w-4 h-4 mr-1.5" />
                    <span>{ambience.duration} min</span>
                </div>
            </div>
        </div>
    );
};

export default AmbienceCard;