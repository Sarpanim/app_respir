import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { AMBIENCE_CATEGORIES } from '../constants';
import { ChevronLeftIcon, PlayIcon, PauseIcon, BookmarkIcon, ClockIcon } from './Icons';

const AmbiencePlayer: React.FC = () => {
    const { currentView, currentParams, navigateTo, ambiences, isFavoriteAmbience, toggleFavoriteAmbience } = useAppContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const ambienceId = currentParams?.ambienceId;
    const ambience = ambiences.find(a => a.id === ambienceId);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handlePause);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handlePause);
        };
    }, [ambienceId]);

    if (!ambience) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Ambiance non trouvée.</p>
                <button onClick={() => navigateTo('discover')} className="ml-4 px-4 py-2 bg-accent text-white rounded">Retour</button>
            </div>
        );
    }
    
    const isFavorite = isFavoriteAmbience(ambience.id);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    const category = AMBIENCE_CATEGORIES.find(c => c.id === ambience.categoryId);

    return (
        <div className="relative min-h-screen bg-black text-white flex flex-col animate-fade-in">
            <img src={ambience.image.url} alt={ambience.image.alt} className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            
            <div className="relative z-10 p-6 flex-shrink-0">
                <button onClick={() => navigateTo('discover')} className="flex items-center gap-2 text-white/80 hover:text-white">
                    <ChevronLeftIcon className="w-6 h-6" />
                    <span>Retour</span>
                </button>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center flex-grow p-6">
                {category && <p className="text-accent font-semibold">{category.name}</p>}
                <h1 className="text-4xl md:text-6xl font-elsie font-bold mt-2">{ambience.title}</h1>
                <div className="flex items-center text-white/70 mt-4">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    <span>{ambience.duration} minutes</span>
                </div>
            </div>

            <div className="relative z-10 p-6 bg-black/30 backdrop-blur-md rounded-t-3xl">
                <div className="w-full bg-white/20 rounded-full h-1.5 mb-4">
                    <div className="bg-white h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex items-center justify-between">
                    <button onClick={() => toggleFavoriteAmbience(ambience.id)} className="p-3">
                        <BookmarkIcon className={`w-7 h-7 transition-colors ${isFavorite ? 'text-accent fill-current' : 'text-white/70'}`} />
                    </button>
                    <div className="flex items-center gap-6">
                        {/* Placeholder for other controls like rewind/forward */}
                    </div>
                    <button onClick={togglePlay} className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                        {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
                    </button>
                    <div className="flex items-center gap-6">
                        {/* Placeholder for other controls like volume */}
                    </div>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </div>
            <audio ref={audioRef} src={ambience.audio} />
        </div>
    );
};

export default AmbiencePlayer;