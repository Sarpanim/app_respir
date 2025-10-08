import React from 'react';
import { useAppContext } from '../context/AppContext';
import { AMBIENCE_CATEGORIES } from '../constants';
import { ChevronLeftIcon, PlayIcon, PauseIcon, BookmarkIcon, BookmarkSolidIcon, ClockIcon } from './Icons';

const AmbiencePlayer: React.FC = () => {
    const { 
        currentlyPlayingAmbience,
        isPlaying,
        audioCurrentTime,
        audioDuration,
        togglePlayPause,
        seekAudio,
        navigateToAmbience, 
        favoriteAmbienceIds, 
        toggleFavoriteAmbience 
    } = useAppContext();
    
    if (!currentlyPlayingAmbience) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-8">
                <p>Ambiance sonore non trouvée.</p>
                <button onClick={navigateToAmbience} className="mt-4 text-accent">Retour aux ambiances</button>
            </div>
        );
    }
    
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        seekAudio(Number(e.target.value));
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    const category = AMBIENCE_CATEGORIES.find(c => c.id === currentlyPlayingAmbience.categoryId);
    const isFavorite = favoriteAmbienceIds.includes(currentlyPlayingAmbience.id);
    const displayDuration = audioDuration || currentlyPlayingAmbience.duration;

    return (
        <div className="flex flex-col h-screen bg-light-bg dark:bg-dark-bg">
            <div className="relative w-full h-2/5">
                <img src={currentlyPlayingAmbience.image.url} alt={currentlyPlayingAmbience.title} className="w-full h-full object-cover" style={{ objectPosition: currentlyPlayingAmbience.image.position }} />
                <div className="absolute inset-0 bg-gradient-to-t from-light-bg via-light-bg/80 to-transparent dark:from-dark-bg dark:via-dark-bg/80"></div>
                <button onClick={navigateToAmbience} className="absolute top-10 left-4 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm z-10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4 -mt-16 relative z-10">
                {category && <span className="text-sm font-semibold bg-white/40 dark:bg-black/20 text-accent px-3 py-1 rounded-full mb-2 inline-block backdrop-blur-sm">{category.name}</span>}
                <h1 className="text-4xl font-elsie font-bold">{currentlyPlayingAmbience.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                    <ClockIcon className="w-5 h-5"/>
                    <span>{Math.floor(currentlyPlayingAmbience.duration / 60)} minutes</span>
                </div>
            </div>

            <div className="flex-shrink-0 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg border-t border-black/10 dark:border-white/10 p-4">
                 <div className="max-w-xl mx-auto">
                    <div className="flex items-center justify-between">
                         <h3 className="font-bold text-lg">{currentlyPlayingAmbience.title}</h3>
                         <button onClick={() => toggleFavoriteAmbience(currentlyPlayingAmbience.id)}>
                            {isFavorite 
                                ? <BookmarkSolidIcon className="w-6 h-6 text-accent" /> 
                                : <BookmarkIcon className="w-6 h-6 text-gray-500" />
                            }
                         </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-2">
                        <span>{formatTime(audioCurrentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={displayDuration}
                            value={audioCurrentTime}
                            onChange={handleSeek}
                            className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                        <span>-{formatTime(displayDuration - audioCurrentTime)}</span>
                    </div>

                    <div className="flex items-center justify-center gap-8 mt-4">
                        <button onClick={togglePlayPause} className="bg-accent text-white w-20 h-20 rounded-full flex flex-shrink-0 items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                            {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10 pl-0.5" />}
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default AmbiencePlayer;