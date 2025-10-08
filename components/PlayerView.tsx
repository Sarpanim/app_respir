import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, PlayIcon, PauseIcon, RewindIcon, ForwardIcon } from './Icons';

const PlayerView: React.FC = () => {
    const { 
        currentPlayingCourse, currentlyPlayingLesson, isPlaying,
        audioCurrentTime, audioDuration,
        togglePlayPause, seekAudio, playNext, playPrev, navigateToGrid, navigateToPlayer
    } = useAppContext();
    
    if (!currentPlayingCourse || !currentlyPlayingLesson) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-light-bg dark:bg-dark-bg">
                <p className="text-gray-600 dark:text-gray-400">Aucune leçon en cours de lecture.</p>
                <button onClick={navigateToGrid} className="mt-4 text-accent font-semibold">Retour à l'accueil</button>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        seekAudio(Number(e.target.value));
    };

    const handleBack = () => {
        if (currentPlayingCourse) {
            navigateToPlayer(currentPlayingCourse.id);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">
            <img 
              src={currentPlayingCourse.image.url} 
              alt={currentPlayingCourse.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black"></div>
            
            <header className="relative z-10 p-4">
                <button onClick={handleBack} className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center text-center p-4 relative z-10">
                <div className="my-auto">
                    <h1 className="text-3xl lg:text-4xl font-elsie font-bold drop-shadow-lg">{currentlyPlayingLesson.title}</h1>
                    <p className="text-lg text-gray-300 mt-2 drop-shadow-md">{currentPlayingCourse.title}</p>
                </div>

                <div className="my-12">
                    <button 
                        onClick={togglePlayPause} 
                        className="w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 transition-transform hover:scale-105 shadow-2xl"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12 pl-1" />}
                    </button>
                </div>
            </main>

            <footer className="relative z-10 p-6">
                <div className="max-w-xl mx-auto">
                    <div className="flex items-center gap-2 text-xs">
                        <span>{formatTime(audioCurrentTime)}</span>
                        <input 
                            type="range" 
                            min="0" 
                            max={audioDuration || 1} 
                            value={audioCurrentTime} 
                            onChange={handleSeek} 
                            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" 
                        />
                        <span>-{formatTime(audioDuration - audioCurrentTime)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-8 mt-4">
                        <button onClick={playPrev}><RewindIcon className="w-8 h-8 text-gray-300 hover:text-white transition-colors" /></button>
                        <button onClick={playNext}><ForwardIcon className="w-8 h-8 text-gray-300 hover:text-white transition-colors" /></button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PlayerView;