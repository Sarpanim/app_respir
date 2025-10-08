
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PlayIcon, PauseIcon, XMarkIcon, RewindIcon, ForwardIcon } from './Icons';

const MiniPlayer: React.FC = () => {
    const {
        currentPlayingCourse, currentlyPlayingLesson, currentlyPlayingAmbience, isPlaying,
        audioCurrentTime, audioDuration, ambienceCategories,
        togglePlayPause, navigateToPlayerView, navigateToAmbiencePlayerView, closePlayer,
        seekAudio, playNext, playPrev
    } = useAppContext();

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        closePlayer();
    };
    
    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        seekAudio(Number(e.target.value));
    };


    let image, title, subtitle, onClickAction, ariaLabel;

    if (currentlyPlayingLesson && currentPlayingCourse) {
        image = currentPlayingCourse.image.url;
        title = currentlyPlayingLesson.title;
        subtitle = currentPlayingCourse.title;
        onClickAction = navigateToPlayerView;
        ariaLabel = `Ouvrir le lecteur pour ${title}`;
    } else if (currentlyPlayingAmbience) {
        image = currentlyPlayingAmbience.image.url;
        title = currentlyPlayingAmbience.title;
        const category = ambienceCategories.find(c => c.id === currentlyPlayingAmbience.categoryId);
        subtitle = category ? category.name : 'Ambiance sonore';
        onClickAction = navigateToAmbiencePlayerView;
        ariaLabel = `Ouvrir le lecteur pour l'ambiance ${title}`;
    } else {
        return null;
    }

    return (
        <div 
            className="fixed bottom-20 lg:bottom-0 left-0 right-0 z-[60] animate-slide-up cursor-pointer"
            onClick={onClickAction}
            role="button"
            aria-label={ariaLabel}
        >
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-3 text-white">
                <div className="flex items-center justify-between">
                    {/* Left part: Info */}
                    <div className="flex items-center gap-3 overflow-hidden w-1/3">
                        <img src={image} alt={title} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                        <div className="overflow-hidden">
                             <p className="font-bold truncate text-sm">{title}</p>
                             <p className="text-xs text-gray-300 truncate">{subtitle}</p>
                        </div>
                    </div>

                    {/* Middle part: Controls */}
                    <div className="flex items-center gap-4">
                        {currentlyPlayingLesson ? (
                            <button onClick={(e) => { e.stopPropagation(); playPrev(); }} className="p-1 transition-opacity hover:opacity-80 disabled:opacity-50" aria-label="Piste précédente">
                                <RewindIcon className="w-7 h-7" />
                            </button>
                        ) : (
                            <div className="w-9 h-9" /> // Placeholder
                        )}
                        <button 
                            onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} 
                            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6 pl-0.5"/>}
                        </button>
                        {currentlyPlayingLesson ? (
                            <button onClick={(e) => { e.stopPropagation(); playNext(); }} className="p-1 transition-opacity hover:opacity-80 disabled:opacity-50" aria-label="Piste suivante">
                                <ForwardIcon className="w-7 h-7" />
                            </button>
                        ) : (
                           <div className="w-9 h-9" /> // Placeholder
                        )}
                    </div>

                    {/* Right part: Close */}
                    <div className="flex items-center justify-end w-1/3">
                        <button 
                            onClick={handleClose} 
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
                            aria-label="Fermer le lecteur"
                        >
                            <XMarkIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                {/* Bottom part: Progress bar */}
                <div className="flex items-center gap-3 text-xs mt-2" onClick={e => e.stopPropagation()}>
                    <span className="font-mono w-10 text-center">{formatTime(audioCurrentTime)}</span>
                    <input 
                        type="range" 
                        min="0" 
                        max={audioDuration || 1} 
                        value={audioCurrentTime} 
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" 
                        aria-label="Barre de progression"
                    />
                    <span className="font-mono w-10 text-center">-{formatTime(audioDuration - audioCurrentTime)}</span>
                </div>
            </div>
        </div>
    );
};

export default MiniPlayer;
